import { useTranslation } from 'next-i18next';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import { useState } from 'react';
import { FlowPicker } from '@components/flow-picker/flow-picker.component';
import { InputHandler } from '@components/input-handler/input-handler.component';
import { Compiler } from '@components/compiler/compiler.component';
import { DocumentGenerator } from '@components/document-generator/document-generator.component';
import { UploadFile } from '@sk-web-gui/react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormModel {
  attachmentInput: { [key: string]: UploadFile[] };
  textInput: { [key: string]: string };
  stringInput: { [key: string]: string };
}

export function Index() {
  const { t } = useTranslation();

  const methods = useForm<FormModel>({
    defaultValues: { attachmentInput: {} },
    mode: 'onChange',
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [compilerStepIndex, setCompilerStepIndex] = useState<number>(0);
  const [inputHandlerSubmitCount, setInputHandlerSubmitCount] = useState<number>(0);

  const handleChangeStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - ${t('example:title')}`}>
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
                component: (
                  <InputHandler
                    currentStep={currentStep}
                    handleChangeStep={handleChangeStep}
                    setCompilerStepIndex={setCompilerStepIndex}
                    submitCount={inputHandlerSubmitCount}
                    setSubmitCount={setInputHandlerSubmitCount}
                  />
                ),
                valid: true,
              },
              {
                label: t('step:compiler.label'),
                component: (
                  <Compiler
                    currentStep={currentStep}
                    handleChangeStep={handleChangeStep}
                    stepIndex={compilerStepIndex}
                    setStepIndex={setCompilerStepIndex}
                    submitCount={inputHandlerSubmitCount}
                  />
                ),
                valid: true,
              },
              {
                label: t('step:document_generator.label'),
                component: <DocumentGenerator currentStep={currentStep} handleChangeStep={handleChangeStep} />,
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

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'step'])),
  },
});

export default Index;
