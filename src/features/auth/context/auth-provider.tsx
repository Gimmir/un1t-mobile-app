import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authEvents } from '@/src/features/auth/auth-events';
import { StorageKeys, storageUtils } from '@/src/lib/storage';

type AuthContextValue = {
  isReady: boolean;
  isAuthenticated: boolean;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthState = useCallback(async () => {
    const token = await storageUtils.getString(StorageKeys.AUTH_TOKEN);
    setIsAuthenticated(Boolean(token));
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refreshAuthState();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshAuthState]);

  useEffect(() => {
    return authEvents.subscribe((event) => {
      if (typeof event.isAuthenticated === 'boolean') {
        setIsAuthenticated(event.isAuthenticated);
      }
      void refreshAuthState();
    });
  }, [refreshAuthState]);

  const value = useMemo(
    () => ({
      isReady,
      isAuthenticated,
      refreshAuthState,
    }),
    [isReady, isAuthenticated, refreshAuthState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuthState must be used within AuthProvider');
  }
  return value;
}
