import { ApiResponse, apiService } from '@services/api-service';
import { Session, StepExecution } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';
import { fileToBase64 } from '@utils/toBase64';
import { UploadFile } from '@sk-web-gui/react';

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

  const stringInputPromises = Object.entries(inputData.stringInput).map(async ([key, value]) => {
    if (value.length) {
      try {
        await apiService.post<ApiResponse<Session>>(`session/${sessionId}`, { inputId: key, value: btoa(value) });
        return true;
      } catch (e) {
        console.error('Something went wrong');
      }
    } else {
      return null;
    }
  });

  const textInputPromises = Object.entries(inputData.textInput).map(async ([key, value]) => {
    if (value.length) {
      try {
        await apiService.post<ApiResponse<Session>>(`session/${sessionId}`, { inputId: key, value: btoa(value) });
        return true;
      } catch (e) {
        console.error('Something went wrong');
      }
    } else {
      return null;
    }
  });

  const attachmentInputPromises = Object.entries(inputData.attachmentInput).map(async ([key, value]) => {
    if (value.length) {
      try {
        const fileData = await fileToBase64(value[0].file);
        await apiService.post<ApiResponse<Session>>(`session/${sessionId}`, { inputId: key, value: fileData });
        return true;
      } catch (e) {
        console.error('Something went wrong');
      }
    } else {
      return null;
    }
  });

  return Promise.all([...stringInputPromises, ...textInputPromises, ...attachmentInputPromises]).then((results) =>
    results.every((r) => r)
  );
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

export const generateDocument: (sessionId: string, templateId: string) => Promise<string> = (sessionId, templateId) => {
  return apiService
    .post<ApiResponse<string>>(`session/generate/${sessionId}/generate`, { templateId: templateId })
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
