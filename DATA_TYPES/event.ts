import type { BaseEntity, ID, Ref } from './common';
import type { User } from './user';
import type { Workout } from './workout';
import type { Timer } from './timer';
import type { Exercise } from './exercise';
import type { Booking } from './booking';
import type { Studio } from './studio';
import type { Schedule } from './schedule';

export type EventStatus = 'active' | 'cancelled' | 'finished' | 'full';

export interface Event extends BaseEntity {
  creator: Ref<User>;
  studio: Ref<Studio>;
  schedule: Ref<Schedule>;

  status: EventStatus;
  title: string;
  description: string;

  startTime: string; // ISO
  endTime: string;   // ISO
  duration?: number;
  clientsLimit?: number;

  // refs
  coach: Ref<User>;
  workout: Ref<Workout>;
  timer?: Ref<Timer>;
  exercises: (ID | Exercise)[];
  bookings: (ID | Booking)[];
  leaderboard?: ID | null;
}

/** Payloads you send from FE */
export interface EventCreateDTO {
  creator?: ID;
  studio: ID;
  schedule: ID;

  status?: EventStatus;
  title: string;
  description?: string;

  startTime: string;
  endTime: string;
  duration?: number;
  clientsLimit?: number;

  coach: ID;
  workout: ID;
  timer?: ID | null;
  exercises: ID[];
}

export interface EventUpdateDTO {
  status?: EventStatus;
  title?: string;
  description?: string;

  startTime?: string;
  endTime?: string;
  duration?: number;
  clientsLimit?: number;

  coach?: ID;
  workout?: ID;
  timer?: ID | null;
  exercises?: ID[];
}
