import type { Event } from '@/DATA_TYPES/event';
import { useFetch } from '@/src/hooks/useFetch';
import { eventsApi } from '../api/events.api';

export function useEvents() {
  const result = useFetch<Event[]>(
    ['events', 'all'],
    () => eventsApi.getEvents(),
    {
      staleTime: 30 * 1000,
      refetchInterval: 60 * 1000, // Auto-refresh every 60 seconds
      refetchOnWindowFocus: true, // Refresh when app comes to foreground
      refetchOnMount: true, // Refresh on component mount
    }
  );
  
  return result;
}

export function useEvent(eventId: string | null | undefined, initialData?: Event) {
  return useFetch<Event>(
    ['events', eventId],
    () => eventsApi.getEventById(String(eventId)),
    {
      enabled: Boolean(eventId),
      initialData,
      refetchOnMount: 'always',
      staleTime: 30 * 1000,
    }
  );
}

// Re-export usePopulatedEvent for convenience
export { usePopulatedEvent } from './use-populated-event';
export type { PopulatedEvent } from './use-populated-event';

