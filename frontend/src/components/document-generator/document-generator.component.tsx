import React, { useState } from 'react';
import { useFlowStore } from '@services/flow-service/flow-service';
import { Button, Checkbox, useSnackbar } from '@sk-web-gui/react';
import { ArrowLeft, FileDown } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useSession } from '@services/session-service/use-session';
import { generateDocument } from '@services/session-service/session-service';
import dayjs from 'dayjs';
import { downloadBase64File } from '@utils/toBase64';

interface DocumentGeneratorProps {
  currentStep: number;
  handleChangeStep: (number: number) => void;
}

export const DocumentGenerator: React.FC<DocumentGeneratorProps> = (props) => {
  const { currentStep, handleChangeStep } = props;
  const { t } = useTranslation();
  const toastMessage = useSnackbar();

  const { flow } = useFlowStore();
  const { data: session } = useSession();

  const [checked, setChecked] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleChange = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const handleDownload = () => {
    if (!session.id) {
      return;
    }

    setIsGenerating(true);
    generateDocument(session.id, flow.defaultTemplateId)
      .then((res) => {
        const fileName = `${flow.name}-${dayjs(new Date()).format('YYYY-MM-DD')}`;
        downloadBase64File(res, fileName);
      })
      .catch(() => {
        toastMessage({
          position: 'bottom',
          closeable: true,
          message: t('step:document_generator.error'),
          status: 'error',
        });
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    handleChange();

    if (isChecked) {
      handleDownload();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="w-2/3">
        <h1 className="text-h1-sm mb-12">{t('step:document_generator.title', { flow: flow.name })}</h1>
        <p className="mb-36">{t('step:document_generator.description')}</p>
      </div>
      <div className="flex gap-10 mb-32">
        <Checkbox onChange={handleCheckboxChange} disabled={isGenerating} data-cy="attest-checkbox" />{' '}
        {t('step:document_generator.attest_description')}
      </div>
      <div className="mb-32">
        <Button
          onClick={() => handleDownload()}
          variant="tertiary"
          color="info"
          leftIcon={<FileDown />}
          disabled={!checked || isGenerating}
          rounded
          data-cy="download-document-button"
        >
          {t('step:document_generator.download', { flow: flow.name + ' ' + dayjs(new Date()).format('YYYY-MM-DD') })}
        </Button>
      </div>

      <div className="flex justify-between mt-32">
        <div>
          <Button
            variant="secondary"
            onClick={() => handleChangeStep(currentStep - 1)}
            disabled={checked}
            leftIcon={<ArrowLeft />}
          >
            {t('step:go_back')}
          </Button>
        </div>
        <div>
          <Button
            loading={isGenerating}
            variant="primary"
            onClick={() => handleChangeStep(0)}
            color="vattjom"
            data-cy="generate-new"
          >
            {t('step:document_generator.new')}
          </Button>
        </div>
      </div>
    </div>
  );
};
