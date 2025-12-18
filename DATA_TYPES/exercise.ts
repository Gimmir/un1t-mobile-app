import type { BaseEntity, Ref } from './common';
import type { User } from './user';

export interface Exercise extends BaseEntity {
  creator: Ref<User>;

  title: string;
  video?: string;
  category?: string;
}

export interface ExerciseCreateDTO {
  title: string;
  video?: string;
  category?: string;
}

export interface ExerciseUpdateDTO {
  title?: string;
  video?: string;
  category?: string;
}
