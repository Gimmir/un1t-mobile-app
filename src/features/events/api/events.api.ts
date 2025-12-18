import type { Event } from '@/DATA_TYPES/event';
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

/**
 * Normalize event data from backend to match our Event type
 * Adds compatibility fields (name, start_time, end_time) but keeps original IDs for coach/studio
 * Frontend components should use useUser(event.coach) and useStudio(event.studio) to fetch full data
 */
function normalizeEvent(rawEvent: Record<string, unknown>): Event {
  let duration = (rawEvent.duration as number) || 0;
  if (!duration && rawEvent.startTime && rawEvent.endTime) {
    const start = new Date(rawEvent.startTime as string);
    const end = new Date(rawEvent.endTime as string);
    duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
  
  return {
    ...rawEvent,
    name: (rawEvent.title as string) || (rawEvent.name as string) || 'Unnamed Event',
    start_time: (rawEvent.startTime as string) || (rawEvent.start_time as string),
    end_time: (rawEvent.endTime as string) || (rawEvent.end_time as string),
    duration,
    tags: (rawEvent.tags as string[]) || [],
    credit_cost: (rawEvent.credit_cost as number) || (rawEvent.creditCost as number) || 0,
  } as Event;
}

export const eventsApi = {
  getEvents: async () => {
    const response = await api.get<unknown>('/events');
    const unwrapped = unwrapData<any[]>(response) ?? [];
    const normalized = unwrapped.map(normalizeEvent);
    return normalized;
  },

  getEventById: async (eventId: string) => {
    const response = await api.get<unknown>(`/events/${eventId}`);
    const unwrapped = unwrapData<any>(response);
    const normalized = normalizeEvent(unwrapped);
    return normalized;
  },
};

