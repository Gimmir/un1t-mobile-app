import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { StorageKeys, storageUtils } from './storage';

/**
 * Base API URL - Update this with your backend URL
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.API_URL || 'https://un1t-back-end-development.up.railway.app';

/**
 * Axios instance with automatic token injection and error handling
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Automatically injects Bearer token from AsyncStorage
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await storageUtils.getString(StorageKeys.AUTH_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Global error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    
    // Don't auto-logout on 401 for login/register endpoints
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    
    // Extract error message from response - handle various formats
    const errorData = error.response?.data as any;
    let serverMessage = '';
    
    // Try different possible error message formats
    if (typeof errorData?.message === 'string') {
      serverMessage = errorData.message;
    } else if (typeof errorData?.error === 'string') {
      serverMessage = errorData.error;
    } else if (typeof errorData === 'string') {
      serverMessage = errorData;
    }
    
    // Handle 401 Unauthorized
    if (status === 401) {
      if (isAuthEndpoint) {
        // For login/register, return user-friendly message
        return Promise.reject(new Error(serverMessage || 'Invalid email or password. Please try again.'));
      } else {
        // For other endpoints, auto logout
        await storageUtils.clearAll();
        router.replace('/login');
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject(new Error(serverMessage || 'Access denied'));
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject(new Error(serverMessage || 'Resource not found'));
    }
    
    // Handle 500 Internal Server Error
    if (status === 500) {
      return Promise.reject(new Error(serverMessage || 'Server error. Please try again later.'));
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Default error handling - use server message if available
    const errorMessage = serverMessage || 'An error occurred. Please try again.';
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Generic API request helper with type safety
 */
export const api = {
  get: <T>(url: string, config = {}) => 
    apiClient.get<T>(url, config).then(res => res.data),
  
  post: <T, D = unknown>(url: string, data?: D, config = {}) => 
    apiClient.post<T>(url, data, config).then(res => res.data),
  
  put: <T, D = unknown>(url: string, data?: D, config = {}) => 
    apiClient.put<T>(url, data, config).then(res => res.data),
  
  patch: <T, D = unknown>(url: string, data?: D, config = {}) => 
    apiClient.patch<T>(url, data, config).then(res => res.data),
  
  delete: <T>(url: string, config = {}) => 
    apiClient.delete<T>(url, config).then(res => res.data),
};
