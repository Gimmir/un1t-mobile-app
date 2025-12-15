
/**
 * MMKV storage instance for high-performance local storage
 * Used for authentication tokens and other sensitive data
 */
export const storage = new MMKV({
  id: 'un1t-app-storage',
  encryptionKey: 'your-encryption-key-here', // TODO: Replace with secure key from env
});

/**
 * Storage keys enum for type-safe storage access
 */
export enum StorageKeys {
  AUTH_TOKEN = 'auth_token',
  REFRESH_TOKEN = 'refresh_token',
  USER_DATA = 'user_data',
}

/**
 * Typed storage utilities
 */
export const storageUtils = {
  setString: (key: StorageKeys, value: string) => {
    storage.set(key, value);
  },
  
  getString: (key: StorageKeys): string | undefined => {
    return storage.getString(key);
  },
  
  setObject: <T>(key: StorageKeys, value: T) => {
    storage.set(key, JSON.stringify(value));
  },
  
  getObject: <T>(key: StorageKeys): T | undefined => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : undefined;
  },
  
  delete: (key: StorageKeys) => {
    storage.delete(key);
  },
  
  clearAll: () => {
    storage.clearAll();
  },
};
