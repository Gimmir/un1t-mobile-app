import type { BaseEntity, Ref } from './common';
import type { User } from './user';

export interface TimerGroupItem {
  exercise?: string; // ObjectId string when referencing an Exercise
  text?: string;     // Custom text label
  minutes: number;
  seconds: number;
}

export interface TimerGroup {
  laps: number;
  item: TimerGroupItem[];
}

export interface Timer extends BaseEntity {
  creator: Ref<User>;

  title: string;
  duration: number;
  groups: TimerGroup[];
}

export interface TimerCreateDTO {
  title: string;
  duration: number;
  groups: TimerGroup[];
}

export interface TimerUpdateDTO {
  title?: string;
  duration?: number;
  groups?: TimerGroup[];
}
