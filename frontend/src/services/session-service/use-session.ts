import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Session } from '@data-contracts/backend/data-contracts';
import { useUserStore } from '@services/user-service/user-service';
import { createSession, getSession, useSessionStore } from '@services/session-service/session-service';

export const useSession = (): {
  data: Session;
  loaded: boolean;
  setLoaded: (boolean: boolean) => void;
  loading: boolean;
  refresh: (sessionId?: string, flowName?: string, flowVersion?: number) => void;
} => {
  const user = useUserStore(useShallow((s) => s.user));
  const [data, setData, loaded, setLoaded, loading, setLoading] = useSessionStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );

  const refresh = (_sessionId?: string, _flowName?: string, _flowVersion?: number) => {
    if (loading) return;
    if (user && _sessionId) {
      setLoading(true);
      getSession(_sessionId)
        .then((res) => {
          setData(res || null);
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setData(null);
          setLoaded(false);
          setLoading(false);
        });
    } else if (user && _flowName && _flowVersion) {
      setLoading(true);
      createSession(_flowName, _flowVersion)
        .then((res) => {
          setData(res || null);
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setData(null);
          setLoaded(false);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!loaded || !data) {
      setLoaded(false);
      refresh();
    }
  }, [user]);

  return { data, loaded, setLoaded, loading, refresh };
};
