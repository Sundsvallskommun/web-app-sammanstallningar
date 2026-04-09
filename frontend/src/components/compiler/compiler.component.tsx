import React, { useEffect, useRef, useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import { Button, Disclosure, Divider, Icon, Spinner, TextField, useSnackbar, Alert } from '@sk-web-gui/react';
import { ArrowLeft, ArrowRight, Info, IterationCcw } from 'lucide-react';
import { useSession } from '@services/session-service/use-session';
import { getStepExecution, runAllSteps, runStep } from '@services/session-service/session-service';
import { useTranslation } from 'next-i18next';
import { Helper } from '@components/helper/helper.component';
import { StepExecution, StepExecutionStateEnum } from '@data-contracts/backend/data-contracts';
import { useForm } from 'react-hook-form';
import sanitized from '@utils/sanitizer';

interface CompilerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
  stepIndex: number;
  setStepIndex: (number: number) => void;
  submitCount: number;
}

interface StepInputDependency {
  'flow-input-ref'?: string;
  'use-output-from-step'?: string;
}

export const Compiler: React.FC<CompilerProps> = (props) => {
  const { currentStep, handleChangeStep, stepIndex, setStepIndex, submitCount } = props;
  const { t } = useTranslation();
  const toastMessage = useSnackbar();
  const { flow } = useFlowStore();
  const { data: session, refresh: refreshSession } = useSession();
  const { register, getValues } = useForm();
  const [isCompiling, setIsCompiling] = useState<boolean>(true);
  const [isReRunningStep, setIsReRunningStep] = useState<boolean[]>([]);
  const [intervalId, setIntervalId] = useState(null);
  const [open, setOpen] = useState<{ [key: number]: boolean }>({ 0: true });
  const interval = useRef<NodeJS.Timeout | null>(null);
  const sortedSteps = flow?.steps ? [...flow.steps].sort((a, b) => a.order - b.order) : [];
  const stepDependencies = sortedSteps.reduce<Record<string, string[]>>((dependencies, step) => {
    if (!step.id) {
      return dependencies;
    }

    dependencies[step.id] = (step.input ?? []).reduce<string[]>((stepInputDependencies, stepInput) => {
      const dependencyStepId =
        (stepInput as StepInputDependency)['use-output-from-step'] ??
        (stepInput as StepInputDependency)['flow-input-ref'];

      return dependencyStepId ? [...stepInputDependencies, dependencyStepId] : stepInputDependencies;
    }, []);

    return dependencies;
  }, {});

  const getStepTimestamp = (stepId?: string) => {
    if (!stepId) {
      return null;
    }

    const stepExecution = session?.stepExecutions?.[stepId] as StepExecution | undefined;
    const timestamp = stepExecution?.finishedAt ?? stepExecution?.lastUpdatedAt;

    if (!timestamp) {
      return null;
    }

    const parsedTimestamp = new Date(timestamp).getTime();
    return Number.isNaN(parsedTimestamp) ? null : parsedTimestamp;
  };

  const getUpstreamStepIds = (stepId?: string) => {
    if (!stepId) {
      return [];
    }

    const upstreamStepIds = new Set<string>();

    const collectDependencies = (currentStepId: string) => {
      (stepDependencies[currentStepId] ?? []).forEach((dependencyStepId) => {
        if (upstreamStepIds.has(dependencyStepId)) {
          return;
        }

        upstreamStepIds.add(dependencyStepId);
        collectDependencies(dependencyStepId);
      });
    };

    collectDependencies(stepId);

    return Array.from(upstreamStepIds);
  };

  const staleStepIds = sortedSteps.reduce<Record<string, boolean>>((stepStatuses, step) => {
    if (!step.id) {
      return stepStatuses;
    }

    const stepExecution = session?.stepExecutions?.[step.id] as StepExecution | undefined;

    if (stepExecution?.state !== StepExecutionStateEnum.DONE) {
      stepStatuses[step.id] = false;
      return stepStatuses;
    }

    const stepTimestamp = getStepTimestamp(step.id);

    if (!stepTimestamp) {
      stepStatuses[step.id] = false;
      return stepStatuses;
    }

    stepStatuses[step.id] = getUpstreamStepIds(step.id).some((dependencyStepId) => {
      const dependencyTimestamp = getStepTimestamp(dependencyStepId);

      return dependencyTimestamp !== null && dependencyTimestamp > stepTimestamp;
    });

    return stepStatuses;
  }, {});

  const handleReRunningStepsLoading = (index: number) => {
    const steps = [...isReRunningStep];
    steps[index] = true;
    setIsReRunningStep(steps);
  };

  const executeAllSteps = (index: number) => {
    if (!flow || !session?.id) {
      return;
    }

    refreshSession(session?.id);
    setStepIndex(index);

    if (index === 0 && submitCount === 1) {
      runAllSteps(session.id)
        .then(() => refreshSession(session.id))
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: true,
            message: t('step:compiler.error'),
            status: 'error',
          });
        });
    }

    if (index < sortedSteps.length) {
      try {
        interval.current = setInterval(async () => {
          setIntervalId(interval);
          await getStepExecution(session.id, sortedSteps[index].id)
            .then((executedStep: StepExecution) => {
              if (executedStep.state === StepExecutionStateEnum.DONE) {
                clearInterval(interval.current);
                executeAllSteps(index + 1);
              } else if (executedStep.state === StepExecutionStateEnum.ERROR) {
                clearInterval(interval.current);
                toastMessage({
                  position: 'bottom',
                  closeable: true,
                  message: t('step:compiler.specific_step_error'),
                  status: 'error',
                });
              }
            })
            .catch(() => {
              clearInterval(interval.current);
              toastMessage({
                position: 'bottom',
                closeable: true,
                message: t('step:compiler.error'),
                status: 'error',
              });
            });
        }, 1000);
      } catch (e) {
        console.error('Something went wrong when executing all steps', e);
      }
    } else {
      setIsCompiling(false);
    }
  };

  const reRunStep = (stepId: string, index: number) => {
    if (getValues(`input-${index}`)) {
      handleReRunningStepsLoading(index);
      runStep(session.id, stepId, getValues(`input-${index}`))
        .then(() => {
          try {
            interval.current = setInterval(async () => {
              await getStepExecution(session.id, stepId)
                .then((executedStep: StepExecution) => {
                  if (executedStep.state === StepExecutionStateEnum.DONE) {
                    clearInterval(interval.current);
                  } else if (executedStep.state === StepExecutionStateEnum.ERROR) {
                    clearInterval(interval.current);
                  }
                })
                .catch(() => {
                  toastMessage({
                    position: 'bottom',
                    closeable: true,
                    message: t('step:compiler.error'),
                    status: 'error',
                  });
                });
            }, 1000);
          } catch (e) {
            console.error('Something went wrong when rerunning step', e);
          }
        })
        .then(() => {
          setIsReRunningStep([]);
          refreshSession(session.id);
        });
    } else {
      toastMessage({
        position: 'bottom',
        closeable: true,
        message: t('step:compiler.give_instruction_info'),
        status: 'info',
      });
    }
  };

  useEffect(() => {
    executeAllSteps(0);
    return () => {
      clearInterval(intervalId);
      clearInterval(interval.current);
    };
  }, []);

  useEffect(() => {
    refreshSession(session?.id);
  }, [stepIndex, isCompiling]);

  return (
    flow &&
    session && (
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-h1-sm mb-32">{t('step:compiler.title', { flow: flow.name })}</h1>
          <Helper currentStep={currentStep} />
        </div>

        <div className="gap-24 px-24 py-32 bg-background-100 rounded-cards border-1 border-divider">
          {sortedSteps.map((input, index) => {
            const stepExecution = session?.stepExecutions?.[input.id] as StepExecution | undefined;
            const isStepDone = stepExecution?.state === StepExecutionStateEnum.DONE;
            const isStaleStep = input.id ? staleStepIds[input.id] : false;

            return (
              <div key={input.id ?? index}>
                {!isStepDone && (
                  <div className="relative">
                    <div className="absolute z-10 right-4 top-12 bg-bjornstigen-background-100 rounded-cards">
                      <Button variant="tertiary" size="sm" iconButton rounded disabled>
                        <Spinner className="p-4" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                <Disclosure
                  open={open[index]}
                  onToggleOpen={(open) => setOpen((old) => ({ ...old, [index]: open }))}
                  disabled={!isStepDone}
                >
                  <Disclosure.Header>
                    <Disclosure.Title>
                      <div className="flex items-center gap-8 pr-16">
                        <span>{input.order + '. ' + input.name}</span>
                        {isStaleStep && !open[index] && (
                          <span
                            className="inline-flex items-center gap-4 rounded-20 border-1 border-divider bg-background-content px-8 py-2 text-small font-semibold"
                            data-cy={`step-stale-indicator-${input.id}`}
                          >
                            <Icon size="1rem" icon={<Info />} />
                            {t('step:compiler.stale_step_badge')}
                          </span>
                        )}
                      </div>
                    </Disclosure.Title>
                    <Disclosure.Button />
                  </Disclosure.Header>
                  <Disclosure.Content>
                    {isStepDone ?
                      <div className="w-2/3">
                        {isStaleStep && (
                          <Alert className="mb-16" size="sm" type="warning" data-cy={`step-stale-warning-${input.id}`}>
                            <Alert.Icon />
                            <Alert.Content>
                              <Alert.Content.Title>{t('step:compiler.stale_step_badge')}</Alert.Content.Title>
                              <Alert.Content.Description>
                                {t('step:compiler.stale_step_warning')}
                              </Alert.Content.Description>
                            </Alert.Content>
                          </Alert>
                        )}
                        <span
                          className="text-large my-0 [&>*>ul]:list-disc [&>*>ul]:ml-lg [&>*>li]:list-disc [&>*>li]:ml-lg [&>*>ol]:list-decimal [&>*>ol]:ml-lg"
                          dangerouslySetInnerHTML={{
                            __html: `${sanitized(stepExecution?.output)}`,
                          }}
                        ></span>

                        <div className="flex w-full gap-10 pt-20">
                          <TextField
                            {...register(`input-${index}`)}
                            className="w-full"
                            size="sm"
                            placeholder={t('step:compiler.generate_again_placeholder')}
                            data-cy={`rerun-step-input-${input.id}`}
                          />
                          <Button
                            onClick={() => reRunStep(input.id, index)}
                            size="sm"
                            leftIcon={<IterationCcw />}
                            color="vattjom"
                            loading={isReRunningStep[index]}
                            rounded
                            inverted
                            data-cy={`rerun-step-button-${input.id}`}
                          >
                            {t('step:compiler.generate_again')}
                          </Button>
                        </div>
                      </div>
                    : <p>{t('step:compiler.generating_data')}</p>}
                  </Disclosure.Content>
                </Disclosure>
                {index < sortedSteps.length - 1 && <Divider />}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-32">
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                clearInterval(intervalId);
                handleChangeStep(currentStep - 1);
              }}
              leftIcon={<ArrowLeft />}
              data-cy="go-back-button"
            >
              {t('step:go_back')}
            </Button>
          </div>
          <div>
            <Button
              variant="primary"
              onClick={() => handleChangeStep(currentStep + 1)}
              color="vattjom"
              rightIcon={<ArrowRight />}
              disabled={isCompiling}
              data-cy="save-document"
            >
              {t('step:compiler.save')}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
