import { ApiResponse, apiService } from '@services/api-service';
import { Flow, FlowSummary } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';

export const getFlows: () => Promise<FlowSummary[]> = async () => {
  return apiService
    .get<ApiResponse<FlowSummary[]>>(`flow`)
    .then((res) => {
      return res && res.data.data;
    })
    .catch(() => {
      console.error('Something went wrong');
      return null as FlowSummary[];
    });
};

export const getFlow: (name: string, version: number) => Promise<Flow> = async (name: string, version: number) => {
  return apiService
    .get<ApiResponse<Flow>>(`flow/${name}/${version}`)
    .then((res) => {
      return res.data.data;
    })
    .catch(() => {
      console.error('Something went wrong');
      return {} as Flow;
    });
};

interface State<T> {
  flows: FlowSummary[];
  flow: Flow;
  loaded: boolean;
  loading: boolean;
}

interface Actions<T> {
  setFlow: (data: Flow) => void;
  setFlows: (data: FlowSummary[]) => void;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const createFlowStore = () => {
  return create<State<Flow | FlowSummary[]> & Actions<Flow | FlowSummary[]>>((set) => ({
    flows: null,
    flow: null,
    loaded: false,
    loading: false,
    setFlows: (flows) => set(() => ({ flows })),
    setFlow: (flow) => set(() => ({ flow })),

    setLoaded: (loaded: boolean) => set(() => ({ loaded })),
    setLoading: (loading: boolean) => set(() => ({ loading })),
  }));
};

export const useFlowStore = createFlowStore();
