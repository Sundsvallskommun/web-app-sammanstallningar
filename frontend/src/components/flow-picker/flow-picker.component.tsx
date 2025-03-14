import React from 'react';
import { useFlows } from '@services/flow-service/use-flows';
import { Card, useSnackbar } from '@sk-web-gui/react';
import { getFlow, useFlowStore } from '@services/flow-service/flow-service';
import { useSession } from '@services/session-service/use-session';
import { useTranslation } from 'next-i18next';

interface FlowPickerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
}

export const FlowPicker: React.FC<FlowPickerProps> = (props) => {
  const { handleChangeStep, currentStep } = props;
  const { t } = useTranslation();
  const toastMessage = useSnackbar();

  const { flows } = useFlows();
  const { setFlow } = useFlowStore();
  const { refresh: refreshSession } = useSession();

  const handleFlowPick = (name: string, version: number) => {
    if (name && version) {
      getFlow(name, version)
        .then((res) => {
          res && setFlow(res);
        })
        .then(() => {
          refreshSession(undefined, name, version);
          handleChangeStep(currentStep + 1);
        })
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: true,
            message: t('step:flow_picker.error'),
            status: 'error',
          });
        });
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-h1-sm mb-12">{t('step:flow_picker.title')}</h1>
      <p className="mb-36">{t('step:flow_picker.description')}</p>

      <div className="flex gap-24 flex-wrap">
        {flows?.flows?.map((flow, index) => {
          return (
            <Card
              color="bjornstigen"
              className="min-w-[320px] max-w-[410px] border-1 border-divider rounded-20 relative"
              key={index}
              useHoverEffect
              invert
              onClick={() => handleFlowPick(flow.name, flow.version)}
            >
              <Card.Body className="py-32 ">
                <Card.Header>
                  <h3 className="text-h3-md !mt-0">{flow.name}</h3>
                </Card.Header>
                <Card.Text>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
