import React, { useEffect, useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import {
  Button,
  FileUpload,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  UploadFile,
  useConfirm,
  useSnackbar,
} from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useSession } from '@services/session-service/use-session';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { addSessionInput, createSession, deleteSession } from '@services/session-service/session-service';
import { useTranslation } from 'next-i18next';
import { Helper } from '@components/helper/helper.component';
import { InputValidationError } from '@components/input-handler/input-validation-error/input-validation-error.component';

interface InputHandlerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
  setCompilerStepIndex: (number: number) => void;
  submitCount: number;
  setSubmitCount: (number: number) => void;
}

interface FormModel {
  attachmentInput: { [key: string]: UploadFile[] };
  textInput: { [key: string]: string };
  stringInput: { [key: string]: string };
  currentFormState?: FormModel;
}

export const InputHandler: React.FC<InputHandlerProps> = (props) => {
  const { currentStep, handleChangeStep, setCompilerStepIndex, submitCount, setSubmitCount } = props;
  const toastMessage = useSnackbar();
  const { t } = useTranslation();
  const { flow } = useFlowStore();
  const { data, refresh: refreshSession, setData } = useSession();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showConfirmation } = useConfirm();

  const {
    setValue,
    register,
    watch,
    getValues,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useFormContext<FormModel>();

  const { attachmentInput } = watch();

  useEffect(() => {
    setValue('currentFormState', {
      attachmentInput: getValues().attachmentInput,
      textInput: getValues().textInput,
      stringInput: getValues().stringInput,
    });
  }, []);

  const onSubmit = async () => {
    if (submitCount > 0 && isDirty) {
      showConfirmation(
        t('step:input_handler.confirmation.title'),
        t('step:input_handler.confirmation.message'),
        t('step:input_handler.confirmation.confirm_label'),
        t('step:input_handler.confirmation.dismiss_label'),
        'info'
      ).then(async (confirm: boolean) => {
        if (confirm) {
          setIsSaving(true);
          await deleteSession(data.id)
            .then(() => {
              setCompilerStepIndex(0);
            })
            .then(async () => {
              await createSession(flow.id, flow.version).then((res) => {
                setData(res);
                handleNewSessionInput(res.id);
                refreshSession(res.id);
              });
            });
        } else {
          reset(getValues().currentFormState);
          setSubmitCount(submitCount + 1);
          handleChangeStep(currentStep + 1);
        }
      });
    } else if (isDirty) {
      setIsSaving(true);
      await createSession(flow.id, flow.version).then((res) => {
        setData(res);
        refreshSession(res.id);
        handleNewSessionInput(res.id);
      });
    } else {
      handleChangeStep(currentStep + 1);
    }
  };

  const handleNewSessionInput = async (newSessionId: string) => {
    await addSessionInput(newSessionId, getValues())
      .then(() => {
        refreshSession(newSessionId);
      })
      .catch(() => {
        toastMessage({
          position: 'bottom',
          closeable: true,
          message: t('step:input_handler.error.on_submit'),
          status: 'error',
        });
        setIsSaving(false);
      });
    refreshSession(newSessionId);
    setIsSaving(false);
    setSubmitCount(1);
    handleChangeStep(currentStep + 1);
  };

  const handleRemoveUpload = (field, index: number) => {
    const fieldAttachments = getValues(field);
    fieldAttachments.splice(index, 1);
    setValue(field, fieldAttachments);
  };

  return (
    flow && (
      <FormControl onSubmit={onSubmit} className="w-full">
        <div className="flex w-full justify-between">
          <h1 className="text-h1-sm mb-32">{t('step:input_handler.title', { flow: flow.name })}</h1>
          <Helper currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-2 w-full gap-24 px-24 pt-32 pb-24 bg-background-100 rounded-cards border-1 border-divider">
          {flow.input &&
            flow.input.map((input, index) => {
              return (
                <div className={input.type === 'STRING' ? 'col-span-2' : 'col-span-1'} key={index}>
                  <FormLabel className="block mb-8">{input.name}</FormLabel>
                  {input.type === 'STRING' ?
                    <Input
                      {...register(`stringInput.${input.id}`, {
                        required: !input.optional,
                      })}
                      data-cy={input.id}
                      className="mb-8"
                    />
                  : input.type === 'FILE' ?
                    <>
                      {watch(`attachmentInput.${input.id}`)?.length ?
                        <div
                          key={`attachment-${index}`}
                          className="bg-background-content border-1 border-divider rounded-cards mb-16 p-8"
                        >
                          {getValues(`attachmentInput.${input.id}`)?.map((file: UploadFile, fileIndex: number) => {
                            return (
                              <FileUpload.ListItem showBorder={false} key={fileIndex} index={fileIndex} file={file}>
                                <FileUpload.ListItemIcon />
                                <FileUpload.ListItemContentName className="w-full" heading={file.file.name} />
                                <FileUpload.ListItemActions
                                  showRemove
                                  onRemove={() => handleRemoveUpload(`attachmentInput.${input.id}`, fileIndex)}
                                />
                              </FileUpload.ListItem>
                            );
                          })}
                        </div>
                      : null}
                      {(
                        input.multipleValued ||
                        (!input.multipleValued && !getValues(`attachmentInput.${input.id}`)?.length)
                      ) ?
                        <div className="h-[116px] mb-16">
                          <FileUpload.Field
                            {...register(`attachmentInput.${input.id}`, { required: !input.optional })}
                            name={`attachmentInput.${input.id}`}
                            variant="horizontal"
                            maxFileSizeMB={25}
                            invalid={false}
                            data-cy={input.id}
                            allowMultiple={input.multipleValued}
                            appendFiles={attachmentInput[input.id]}
                          />
                        </div>
                      : null}
                    </>
                  : <Textarea
                      className="w-full text-base border-divider rounded-cards resize-none"
                      rows={4}
                      {...register(`textInput.${input.id}`, {
                        required: !input.optional,
                      })}
                      data-cy={input.id}
                    />
                  }
                  <InputValidationError
                    errors={errors}
                    inputId={input.id}
                    inputType={input.type}
                    description={input.description}
                  />
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
              onClick={handleSubmit(onSubmit)}
              color="vattjom"
              rightIcon={currentStep === 3 ? null : <ArrowRight />}
              loading={isSaving}
              data-cy="generate"
            >
              {t('step:input_handler.generate', { flow: flow.name })}
            </Button>
          </div>
        </div>
      </FormControl>
    )
  );
};
