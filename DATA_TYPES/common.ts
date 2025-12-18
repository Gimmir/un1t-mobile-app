// Primitive ID type used across all FE models
export type ID = string;

// Base entity shape returned by backend
export interface BaseEntity {
  _id: ID;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// -------------------------------
// Pagination + API Response
// -------------------------------

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  pagination?: PaginationMeta;
  data?: T;
  error?: {
    status: number;
    message: string;
    details?: any;
  };
}

// -------------------------------
// Relation helpers (universal)
// -------------------------------

// A relation can be:
// - ID
// - Populated object
// - null
export type Ref<T> = ID | T | null;

// Determine if relation is populated
export function isPopulated<T extends { _id: ID }>(
  ref: Ref<T>,
): ref is T {
  return !!ref && typeof ref === 'object';
}

// Get ID regardless of ref population
export function getID<T extends { _id: ID }>(ref: Ref<T>): ID | null {
  if (!ref) return null;
  return typeof ref === 'string' ? ref : ref._id;
}

// Get populated object or null
export function getPopulated<T extends { _id: ID }>(
  ref: Ref<T>,
): T | null {
  return typeof ref === 'object' && ref !== null ? ref : null;
}