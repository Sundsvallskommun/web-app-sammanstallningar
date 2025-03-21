import { Icon } from '@sk-web-gui/react';
import { Info } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface InputValidationErrorProps {
  errors: any;
  inputId: string;
  inputType: string;
}

export const InputValidationError = (props: InputValidationErrorProps) => {
  const { t } = useTranslation();
  const { errors, inputId, inputType } = props;

  return errors?.[inputType]?.[`${inputId}`]?.type ?
      <p className="text-error text-small">
        <Icon size="1.7rem" icon={<Info />} className="align-text-bottom mr-5" />
        {errors?.[inputType][`${inputId}`]?.message ?
          errors?.[inputType][`${inputId}`]?.message
        : t('step:input_handler.error.validation')}
      </p>
    : null;
};
