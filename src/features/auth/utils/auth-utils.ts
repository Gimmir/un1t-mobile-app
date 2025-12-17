import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { User } from '@/src/types/api';

/**
 * Auth utility functions for checking authentication state
 */
export const authUtils = {
  /**
   * Check if user is authenticated (has valid token)
   */
  isAuthenticated: async (): Promise<boolean> => {
    const token = await storageUtils.getString(StorageKeys.AUTH_TOKEN);
    return !!token;
  },

  /**
   * Get stored auth token
   */
  getToken: async (): Promise<string | null> => {
    return await storageUtils.getString(StorageKeys.AUTH_TOKEN);
  },

  /**
   * Get stored user data
   */
  getUser: async (): Promise<User | null> => {
    return await storageUtils.getObject<User>(StorageKeys.USER_DATA);
  },

  /**
   * Clear all auth data (logout)
   */
  clearAuth: async (): Promise<void> => {
    await storageUtils.clearAll();
  },
};
