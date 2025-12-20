import { api } from '@/src/lib/axios';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/src/types/api';

/**
 * Authentication API endpoints
 * All auth-related API calls are centralized here
 */
export const authApi = {
  /**
   * Login user with email and password
   */
  login: (credentials: LoginRequest) => 
    api.post<LoginResponse>('/auth/login', credentials),

  /**
   * Register new user
   */
  register: (data: RegisterRequest) => 
    api.post<RegisterResponse>('/auth/register', data),

  /**
   * Logout current user
   */
  logout: () => 
    api.post('/auth/logout'),

  /**
   * Refresh access token
   */
  refreshToken: (refreshToken: string) => 
    api.post('/auth/refresh', { refreshToken }),

  /**
   * Request password reset
   */
  requestPasswordReset: (email: string) => 
    api.post('/auth/forgot-password', { email }),

  /**
   * Change password for authenticated user
   */
  changePassword: (data: ChangePasswordRequest) =>
    api.post('/auth/change-password', data),
};
