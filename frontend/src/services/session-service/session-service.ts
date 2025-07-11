import { ApiResponse, apiService } from '@services/api-service';
import {
  ChatRequest,
  CreateSessionRequest,
  Output,
  RenderRequest,
  Session,
  SimpleInput,
  StepExecution,
} from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';
import { UploadFile } from '@sk-web-gui/react';
import { fileToBase64 } from '@utils/toBase64';

export const getSession: (sessionId: string) => Promise<Session> = (sessionId) => {
  return apiService
    .get<ApiResponse<Session>>(`session/${sessionId}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when fetching session', e);
      return {} as Session;
    });
};

export const createSession: (flowId: string, flowVersion: number) => Promise<Session> = async (flowId, flowVersion) => {
  try {
    const res = await apiService.post<ApiResponse<Session>, CreateSessionRequest>(`session`, {
      flowId: flowId,
      version: flowVersion,
    });
    return res.data.data;
  } catch (e) {
    console.error('Something went wrong when creating a session');
    throw e;
  }
};

export const addSessionInput: (
  sessionId: string,
  inputData: {
    attachmentInput: { [key: string]: UploadFile[] };
    textInput: { [key: string]: string };
    stringInput: { [key: string]: string };
  }
) => Promise<boolean> = async (
  sessionId,
  inputData: {
    attachmentInput: { [key: string]: UploadFile[] };
    textInput: { [key: string]: string };
    stringInput: { [key: string]: string };
  }
) => {
  if (!sessionId) {
    return Promise.reject('No session id found');
  }

  const stringInputPromises =
    inputData.stringInput ?
      Object.entries(inputData.stringInput).map(async ([key, value]) => {
        if (value.length) {
          try {
            await apiService.post<Session, SimpleInput>(`session/${sessionId}/input/${key}/simple`, {
              value: value,
            });
            return true;
          } catch (e) {
            console.error('Something went wrong when adding session input');
          }
        } else {
          return null;
        }
      })
    : [];

  const textInputPromises =
    inputData.textInput ?
      Object.entries(inputData.textInput).map(async ([key, value]) => {
        if (value.length) {
          try {
            await apiService.post<Session, SimpleInput>(`session/${sessionId}/input/${key}/simple`, { value: value });
            return true;
          } catch (e) {
            console.error('Something went wrong when adding session input');
          }
        } else {
          return null;
        }
      })
    : [];

  const attachmentInputPromises =
    inputData.attachmentInput ?
      Object.entries(inputData.attachmentInput).map(async ([key, value]) => {
        if (value.length) {
          try {
            const fileData = await fileToBase64(value[0].file);
            const buf = Buffer.from(fileData, 'base64');
            const blob = new Blob([buf], { type: value[0].file.type });
            const formData = new FormData();
            formData.append(`files`, blob, value[0].file.name);
            formData.append(`name`, value[0].file.name);

            await apiService.post<Session, FormData>(`session/${sessionId}/input/${key}/file`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            return true;
          } catch (e) {
            console.error('Something went wrong when adding session file input');
          }
        }
      })
    : [];

  return Promise.all([...stringInputPromises, ...textInputPromises, ...attachmentInputPromises]).then((results) =>
    results.every((r) => r)
  );
};

export const runAllSteps: (sessionId: string) => Promise<number> = (sessionId) => {
  return apiService
    .post<number, {}>(`session/${sessionId}`, {})
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when running all steps');
      throw e;
    });
};

export const runStep: (sessionId: string, stepId: string, data: string) => Promise<StepExecution> = (
  sessionId,
  stepId,
  data
) => {
  return apiService
    .post<StepExecution, ChatRequest>(`session/${sessionId}/step/${stepId}`, {
      input: 'Uppdatera ditt befintliga kompletta svar men med följande anvisning: ' + data,
      runRequiredSteps: false,
    })
    .then((res) => {
      return res.data;
    })
    .catch((e) => {
      console.error('Something went wrong when running a step');
      throw e;
    });
};

export const getStepExecution: (sessionId: string, stepId: string) => Promise<StepExecution> = (sessionId, stepId) => {
  return apiService
    .get<ApiResponse<StepExecution>>(`session/${sessionId}/step/${stepId}`)
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when getting step execution');
      throw e;
    });
};

export const generateDocument: (sessionId: string, templateId: string) => Promise<Output> = (sessionId, templateId) => {
  return apiService
    .post<ApiResponse<Output>, RenderRequest>(`session/${sessionId}/generate`, { templateId: templateId })
    .then((res) => {
      return res.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when generating document');
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
