import type { Studio } from '@/DATA_TYPES/studio';
import { useFetch } from '@/src/hooks/useFetch';
import { studiosApi } from '../api/studios.api';

export function useStudios() {
  return useFetch<Studio[]>(
    ['studios', 'all'],
    () => studiosApi.getStudios(),
    {
      staleTime: 60 * 1000,
    }
  );
}

export function useStudio(studioId: string | null | undefined, initialData?: Studio) {
  return useFetch<Studio>(
    ['studios', studioId],
    () => studiosApi.getStudioById(String(studioId)),
    {
      enabled: Boolean(studioId),
      initialData,
      staleTime: 60 * 1000,
    }
  );
}

