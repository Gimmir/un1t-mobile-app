import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys enum for type-safe storage access
 */
export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token',
  USER_DATA = 'user_data',
  SETTINGS_UNITS = 'settings_units',
  SETTINGS_MARKETING_EMAILS = 'settings_marketing_emails',
}

/**
 * Typed storage utilities using AsyncStorage
 * Compatible with Expo Go - no native build required
 */
export const storageUtils = {
  setString: async (key: StorageKeys, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Storage setString error:', error);
    }
  },

  getString: async (key: StorageKeys): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Storage getString error:', error);
      return null;
    }
  },

  setObject: async <T,>(key: StorageKeys, value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage setObject error:', error);
    }
  },

  getObject: async <T,>(key: StorageKeys): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  },

  delete: async (key: StorageKeys) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  },

  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  },
};
