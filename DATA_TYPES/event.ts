import type { BaseEntity, ID } from './common';
import type { Studio } from './studio';
import type { User } from './user';

export const EVENT_STATUSES = ['active', 'cancelled', 'finished', 'full'] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface Event extends BaseEntity {
  // Backend fields (actual API response)
  title: string;                    // Real field from backend
  description?: string;
  
  startTime: string;                // Real field from backend (camelCase, ISO string)
  endTime: string;                  // Real field from backend (camelCase, ISO string)
  
  creator: ID;
  studio: ID;                       // Studio ID - use useStudio(event.studio) to get full data
  schedule: ID;
  status: EventStatus;
  
  coach: ID;                        // Coach ID - use useUser(event.coach) to get full User with role='coach'
  workout?: ID;
  timer?: ID;
  timerTemplate?: ID;
  bookings?: ID[];
  
  // Optional fields that might be added later or populated
  duration?: number;                // minutes (calculated from startTime/endTime)
  tags?: string[];                  // might not exist yet
  credit_cost?: number;             // might not exist yet
  
  // Normalized fields for frontend compatibility (added by normalizeEvent)
  name?: string;                    // Normalized from title
  start_time?: string;              // Normalized from startTime
  end_time?: string;                // Normalized from endTime
  
  // These are NOT in API response by default - need to fetch separately or populated
  instructor?: User;                // Fetch via useUser(event.coach) - full User object with role='coach'
  location?: Studio;                // Fetch via useStudio(event.studio) - full Studio object
}

