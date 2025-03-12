import { ApiResponse, apiService } from '@services/api-service';
import { Input, Session, StepExecution } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';
import { step } from 'next/dist/experimental/testmode/playwright/step';

export const getSession: (sessionId: string) => Promise<Session> = (sessionId) => {
  return apiService
    .get<ApiResponse<Session>>(`session/${sessionId}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching session');
      return {} as Session;
    });
};

export const createSession: (flowName: string, flowVersion: number) => Promise<Session> = (flowName, flowVersion) => {
  return apiService
    .post<ApiResponse<Session>>(`session/${flowName}/${flowVersion}`, {})
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when creating a session');
      throw e;
    });
};

export const addSessionInput: (sessionId: string, inputData: Input) => Promise<Session> = (sessionId, inputData) => {
  return apiService
    .post<ApiResponse<Session>>(`session/${sessionId}`, inputData)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when adding session input');
      throw e;
    });
};

export const runStep: (sessionId: string, stepId: string) => Promise<StepExecution> = (sessionId, stepId) => {
  return apiService
    .post<ApiResponse<StepExecution>>(`session/run/${sessionId}/${stepId}`, {})
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when running a step');
      throw e;
    });
};

export const getStepExecution: (sessionId: string, stepId: string) => Promise<StepExecution> = (sessionId, stepId) => {
  return apiService
    .get<ApiResponse<StepExecution>>(`session/${sessionId}/${stepId}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when getting step execution');
      throw e;
    });
};

interface State<T> {
  data: T;
  loaded: boolean;
  loading: boolean;
}

interface Actions<T> {
  setData: (data: T) => void;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const createSessionStore = () => {
  return create<State<Session> & Actions<Session>>((set) => ({
    data: null,
    loaded: false,
    loading: false,
    setData: (data) => set(() => ({ data })),
    setLoaded: (loaded: boolean) => set(() => ({ loaded })),
    setLoading: (loading: boolean) => set(() => ({ loading })),
  }));
};

export const useSessionStore = createSessionStore();
