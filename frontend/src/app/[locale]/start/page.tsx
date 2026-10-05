'use client';

import { FlowPicker } from '@components/flow-picker/flow-picker.component';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { UploadFile } from '@sk-web-gui/react';
import { useT } from 'next-i18next/client';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormModel {
  attachmentInput: { [key: string]: UploadFile[] };
  textInput: { [key: string]: string };
  stringInput: { [key: string]: string };
}

function Index() {
  const { t } = useT();

  const methods = useForm<FormModel>({
    defaultValues: { attachmentInput: {} },
    mode: 'onChange',
  });

  const [currentStep, setCurrentStep] = useState<number>(0);

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <DefaultLayout>
      <Main>
        <FormProvider {...methods}>
          <FormStepper
            steps={[
              {
                label: t('step:flow_picker.label'),
                component: <FlowPicker currentStep={currentStep} handleChangeStep={handleChangeStep} />,
                valid: true,
              },
              {
                label: t('step:input_handler.label'),
                component: <></>,
                valid: true,
              },
              {
                label: t('step:compiler.label'),
                component: <></>,
                valid: true,
              },
              {
                label: t('step:document_generator.label'),
                component: <></>,
                valid: true,
              },
            ]}
            currentStep={currentStep}
            handleChangeStep={handleChangeStep}
          />
        </FormProvider>
      </Main>
    </DefaultLayout>
  );
}

export default Index;
