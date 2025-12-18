import type { ID } from './common';
import type { User } from './user';

/**
 * FE shape of login/register response.
 * Backend returns:
 * { user: IUser; token: string }
 */
export interface AuthPayload {
  user: User;
  token: string;
}

/**
 * Register DTO
 * This matches what your backend requires:
 * - email
 * - password
 * - role
 * - firstName
 * - lastName
 * - studio
 */
export interface RegisterDTO {
  email: string;
  password: string;
  role: 'admin' | 'owner' | 'coach' | 'client';
  firstName: string;
  lastName: string;
  studio: ID;
  phone?: string;
}

/**
 * Login DTO
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Forgot-password DTO
 */
export interface ForgotPasswordDTO {
  email: string;
}

/**
 * Reset password DTO
 */
export interface ResetPasswordDTO {
  token: string;
  password: string;
}

/**
 * Change password DTO
 */
export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

/**
 * FE convenience types for endpoints:
 */
export type AuthLoginResponse = AuthPayload;
export type AuthRegisterResponse = AuthPayload;
