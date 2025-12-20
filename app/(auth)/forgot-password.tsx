import { CustomInput, PrimaryButton } from '@/components/auth';
import { useRequestPasswordReset } from '@/src/features/auth/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { mutate: requestReset, isPending } = useRequestPasswordReset();
  const [serverError, setServerError] = useState('');
  const keyboardOffset = useMemo(() => (Platform.OS === 'ios' ? 60 : 0), []);
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/landing');
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    const email = data.email.trim();
    setServerError('');

    requestReset(email, {
      onSuccess: () => {
        router.push('/(auth)/check-email');
      },
      onError: (err) => {
        setServerError(err.message || 'Unable to send reset link. Please try again.');
      },
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/home-top-texture.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(25,25,25,0.10)', 'rgba(25,25,25,0.70)', '#191919']}
          locations={[0, 0.55, 1]}
          style={styles.heroOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleBack}
            activeOpacity={0.8}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardOffset}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          >
            <View style={styles.header}>
              <View style={styles.headerInner}>
                <Text style={styles.headerTitle}>{`Forgot\nPassword`}</Text>
                <Text style={styles.headerSubtitle}>
                  Enter the email address associated with your account to receive a reset link.
                </Text>
              </View>
            </View>

            <View style={styles.formInner}>
              <View style={{ gap: 14 }}>
                <View>
                  <CustomInput
                    control={control}
                    name="email"
                    error={errors.email}
                    placeholder="Email"
                    type="email"
                    showClearButton
                    editable={!isPending}
                    textContentType="emailAddress"
                    autoComplete="email"
                    leadingIconName="envelope"
                  />
                  {serverError && !errors.email ? (
                    <Text style={styles.serverErrorText}>{serverError}</Text>
                  ) : null}
                </View>

                <View style={{ marginTop: 6 }}>
                  {isPending ? (
                    <View style={styles.loadingButton}>
                      <ActivityIndicator size="small" color="#ffffff" />
                    </View>
                  ) : (
                    <PrimaryButton title="SEND RESET LINK" onPress={handleSubmit(onSubmit)} disabled={isPending} />
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 520,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 36,
  },
  header: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  headerInner: {
    width: '100%',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '800',
    lineHeight: 46,
    letterSpacing: 0.1,
  },
  headerSubtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 12,
  },
  formInner: {
    width: '100%',
    paddingTop: 10,
  },
  serverErrorText: {
    color: '#F87171',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  loadingButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
