import { Icon } from '@sk-web-gui/react';
import { Info } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface InputValidationErrorProps {
  errors: any;
  inputId: string;
  inputType: string;
  description: string;
}

export const InputValidationError = (props: InputValidationErrorProps) => {
  const { t } = useTranslation();
  const { errors, inputId, inputType, description } = props;

  const getInputType = () => {
    return (
      inputType === 'STRING' ? 'stringInput'
      : inputType === 'TEXT' ? 'textInput'
      : 'attachmentInput'
    );
  };

  return errors?.[getInputType()]?.[`${inputId}`] ?
      <p className="text-error text-small mt-8">
        <Icon size="1.7rem" icon={<Info />} className="align-text-bottom mr-5" />
        {description ? description : t('step:input_handler.error.validation')}
      </p>
    : null;
};
