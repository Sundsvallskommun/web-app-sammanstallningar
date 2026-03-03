import { useShallow } from 'zustand/react/shallow';
import { getFlow, useFlowStore } from './flow-service';
import { useEffect, useState } from 'react';
import { useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';

export const useFlow = (id?: string, version?: number) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [flow, setFlow] = useFlowStore(useShallow((state) => [state.flow, state.setFlow]));
  const message = useSnackbar();
  const { t } = useTranslation();
  const router = useRouter();

  const handleError = () => {
    message({ message: t('step:flow_picker.error'), status: 'error' });
    setFlow(null);
    router.push('/start');
  };

  useEffect(() => {
    setLoaded(false);
    if (id && version) {
      getFlow(id, version)
        .then((res) => {
          setFlow(res);
          setLoaded(true);
        })
        .catch(handleError);
    } else {
      setFlow(null);
    }
  }, [version, id]);

  return { flow, loaded };
};
