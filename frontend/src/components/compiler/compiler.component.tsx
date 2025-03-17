import React, { useEffect, useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import { Button, Disclosure, Divider, Spinner, TextField, useSnackbar } from '@sk-web-gui/react';
import { ArrowLeft, ArrowRight, IterationCcw } from 'lucide-react';
import { useSession } from '@services/session-service/use-session';
import { getStepExecution, runStep } from '@services/session-service/session-service';
import { useTranslation } from 'next-i18next';
import { Helper } from '@components/helper/helper.component';
import { StepExecutionStateEnum } from '@data-contracts/backend/data-contracts';

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

  const executeAllSteps = (index: number) => {
    setStepIndex(index);
    if (index < flow.steps.length) {
      runStep(session.id, flow.steps[index].id).then(() => {
        try {
          const interval = setInterval(async () => {
            await getStepExecution(session.id, flow.steps[index].id)
              .then((executedStep) => {
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
      });
    }
  };

  useEffect(() => {
    if (Object.keys(session.stepExecutions).length !== flow.steps.length) {
      executeAllSteps(0);
    }
  }, []);

  useEffect(() => {
    refreshSession(session.id);
  }, [stepIndex]);

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
                {session.stepExecutions[flow.steps[index].id]?.state !== StepExecutionStateEnum.DONE && (
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
                          className="w-full"
                          size="sm"
                          placeholder={t('step:compiler.generate_again_placeholder')}
                        />
                        <Button size="sm" leftIcon={<IterationCcw />} color="vattjom" rounded inverted>
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
              disabled={Object.keys(session.stepExecutions).length !== flow.steps.length}
            >
              {t('step:compiler.save')}
            </Button>
          </div>
        </div>
      </div>
    )
  );
};
