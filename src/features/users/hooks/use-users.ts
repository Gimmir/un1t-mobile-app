import type { User } from '@/DATA_TYPES/user';
import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { usersApi } from '../api/users.api';

export function useUser(userId: string | null | undefined, initialData?: User) {
  return useFetch<User>(
    ['users', userId],
    () => usersApi.getUserById(String(userId)),
    {
      enabled: Boolean(userId),
      initialData,
      staleTime: 60 * 1000,
    }
  );
}

export function useCurrentUser() {
  return useFetch<User>(
    ['users', 'me'],
    () => usersApi.getCurrentUser(),
    {
      staleTime: 60 * 1000,
    }
  );
}

export function useDeleteUser() {
  return useMutate<unknown, Error, { userId: string }>(
    ({ userId }) => usersApi.deleteUser(userId)
  );
}
