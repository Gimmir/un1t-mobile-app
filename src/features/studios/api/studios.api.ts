import type { Studio } from '@/DATA_TYPES/studio';
import { api } from '@/src/lib/axios';

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
  getStudios: async () => {
    const response = await api.get<unknown>('/studios');
    return unwrapData<Studio[]>(response) ?? [];
  },

  getStudioById: async (studioId: string) => {
    const response = await api.get<unknown>(`/studios/${studioId}`);
    return unwrapData<Studio>(response);
  },
};

