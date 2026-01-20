import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { api } from '@/src/lib/axios';
import { queryClient } from '@/src/lib/query-client';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { ChangePasswordRequest, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '@/src/types/api';
import { router } from 'expo-router';
import { authApi } from '../api/auth.api';
import { authEvents } from '../auth-events';

/**
 * Hook to get current user profile
 * Fetches from /users/me
 */
export function useAuth() {
  return useFetch<User>(
    ['user', 'me'],
    async () => {
      const response = await api.get<any>('/users/me?populate=creditLedger,subscription');
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

        authEvents.emit({ isAuthenticated: true });
      },
      onError: (error) => {
        console.error('Login failed:', error.message);
      },
    }
  );
}

/**
 * Hook for handling user registration
 */
export function useRegister() {
  return useMutate<RegisterResponse | any, Error, RegisterRequest>((data) => authApi.register(data), {
    onSuccess: async (response) => {
      const payload = (response as any)?.data || response;

      const authToken =
        payload?.token ||
        payload?.accessToken ||
        payload?.data?.token ||
        payload?.data?.accessToken;

      const refreshToken =
        payload?.refreshToken ||
        payload?.data?.refreshToken;

      const user =
        payload?.user ||
        payload?.data?.user;

      if (authToken) {
        await storageUtils.setString(StorageKeys.AUTH_TOKEN, authToken);
      }
      if (refreshToken) {
        await storageUtils.setString(StorageKeys.REFRESH_TOKEN, refreshToken);
      }
      if (user) {
        await storageUtils.setObject(StorageKeys.USER_DATA, user);
      }

      authEvents.emit({ isAuthenticated: true });
    },
  });
}

/**
 * Hook for handling user logout
 */
export function useLogout() {
  return useMutate(
    async () => {
      try {
        await authApi.logout();
      } catch {
        // Local logout should still proceed even if API fails.
      }
    },
    {
      onMutate: async () => {
        // Clear all stored data
        await storageUtils.clearAll();

        authEvents.emit({ isAuthenticated: false });

        // Clear react-query cache (queries) to avoid showing stale user data after logout.
        await queryClient.cancelQueries();
        queryClient.removeQueries();
        
        // Reset nav back to unauth landing
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace('/landing');
      },
    }
  );
}

/**
 * Hook for changing user password (authenticated)
 */
export function useChangePassword() {
  return useMutate<unknown, Error, ChangePasswordRequest>(
    (data) => authApi.changePassword(data),
  );
}

/**
 * Hook for requesting a password reset email
 */
export function useRequestPasswordReset() {
  return useMutate<unknown, Error, string>(
    (email) => authApi.requestPasswordReset(email),
  );
}
