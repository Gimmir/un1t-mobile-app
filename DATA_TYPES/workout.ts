import type { BaseEntity, Ref } from './common';
import type { User } from './user';

export interface Workout extends BaseEntity {
  creator: Ref<User>;

  title: string;
  description?: string;
  video?: string;
  logo?: string;
  picture?: string;
}

export interface WorkoutCreateDTO {
  title: string;
  description?: string;
  video?: string;
  logo?: string;
  picture?: string;
}

export interface WorkoutUpdateDTO {
  title?: string;
  description?: string;
  video?: string;
  logo?: string;
  picture?: string;
}
