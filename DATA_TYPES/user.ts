import type { BaseEntity, ID, Ref } from './common';
import type { Studio } from './studio';
import type { Schedule } from './schedule';

export const ROLES = ['admin', 'owner', 'coach', 'client'] as const;
export type Role = typeof ROLES[number];

export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface User extends BaseEntity {
  role: Role;
  stripeCustomerId?: string;

  status: UserStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  birthday?: string; // ISO date string

  country?: string;
  city?: string;
  address?: string;
  timezone?: string;
  language?: string;

  // relations
  studio?: Ref<Studio>;            // ID | Studio | null
  studios?: (ID | Studio)[];       // array of refs (admins/coaches)
  schedule?: Ref<Schedule>;        // ID | Schedule | null

  // performance/nutrition not in schema now -> keep optional refs if you plan to add later
  performance?: ID | null;
  nutrition?: ID | null;
}

/** Payloads you send from FE */
export interface UserCreateDTO {
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  birthday?: string;

  country?: string;
  city?: string;
  address?: string;
  timezone?: string;
  language?: string;

  studio?: ID | null;
  studios?: ID[];
}

export interface UserUpdateDTO {
  status?: UserStatus;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  birthday?: string;

  country?: string;
  city?: string;
  address?: string;
  timezone?: string;
  language?: string;

  studio?: ID | null;
  studios?: ID[];
  schedule?: ID | null;
}
