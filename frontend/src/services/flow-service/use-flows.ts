import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Flow, Flows } from '@data-contracts/backend/data-contracts';
import { getFlows, useFlowStore } from '@services/flow-service/flow-service';
import { useUserStore } from '@services/user-service/user-service';

export const useFlows = (): {
  flows: Flows;
  flow: Flow;
  loaded: boolean;
  loading: boolean;
  refresh: () => void;
} => {
  const user = useUserStore(useShallow((s) => s.user));
  const [flows, flow, setFlows, setFlow, loaded, setLoaded, loading, setLoading] = useFlowStore(
    useShallow((state) => [
      state.flows,
      state.flow,
      state.setFlows,
      state.setFlow,
      state.loaded,
      state.setLoaded,
      state.loading,
      state.setLoading,
    ])
  );

  const refresh = () => {
    if (loading) return;
    if (user) {
      setLoading(true);
      getFlows()
        .then((res) => {
          res && setFlows(res as Flows);
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setFlows(null);
          setLoaded(false);
          setLoading(false);
        });
    } else {
      setFlows(null);
    }
  };

  useEffect(() => {
    if (!loaded || !flows) {
      setLoaded(false);
      refresh();
    }
  }, [user]);

  return { flows, flow, loaded, loading, refresh };
};
