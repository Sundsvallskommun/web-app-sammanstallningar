import React, { useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import { Button, FileUpload, FormControl, FormLabel, Input, Textarea, UploadFile } from '@sk-web-gui/react';
import { useForm } from 'react-hook-form';
import { useSession } from '@services/session-service/use-session';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { addSessionInput } from '@services/session-service/session-service';
import { useTranslation } from 'next-i18next';
import { Helper } from '@components/helper/helper.component';
import { InputValidationError } from '@components/input-handler/input-validation-error/input-validation-error.component';

interface InputHandlerProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
}

interface FormModel {
  attachmentInput: { [key: string]: UploadFile[] };
  textInput: { [key: string]: string };
  stringInput: { [key: string]: string };
}

export const InputHandler: React.FC<InputHandlerProps> = (props) => {
  const { currentStep, handleChangeStep } = props;
  const { t } = useTranslation();
  const { flow } = useFlowStore();
  const { data: session, refresh: refreshSession } = useSession();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const {
    register,
    watch,
    getValues,
    resetField,
    handleSubmit,
    formState: { errors },
  } = useForm<FormModel>();

  const onSubmit = async () => {
    setIsSaving(true);

    addSessionInput(session.id, getValues()).then(() => {
      refreshSession(session.id);
      setIsSaving(false);
      handleChangeStep(currentStep + 1);
    });
  };

  const handleRemoveUpload = (field) => {
    resetField(field);
  };

  return (
    flow && (
      <FormControl onSubmit={onSubmit} className="w-full">
        <div className="flex w-full justify-between">
          <h1 className="text-h1-sm mb-32">{t('step:input_handler.title', { flow: flow.name })}</h1>
          <Helper currentStep={currentStep} />
        </div>

        <div className="grid grid-cols-2 w-full gap-24 px-24 py-32 bg-background-100 rounded-cards border-1 border-divider">
          {flow.input &&
            flow.input.map((input, index) => {
              return (
                <div className={input.type === 'STRING' ? 'col-span-2' : 'col-span-1'} key={index}>
                  <FormLabel className="block mb-8">{input.name}</FormLabel>
                  {input.type === 'STRING' ?
                    <>
                      <Input
                        {...register(`stringInput.${input.id}`, {
                          required: !input.optional,
                        })}
                        data-cy={input.id}
                      />
                      <InputValidationError errors={errors} inputId={input.id} inputType={'stringInput'} />
                    </>
                  : input.type === 'FILE' ?
                    watch(`attachmentInput.${input.id}`)?.length ?
                      <div
                        key={`attachment-${index}`}
                        className="h-[116px] flex bg-background-content border-1 border-divider rounded-cards justify-center"
                      >
                        {getValues(`attachmentInput.${input.id}`)?.map((file, fileIndex) => {
                          return (
                            <FileUpload.ListItem
                              className="justify-self-center"
                              showBorder={false}
                              key={fileIndex}
                              index={fileIndex}
                            >
                              <FileUpload.ListItemIcon />
                              <FileUpload.ListItemContentName heading={file.file.name} />
                              <FileUpload.ListItemActions
                                showRemove
                                onRemove={() => handleRemoveUpload(`attachmentInput.${input.id}`)}
                              />
                            </FileUpload.ListItem>
                          );
                        })}
                      </div>
                    : <div className="h-[116px] mb-32">
                        <FileUpload.Field
                          {...register(`attachmentInput.${input.id}`, {
                            required: !input.optional,
                          })}
                          variant="horizontal"
                          children={<></>}
                          maxFileSizeMB={2}
                          invalid={false}
                          data-cy={input.id}
                        />
                        <div className="mt-12">
                          <InputValidationError errors={errors} inputId={input.id} inputType={'attachmentInput'} />
                        </div>
                      </div>

                  : <>
                      <Textarea
                        className="w-full"
                        rows={4}
                        size="md"
                        {...register(`textInput.${input.id}`, {
                          required: !input.optional,
                        })}
                        data-cy={input.id}
                      />
                      <InputValidationError errors={errors} inputId={input.id} inputType={'textInput'} />
                    </>
                  }
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
