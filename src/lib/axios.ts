import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';
import { StorageKeys, storageUtils } from './storage';

/**
 * Base API URL - Update this with your backend URL
 * TODO: Move to environment variables
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

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
 * Request interceptor - Automatically injects Bearer token from MMKV
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageUtils.getString(StorageKeys.AUTH_TOKEN);
    
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
    
    // Handle 401 Unauthorized - Auto logout
    if (status === 401) {
      // Clear all stored data
      storageUtils.clearAll();
      
      // Redirect to login screen
      router.replace('/login');
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Handle 403 Forbidden
    if (status === 403) {
      return Promise.reject(new Error('Access denied'));
    }
    
    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject(new Error('Resource not found'));
    }
    
    // Handle 500 Internal Server Error
    if (status === 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Default error handling
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      'An error occurred';
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
