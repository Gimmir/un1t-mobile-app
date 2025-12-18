import type { BaseEntity, ID, Ref } from './common';
import type { User } from './user';
import type { Event } from './event';

export type BookingStatus =
  | 'active'
  | 'cancelled'
  | 'completed'
  | 'no_show'
  | 'pending'
  | 'refunded';

export interface Booking extends BaseEntity {
  creator: Ref<User>;
  event: Ref<Event>;

  status: BookingStatus;
  paid: boolean;
}

export interface BookingCreateDTO {
  event: ID;
  status?: BookingStatus;
}

export interface BookingUpdateDTO {
  status?: BookingStatus;
  paid?: boolean;
}
