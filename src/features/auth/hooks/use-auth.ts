import { useMutate } from '@/src/hooks/useFetch';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { LoginRequest, LoginResponse } from '@/src/types/api';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';

/**
 * Hook for handling user login
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
      onSuccess: (data) => {
        // Store tokens in MMKV
        storageUtils.setString(StorageKeys.AUTH_TOKEN, data.accessToken);
        storageUtils.setString(StorageKeys.REFRESH_TOKEN, data.refreshToken);
        storageUtils.setObject(StorageKeys.USER_DATA, data.user);
        
        // Navigate to home screen
        router.replace('/(tabs)');
      },
      onError: (error) => {
        console.error('Login failed:', error.message);
        // You can add toast notification here
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
      onSuccess: () => {
        // Clear all stored data
        storageUtils.clearAll();
        
        // Navigate to login screen
        router.replace('/login');
      },
    }
  );
}
