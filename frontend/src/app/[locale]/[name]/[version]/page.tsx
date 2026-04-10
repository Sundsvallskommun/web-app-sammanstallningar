'use client';

import { Compiler } from '@components/compiler/compiler.component';
import { DocumentGenerator } from '@components/document-generator/document-generator.component';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import { InputHandler } from '@components/input-handler/input-handler.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useFlow } from '@services/flow-service/use-flow';
import { UploadFile } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface FormModel {
  attachmentInput: { [key: string]: UploadFile[] };
  textInput: { [key: string]: string };
  stringInput: { [key: string]: string };
}

function Index() {
  const { t } = useTranslation();
  const { name, version } = useParams();
  const router = useRouter();
  const decodedName = (() => {
    try {
      return decodeURIComponent(name as string);
    } catch {
      return name as string;
    }
  })();

  const { flow, loaded } = useFlow(decodedName, Number.parseInt(version as string, 10));

  const methods = useForm<FormModel>({
    defaultValues: { attachmentInput: {} },
    mode: 'onChange',
  });

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [compilerStepIndex, setCompilerStepIndex] = useState<number>(0);
  const [inputHandlerSubmitCount, setInputHandlerSubmitCount] = useState<number>(0);

  useEffect(() => {
    const title = document.title;
    const id = flow?.id?.replace('-', ' ');
    const endTitle = title.split('-')[1];
    if (title.toLowerCase().startsWith(id ?? '')) {
      const newTitle = `${flow?.name} - ${endTitle}`;
      document.title = newTitle;
    }
  }, [loaded, flow?.id]);

  const handleChangeStep = (step: number) => {
    if (step === 0) {
      router.push('/start');
    } else {
      setCurrentStep(step);
    }
  };

  return (
    loaded && (
      <DefaultLayout>
        <Head>
          <title>{flow?.name}</title>
        </Head>
        <Main>
          <FormProvider {...methods}>
            <FormStepper
              steps={[
                {
                  label: t('step:flow_picker.label'),
                  component: <></>,
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
    )
  );
}

export default Index;
