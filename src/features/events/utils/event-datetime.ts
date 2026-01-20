import { format, isToday } from 'date-fns';

const EVENT_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const EVENT_TIME_RE = /(?:T|\s)(\d{1,2})[:\s](\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?/;
const TIME_ONLY_RE = /^(\d{1,2})[:\s](\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/;

type EventTimeParts = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

function parseTimeParts(value: string): EventTimeParts | null {
  const trimmed = value.trim();
  const match = EVENT_TIME_RE.exec(trimmed) ?? TIME_ONLY_RE.exec(trimmed);
  if (!match) return null;

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  const second = match[3] ? Number(match[3]) : 0;
  const millisecond = match[4] ? Number(match[4].padEnd(3, '0')) : 0;

  if ([hour, minute, second, millisecond].some((value) => Number.isNaN(value))) {
    return null;
  }

  return { hour, minute, second, millisecond };
}

export function parseEventDateTime(value?: string | null): Date | null {
  if (!value) return null;
  const match = EVENT_DATE_RE.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if ([year, month, day].some((value) => Number.isNaN(value))) {
    return null;
  }

  const timeParts = parseTimeParts(value);
  const date = new Date(
    year,
    month - 1,
    day,
    timeParts?.hour ?? 0,
    timeParts?.minute ?? 0,
    timeParts?.second ?? 0,
    timeParts?.millisecond ?? 0
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatEventTime(value?: string | null, fallback = '--:--'): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  const match = EVENT_TIME_RE.exec(trimmed) ?? TIME_ONLY_RE.exec(trimmed);
  if (!match) return fallback;

  const hours = match[1].padStart(2, '0');
  const minutes = match[2].padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatEventDate(value: string | null | undefined, pattern: string): string {
  const parsed = parseEventDateTime(value);
  return parsed ? format(parsed, pattern) : '';
}

export function isEventToday(value?: string | null): boolean {
  const parsed = parseEventDateTime(value);
  return parsed ? isToday(parsed) : false;
}
