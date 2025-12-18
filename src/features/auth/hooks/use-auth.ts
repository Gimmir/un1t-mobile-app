import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { LoginRequest, LoginResponse, User } from '@/src/types/api';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';

/**
 * Hook to get current user profile
 * Fetches from /users/me
 */
export function useAuth() {
  return useFetch<User>(
    ['user', 'me'],
    async () => {
      const response = await api.get<any>('/users/me');
      const userData = response?.data || response;
      return userData;
    },
    {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}

/**
 * Hook for handling user login
 * Supports flexible token naming (token or accessToken)
 * 
 * @example
 * const { mutate: login, isPending } = useLogin();
 * 
 * login({ email: 'user@example.com', password: 'password123' });
 */
export function useLogin() {
  return useMutate<LoginResponse, Error, LoginRequest>(
    (credentials) => authApi.login(credentials),
    {
      onSuccess: async (response) => {
        const data = response.data || response;
        
        // Handle flexible token naming (token or accessToken)
        const authToken = data.token || data.accessToken || response.token || response.accessToken;
        const user = data.user || response.user;
        
        if (!authToken) {
          console.error('No token received from backend');
          return;
        }
        
        // Store tokens in AsyncStorage
        await storageUtils.setString(StorageKeys.AUTH_TOKEN, authToken);
        
        if (user) {
          await storageUtils.setObject(StorageKeys.USER_DATA, user);
        }
      },
      onError: (error) => {
        console.error('Login failed:', error.message);
      },
    }
  );
}

/**
 * Hook for handling user logout
 */
export function useLogout() {
  return useMutate(
    () => authApi.logout(),
    {
      onSuccess: async () => {
        // Clear all stored data
        await storageUtils.clearAll();
        
        // Navigate to login screen
        router.replace('/login');
      },
    }
  );
}
