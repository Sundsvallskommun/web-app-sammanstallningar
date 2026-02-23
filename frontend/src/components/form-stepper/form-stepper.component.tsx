import { ProgressStepper } from '@sk-web-gui/react';
import React, { ReactNode } from 'react';

export interface FormStep {
  label: string;
  component: ReactNode;
  valid?: boolean;
}

interface FormStepperProps {
  steps: FormStep[];
  onChangeStep?: (step: number) => void;
  handleChangeStep: (number: number) => void;
  currentStep: number;
}

export const FormStepper: React.FC<FormStepperProps> = (props) => {
  const { steps, currentStep } = props;

  return (
    <div className="flex flex-col">
      <div className="w-full mx-auto bg-vattjom-background-100 lg:px-80 sm:px-24">
        <div className="mx-auto container">
          <ProgressStepper
            className="w-[60rem] py-32"
            steps={steps.map((step) => step.label)}
            current={currentStep}
            rounded={false}
            size="md"
            labelPosition="bottom"
          />
        </div>
      </div>

      <div className="shadow-100 min-h-[90rem]">
        <div className="mx-auto container py-32 min-[1700px]:px-0 max-[1749px]:px-80 max-[1025px]:px-32">
          {steps[currentStep].component}
        </div>
      </div>
    </div>
  );
};
