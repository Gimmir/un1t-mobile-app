import type { User } from '@/DATA_TYPES/user';
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

export const usersApi = {
  getUserById: async (userId: string) => {
    const response = await api.get<unknown>(`/users/${userId}`);
    return unwrapData<User>(response);
  },

  getCurrentUser: async () => {
    const response = await api.get<unknown>('/users/me');
    return unwrapData<User>(response);
  },
};
