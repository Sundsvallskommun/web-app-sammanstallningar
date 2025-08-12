import React, { useEffect } from 'react';
import { useFlows } from '@services/flow-service/use-flows';
import { Card, useSnackbar } from '@sk-web-gui/react';
import { getFlow, useFlowStore } from '@services/flow-service/flow-service';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

interface FlowPickerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
}

export const FlowPicker: React.FC<FlowPickerProps> = (props) => {
  const { handleChangeStep, currentStep } = props;
  const { t } = useTranslation();
  const toastMessage = useSnackbar();
  const { reset } = useFormContext();

  useEffect(() => {
    reset();
  }, []);

  const { flows } = useFlows();
  const { setFlow } = useFlowStore();

  const handleFlowPick = (id: string, version: number) => {
    if (id && version) {
      getFlow(id, version)
        .then((res) => {
          res && setFlow(res);
        })
        .then(() => {
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
    <div className="flex flex-col mb-24">
      <h1 className="text-h1-sm mb-12">{t('step:flow_picker.title')}</h1>
      <p className="mb-36">{t('step:flow_picker.description')}</p>

      <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-24 flex-wrap ">
        {flows?.map((flow, index) => {
          return (
            <Card
              color="vattjom"
              className="col-span-1 border-1 border-divider rounded-20"
              key={index}
              useHoverEffect
              invert
              layout="horizontal"
              onClick={() => handleFlowPick(flow.id, flow.version)}
              data-cy={`flow-card-${index}`}
            >
              <Card.Body className="py-32">
                <Card.Header>
                  <h3 className="text-h3-md !mt-0">{flow.name}</h3>
                </Card.Header>
                <Card.Text>
                  <p>{flow.description}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
