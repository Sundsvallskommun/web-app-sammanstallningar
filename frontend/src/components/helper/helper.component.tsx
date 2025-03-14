import React, { useState } from 'react';
import { Button, Modal } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';

interface HelperProps {
  currentStep: number;
}

export const Helper: React.FC<HelperProps> = (props) => {
  const { currentStep } = props;
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button onClick={openHandler} color="vattjom" size="sm" iconButton rounded inverted>
        {t('common:question_mark')}
      </Button>

      <Modal
        show={isOpen}
        onClose={closeHandler}
        label={currentStep === 1 ? t('step:input_handler.help_text') : t('step:compiler.help_text')}
        className="w-[60rem]"
      >
        <Modal.Content>
          <p>{currentStep === 1 ? t('step:input_handler.help_text') : t('step:compiler.help_text')}</p>
        </Modal.Content>
      </Modal>
    </div>
  );
};
