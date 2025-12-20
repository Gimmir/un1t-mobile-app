import { AuthTextureBackground } from '@/components/auth/auth-texture-background';
import { LoginForm } from '@/components/auth/login/LoginForm';
import { LoginTitles, LoginTopBar } from '@/components/auth/login/LoginHeader';
import { useLogin } from '@/src/features/auth/hooks/use-auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const [serverError, setServerError] = useState<string>('');
  const insets = useSafeAreaInsets();
  const cardLift = useRef(new Animated.Value(0)).current;
  const largeHeaderOpacity = useRef(new Animated.Value(1)).current;
  const smallHeaderOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(0)).current;

  const animateCard = (toValue: number) => {
    cardLift.stopAnimation();
    Animated.timing(cardLift, {
      toValue,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const animateHeader = useCallback((focused: boolean) => {
    Animated.parallel([
      Animated.timing(largeHeaderOpacity, {
        toValue: focused ? 0 : 1,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(smallHeaderOpacity, {
        toValue: focused ? 1 : 0,
        duration: 250,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(formTranslateY, {
        toValue: focused ? -100 : 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [largeHeaderOpacity, smallHeaderOpacity, formTranslateY]);

  const handleInputFocus = useCallback(() => {
    animateHeader(true);
  }, [animateHeader]);

  const handleInputBlur = useCallback(() => {
    animateHeader(false);
  }, [animateHeader]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    // Clear previous server error
    setServerError('');
    animateCard(-18);
    
    login(data, {
      onError: (err) => {
        setServerError(err.message || 'Invalid email or password. Please try again.');
        animateCard(0);
      },
    });
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/landing');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
  };

  const scrollBottomPadding = Math.max(insets.bottom, 16) + 18;
  const combinedFormTranslateY = useMemo(
    () => Animated.add(cardLift, formTranslateY),
    [cardLift, formTranslateY]
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <AuthTextureBackground height={520} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <LoginTopBar onBack={handleBack} />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          bounces={false}
        >
            <LoginTitles largeOpacity={largeHeaderOpacity} smallOpacity={smallHeaderOpacity} />

            <LoginForm
              control={control}
              errors={errors}
              isPending={isPending}
              serverError={serverError}
              containerTranslateY={combinedFormTranslateY}
              onForgotPassword={handleForgotPassword}
              onSignUp={handleSignUp}
              onSubmit={handleSubmit(onSubmit)}
              onInputFocus={handleInputFocus}
              onInputBlur={handleInputBlur}
            />
          </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
