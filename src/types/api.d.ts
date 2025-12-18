/**
 * API Type Definitions
 * 
 * Mock backend DTOs - Update these based on your actual backend API
 * In a monorepo, these would be shared types from the backend
 */

/**
 * User entity from backend
 */
export interface User {
  _id: string;
  id?: string;  // Backwards compatibility
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  phone?: string;
  avatarUrl?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'vendor' | 'client' | 'coach' | 'owner';
  isEmailVerified?: boolean;
  status?: 'active' | 'inactive' | 'blocked';
  birthday?: string;
  dob?: string;
  country?: string;
  city?: string;
  address?: string;
  postcode?: string;
  timezone?: string;
  language?: string;
  studio?: string | { _id: string; id?: string; title: string; name?: string } | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication responses
 */
export interface LoginResponse {
  success?: boolean;
  data?: {
    user?: User;
    token?: string;
    accessToken?: string;
  };
  // Also support direct response (for flexibility)
  user?: User;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Authentication request payloads
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * Order entity
 */
export interface Order {
  id: string;
  userId: string;
  vendorId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress?: Address;
  estimatedDeliveryTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  customizations?: Record<string, unknown>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  phone?: string;
  avatarUrl?: string;
  email?: string;
  birthday?: string;
  dob?: string;
  address?: string;
  city?: string;
  postCode?: string;
  postcode?: string;
  country?: string;
  nextOfKin?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Error response
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
