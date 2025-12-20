import type { Event } from '@/DATA_TYPES/event';

export function tryParseEvent(raw: unknown): Event | null {
  if (typeof raw !== 'string') return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as Event;
  } catch {
    return null;
  }
}

