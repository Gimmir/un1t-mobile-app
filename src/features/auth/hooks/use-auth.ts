import { useMutate } from '@/src/hooks/useFetch';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { LoginRequest, LoginResponse } from '@/src/types/api';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';

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
        // Backend returns { success: true, data: { user, token } }
        const data = response.data || response;
        
        // Handle flexible token naming (token or accessToken)
        const authToken = data.token || data.accessToken || response.token || response.accessToken;
        const user = data.user || response.user;
        
        if (!authToken) {
          console.error('No token received from backend');
          console.error('Response:', JSON.stringify(response, null, 2));
          return;
        }
        
        // Store tokens in AsyncStorage
        await storageUtils.setString(StorageKeys.AUTH_TOKEN, authToken);
        
        if (user) {
          await storageUtils.setObject(StorageKeys.USER_DATA, user);
        }
        
        
        console.log('Login successful, token stored');
      },
      onError: (error) => {
        console.error('Login failed:', error.message);
        // Error will be handled in the component
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
