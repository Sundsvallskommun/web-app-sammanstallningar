import { ApiResponse, apiService } from '@services/api-service';
import { Flow, FlowResponse, Flows } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';

export const getFlows: () => Promise<Flows> = async () => {
  return apiService
    .get<ApiResponse<Flows>>(`flow`)
    .then((res) => {
      return res && res.data.data;
    })
    .catch(() => {
      console.error('Something went wrong');
      return null as Flows;
    });
};

export const getFlow: (name: string, version: number) => Promise<Flow> = async (name: string, version: number) => {
  return apiService
    .get<ApiResponse<FlowResponse>>(`flow/${name}/${version}`)
    .then((res) => {
      return res && JSON.parse(res.data.data.content);
    })
    .catch(() => {
      console.error('Something went wrong');
      return {} as Flow;
    });
};

interface State<T> {
  flows: Flows;
  flow: Flow;
  loaded: boolean;
  loading: boolean;
}

interface Actions<T> {
  setFlow: (data: Flow) => void;
  setFlows: (data: Flows) => void;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const createFlowStore = () => {
  return create<State<Flow | Flows> & Actions<Flow | Flows>>((set) => ({
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
