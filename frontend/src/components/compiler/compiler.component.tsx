import React, { useEffect, useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import { Button, Disclosure, Divider, Spinner, TextField, useSnackbar } from '@sk-web-gui/react';
import { ArrowLeft, ArrowRight, IterationCcw } from 'lucide-react';
import { useSession } from '@services/session-service/use-session';
import { getStepExecution, runAllSteps, runStep } from '@services/session-service/session-service';
import { useTranslation } from 'next-i18next';
import { Helper } from '@components/helper/helper.component';
import { StepExecution, StepExecutionStateEnum } from '@data-contracts/backend/data-contracts';
import { useForm } from 'react-hook-form';

interface CompilerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
}

export const Compiler: React.FC<CompilerProps> = (props) => {
  const { currentStep, handleChangeStep } = props;
  const { t } = useTranslation();
  const toastMessage = useSnackbar();
  const { flow } = useFlowStore();
  const { data: session, refresh: refreshSession } = useSession();
  const [stepIndex, setStepIndex] = useState<number>();
  const { register, getValues } = useForm();
  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const executeAllSteps = (index: number) => {
    setStepIndex(index);

    if (index === 0) {
      setIsCompiling(true);

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

    if (index < flow.steps.length) {
      try {
        const interval = setInterval(async () => {
          await getStepExecution(session.id, flow.steps[index].id)
            .then((executedStep: StepExecution) => {
              if (executedStep.state === StepExecutionStateEnum.DONE) {
                clearInterval(interval);
                executeAllSteps(index + 1);
              } else if (executedStep.state === StepExecutionStateEnum.ERROR) {
                clearInterval(interval);
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
        console.error('Something went wrong when executing all steps', e);
      }
    } else {
      setIsCompiling(false);
    }
  };

  const reRunStep = (stepId: string, index: number) => {
    setIsCompiling(true);

    runStep(session.id, stepId, getValues(`input-${index}`)).then(() => {
      try {
        const interval = setInterval(async () => {
          await getStepExecution(session.id, stepId)
            .then((executedStep: StepExecution) => {
              if (executedStep.state === StepExecutionStateEnum.DONE) {
                clearInterval(interval);
                setIsCompiling(false);
              } else if (executedStep.state === StepExecutionStateEnum.ERROR) {
                clearInterval(interval);
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
    });

    refreshSession(session.id);
  };

  useEffect(() => {
    if (
      session?.stepExecutions[Object.keys(session.stepExecutions)[flow.steps.length - 1]]?.state !==
      StepExecutionStateEnum.DONE
    ) {
      executeAllSteps(0);
    }
  }, []);

  useEffect(() => {
    refreshSession(session.id);
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
          {flow.steps.map((input, index) => {
            return (
              <div key={index}>
                {session?.stepExecutions[flow.steps[index].id]?.state !== StepExecutionStateEnum.DONE && (
                  <div className="relative">
                    <div className="absolute z-10 right-4 top-12 bg-bjornstigen-background-100 rounded-cards">
                      <Button variant="tertiary" size="sm" iconButton rounded disabled>
                        <Spinner className="p-4" size={16} />
                      </Button>
                    </div>
                  </div>
                )}
                <Disclosure
                  header={input.order + '. ' + input.name}
                  open={index === 0 && true}
                  disabled={session.stepExecutions[flow.steps[index].id]?.state !== StepExecutionStateEnum.DONE}
                >
                  {session.stepExecutions[flow.steps[index].id]?.state === StepExecutionStateEnum.DONE ?
                    <div className="w-2/3">
                      <p className="text-large pb-20">{session.stepExecutions[flow.steps[index].id]?.output}</p>
                      <div className="flex w-full gap-10">
                        <TextField
                          {...register(`input-${index}`)}
                          className="w-full"
                          size="sm"
                          placeholder={t('step:compiler.generate_again_placeholder')}
                        />
                        <Button
                          onClick={() => reRunStep(input.id, index)}
                          size="sm"
                          leftIcon={<IterationCcw />}
                          loading={isCompiling}
                          color="vattjom"
                          rounded
                          inverted
                        >
                          {t('step:compiler.generate_again')}
                        </Button>
                      </div>
                    </div>
                  : <p>{t('step:compiler.generating_data')}</p>}
                </Disclosure>
                {index < flow.steps.length - 1 && <Divider />}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-32">
          <div>
            <Button variant="secondary" onClick={() => handleChangeStep(currentStep - 1)} leftIcon={<ArrowLeft />}>
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
