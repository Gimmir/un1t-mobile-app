import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

import { authEvents } from '@/src/features/auth/auth-events';
import { AuthProvider, useAuthState } from '@/src/features/auth/context/auth-provider';
import { queryClient } from '@/src/lib/query-client';
import { colors } from '@/src/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const navigationTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: colors.surface.app,
      card: colors.surface.app,
      text: colors.text.primary,
      border: colors.border.strong,
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider value={navigationTheme}>
            <View style={{ flex: 1, backgroundColor: colors.surface.app }}>
              <AuthGate />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: colors.surface.app },
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'fade' }} />
                <Stack.Screen name="class-details" options={{ headerShown: false }} />
                <Stack.Screen name="exercise-details" options={{ headerShown: false }} />
                <Stack.Screen name="body-composition" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="light" />
            </View>
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
    const inExerciseDetails = rootSegment === 'exercise-details';
    const inBodyComposition = rootSegment === 'body-composition';
    const inMySchedule = rootSegment === 'my-schedule';
    const inProtectedApp =
      inTabsGroup || inClassDetails || inExerciseDetails || inBodyComposition || inMySchedule;
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
