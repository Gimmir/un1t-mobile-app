import { EVENT_STATUSES, type Event, type EventStatus } from '@/DATA_TYPES/event';
import { api } from '@/src/lib/axios';
import { parseEventDateTime } from '@/src/features/events/utils/event-datetime';

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function getRefId(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (isRecord(value) && typeof value._id === 'string') return value._id;
  return null;
}

function normalizeEventStatus(rawStatus: unknown): EventStatus {
  if (typeof rawStatus !== 'string') return 'active';

  const normalized = rawStatus.trim().toLowerCase();
  if ((EVENT_STATUSES as readonly string[]).includes(normalized)) {
    return normalized as EventStatus;
  }

  switch (normalized) {
    case 'ended':
    case 'complete':
    case 'completed':
    case 'done':
      return 'finished';
    case 'canceled':
    case 'cancel':
      return 'cancelled';
    case 'sold_out':
    case 'soldout':
    case 'sold out':
      return 'full';
    default:
      return 'active';
  }
}

function deriveStatusFromTime(args: { status: EventStatus; startTime?: string; endTime?: string }): EventStatus {
  if (args.status !== 'active') return args.status;

  const now = Date.now();
  const end = args.endTime ? parseEventDateTime(args.endTime)?.getTime() ?? NaN : NaN;
  if (!Number.isNaN(end) && end < now) return 'finished';

  const start = args.startTime ? parseEventDateTime(args.startTime)?.getTime() ?? NaN : NaN;
  if (!Number.isNaN(start) && start < now && Number.isNaN(end)) return 'finished';

  return args.status;
}

/**
 * Normalize event data from backend to match our Event type
 * Adds compatibility fields (name, start_time, end_time) but keeps original IDs for coach/studio
 * Frontend components should use useUser(event.coach) and useStudio(event.studio) to fetch full data
 */
function normalizeEvent(rawEvent: Record<string, unknown>): Event {
  const startTime =
    (rawEvent.startTime as string) ||
    (rawEvent.start_time as string);
  const endTime =
    (rawEvent.endTime as string) ||
    (rawEvent.end_time as string);

  const normalizedBackendStatus = normalizeEventStatus(rawEvent.status);
  const derivedStatus = deriveStatusFromTime({ status: normalizedBackendStatus, startTime, endTime });

  let duration = (rawEvent.duration as number) || 0;
  if (!duration && startTime && endTime) {
    const start = parseEventDateTime(startTime);
    const end = parseEventDateTime(endTime);
    if (start && end) {
      duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }
  }

  const coachRef = rawEvent.coach;
  const studioRef = rawEvent.studio;
  const coachId = getRefId(coachRef);
  const studioId = getRefId(studioRef);
  
  // If coach is populated, extract instructor data with firstName and lastName
  let instructor = isRecord(coachRef) ? coachRef : undefined;
  if (instructor && !instructor.firstName && !instructor.lastName) {
    instructor = undefined;
  }
  
  const location = isRecord(studioRef) ? studioRef : undefined;
  
  return {
    ...rawEvent,
    status: derivedStatus,
    name: (rawEvent.title as string) || (rawEvent.name as string) || 'Unnamed Event',
    start_time: startTime,
    end_time: endTime,
    coach: coachId ?? coachRef,
    studio: studioId ?? studioRef,
    instructor: (instructor as any) || (rawEvent.instructor as any),
    location: (location as any) || (rawEvent.location as any),
    duration,
    tags: (rawEvent.tags as string[]) || [],
    credit_cost: (rawEvent.credit_cost as number) || (rawEvent.creditCost as number) || 0,
  } as Event;
}

export const eventsApi = {
  getEvents: async () => {
    const response = await api.get<unknown>('/events?populate=coach');
    const unwrapped = unwrapData<unknown>(response);
    const list = Array.isArray(unwrapped) ? unwrapped : [];
    return list.filter(isRecord).map(normalizeEvent);
  },

  getEventById: async (eventId: string) => {
    const response = await api.get<unknown>(`/events/${eventId}?populate=coach`);
    const unwrapped = unwrapData<unknown>(response);
    if (!isRecord(unwrapped)) {
      throw new Error('Invalid event payload');
    }
    return normalizeEvent(unwrapped);
  },
};
