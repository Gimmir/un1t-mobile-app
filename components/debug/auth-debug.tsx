import { StorageKeys, storageUtils } from '@/src/lib/storage';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

/**
 * Debug component to display auth state
 * Only for development - remove in production
 */
export function AuthDebug() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = await storageUtils.getString(StorageKeys.AUTH_TOKEN);
      const userData = await storageUtils.getObject(StorageKeys.USER_DATA);
      
      setToken(authToken);
      setUser(userData);
    };
    
    checkAuth();
  }, []);

  return (
    <View style={{ 
      position: 'absolute', 
      top: 100, 
      left: 10, 
      right: 10, 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      padding: 10, 
      borderRadius: 8,
      zIndex: 9999 
    }}>
      <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>🔐 AUTH DEBUG</Text>
      <Text style={{ color: token ? '#0f0' : '#f00', fontSize: 9, marginTop: 5 }}>
        Token: {token ? `${token.substring(0, 30)}...` : 'NOT FOUND'}
      </Text>
      <Text style={{ color: user ? '#0f0' : '#f00', fontSize: 9, marginTop: 2 }}>
        User: {user?.email || user?.id || 'NOT FOUND'}
      </Text>
    </View>
  );
}
