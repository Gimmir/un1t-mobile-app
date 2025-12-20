import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { authEvents } from '@/src/features/auth/auth-events';
import { AuthProvider, useAuthState } from '@/src/features/auth/context/auth-provider';
import { queryClient } from '@/src/lib/query-client';

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthGate />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#191919' },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
              <Stack.Screen name="class-details" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { isReady, isAuthenticated } = useAuthState();
  const rootSegment = segments[0] as string | undefined;
  const leafSegment = segments[1] as string | undefined;
  const authSnapshot = authEvents.getSnapshot();
  const effectiveIsAuthenticated =
    typeof authSnapshot === 'boolean' ? authSnapshot : isAuthenticated;

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = rootSegment === '(auth)';
    const inTabsGroup = rootSegment === '(tabs)';
    const inClassDetails = rootSegment === 'class-details';
    const inMySchedule = rootSegment === 'my-schedule';
    const inProtectedApp = inTabsGroup || inClassDetails || inMySchedule;
    const inPublicRoot = !inAuthGroup && !inProtectedApp;

    const allowAuthWhenLoggedIn =
      inAuthGroup && (leafSegment === 'sign-up-step-4' || leafSegment === 'sign-up-step-5');

    if (!effectiveIsAuthenticated && inProtectedApp) {
      router.replace('/landing');
      return;
    }

    if (effectiveIsAuthenticated && (inPublicRoot || (inAuthGroup && !allowAuthWhenLoggedIn))) {
      router.replace('/(tabs)');
      return;
    }

    SplashScreen.hideAsync().catch(() => {});
  }, [isReady, effectiveIsAuthenticated, router, rootSegment, leafSegment]);

  return null;
}
