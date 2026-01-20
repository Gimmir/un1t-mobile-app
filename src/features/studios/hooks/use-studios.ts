import type { Studio } from '@/DATA_TYPES/studio';
import { useFetch } from '@/src/hooks/useFetch';
import { studiosApi } from '../api/studios.api';

type UseStudiosOptions = {
  accessToken?: string;
  enabled?: boolean;
  scope?: 'public' | 'auth';
  populate?: string;
};

export function useStudios(options?: UseStudiosOptions) {
  const scope = options?.scope ?? (options?.accessToken ? 'public' : 'auth');
  const populate = options?.populate ?? null;
  return useFetch<Studio[]>(
    ['studios', 'all', scope, populate],
    () => studiosApi.getStudios({ accessToken: options?.accessToken, populate: options?.populate }),
    {
      staleTime: 60 * 1000,
      enabled: options?.enabled ?? true,
    }
  );
}

export function useStudio(
  studioId: string | null | undefined,
  initialData?: Studio,
  options?: UseStudiosOptions
) {
  const scope = options?.scope ?? (options?.accessToken ? 'public' : 'auth');
  const populate = options?.populate ?? null;
  return useFetch<Studio>(
    ['studios', studioId, scope, populate],
    () => studiosApi.getStudioById(String(studioId), { accessToken: options?.accessToken, populate: options?.populate }),
    {
      enabled: Boolean(studioId) && (options?.enabled ?? true),
      initialData,
      staleTime: 60 * 1000,
    }
  );
}
