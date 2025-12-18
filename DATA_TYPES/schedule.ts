import type { BaseEntity, ID, Ref } from './common';
import type { Studio } from './studio';
import type { User } from './user';
// If you have Event FE type already, import it; otherwise keep ID only.
import type { Event } from './event';

export const SCHEDULE_TYPES = ['personal', 'studio'] as const;
export type ScheduleTypes = typeof SCHEDULE_TYPES[number];

export interface Schedule extends BaseEntity {
  creator?: Ref<User>;    // backend requires creator OR studio; may be populated
  studio?: Ref<Studio>;

  type: ScheduleTypes;
  events: (ID | Event)[]; // refs; populated if you call populate=events
}

/** Payloads you send from FE */
export interface ScheduleCreateDTO {
  creator?: ID;
  studio?: ID;
  type: ScheduleTypes;
  events?: ID[];
}

export interface ScheduleUpdateDTO {
  creator?: ID | null;
  studio?: ID | null;
  type?: ScheduleTypes;
  events?: ID[];
}
