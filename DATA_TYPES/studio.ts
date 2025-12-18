import type { BaseEntity, ID, Ref } from './common';
import type { User } from './user';
import type { Schedule } from './schedule';

export type StudioStatus = 'active' | 'inactive' | 'closed';

export interface Studio extends BaseEntity {
  creator: ID | User;  // backend always sets creator; may be populated
  owner: ID | User;

  status: StudioStatus;
  title: string;
  email: string;
  phone?: string;
  avatar?: string;

  country?: string;
  city?: string;
  address?: string;
  language?: string;
  timezone?: string;

  // stripe connect
  stripeAccountId?: string;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;

  // relations
  schedule?: Ref<Schedule>;      // ID | Schedule | null
  coaches: (ID | User)[];        // refs
  clients: (ID | User)[];        // refs
}

/** Payloads you send from FE */
export interface StudioCreateDTO {
  owner: ID; // if you set it explicitly from FE
  title: string;
  email: string;
  phone?: string;
  avatar?: string;

  country?: string;
  city?: string;
  address?: string;
  language?: string;
  timezone?: string;
}

export interface StudioUpdateDTO {
  status?: StudioStatus;
  title?: string;
  email?: string;
  phone?: string;
  avatar?: string;

  country?: string;
  city?: string;
  address?: string;
  language?: string;
  timezone?: string;

  owner?: ID;
  coaches?: ID[];
  clients?: ID[];
  schedule?: ID | null;
}
