import type { Studio } from '@/DATA_TYPES/studio';
import { api } from '@/src/lib/axios';

type StudiosRequestOptions = {
  accessToken?: string;
  populate?: string;
};

function buildRequestConfig(options?: StudiosRequestOptions) {
  const headers = options?.accessToken
    ? {
        Authorization: `Bearer ${options.accessToken}`,
      }
    : undefined;

  const params = options?.populate ? { populate: options.populate } : undefined;

  if (!headers && !params) {
    return undefined;
  }

  return {
    headers,
    params,
  };
}

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as Record<string, unknown>).data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as Record<string, unknown>).data as T;
    }
    return data as T;
  }
  return response as T;
}

export const studiosApi = {
  getStudios: async (options?: StudiosRequestOptions) => {
    const response = await api.get<unknown>('/studios', buildRequestConfig(options));
    return unwrapData<Studio[]>(response) ?? [];
  },

  getStudioById: async (studioId: string, options?: StudiosRequestOptions) => {
    const response = await api.get<unknown>(`/studios/${studioId}`, buildRequestConfig(options));
    return unwrapData<Studio>(response);
  },
};
