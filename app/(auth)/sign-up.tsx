import { SlideUpModal } from '@/components/auth';
import { AuthTextureBackground } from '@/components/auth/auth-texture-background';
import { SignUpForm } from '@/components/auth/signup/SignUpForm';
import { SignUpTitles, SignUpTopBar } from '@/components/auth/signup/SignUpHeader';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LANGUAGES } from '@/src/constants/auth-data';
import { useSignUpDraft } from '@/src/features/auth/signup/sign-up-draft';
import { useStudios } from '@/src/features/studios/hooks/use-studios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

// --- ВАЛІДАЦІЯ ---
const signUpSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "First name can only contain letters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }).regex(/^[a-zA-Z\s]+$/, { message: "Last name can only contain letters" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  homeStudio: z.string().min(1, { message: "Please select a home studio" }),
  language: z.string().min(1, { message: "Please select a language" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  terms: z.literal(true, { message: "You must agree to the terms" }),
  marketing: z.boolean().optional(),
}).superRefine((values, ctx) => {
  if (values.password !== values.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpScreen() {
  const router = useRouter();
  const { draft, setStep1 } = useSignUpDraft();
  const insets = useSafeAreaInsets();
  
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isStudioModalVisible, setStudioModalVisible] = useState(false);
  const studiosAccessToken = process.env.EXPO_PUBLIC_STUDIOS_TOKEN;
  const { data: studios, isLoading: isLoadingStudios, error: studiosError } = useStudios({
    accessToken: studiosAccessToken,
    scope: 'public',
    populate: 'studios',
  });

  const studioOptions = useMemo(() => {
    const list = Array.isArray(studios) ? studios : [];
    return list
      .map((studio) => ({
        id: studio._id,
        name: studio.title,
      }))
      .filter((studio) => Boolean(studio.id) && Boolean(studio.name));
  }, [studios]);

  const formatStudioLabel = useCallback(
    (studioId: string) => {
      const match = studioOptions.find((s) => s.id === studioId);
      return match?.name ?? studioId;
    },
    [studioOptions]
  );

  const formatLanguageLabel = useCallback((languageId: string) => {
    const match = LANGUAGES.find((l) => l.id === languageId);
    if (!match) return languageId;
    if (match.id === 'en-GB') return 'English, UK';
    return match.name;
  }, []);

  const defaultValues = useMemo(
    () => ({
      firstName: draft.step1?.firstName ?? '',
      lastName: draft.step1?.lastName ?? '',
      email: draft.step1?.email ?? '',
      homeStudio: draft.step1?.homeStudioId ?? '',
      language: draft.step1?.languageId ?? '',
      password: draft.step1?.password ?? '',
      confirmPassword: draft.step1?.password ?? '',
      terms: draft.step1?.terms as any,
      marketing: draft.step1?.marketing ?? false,
    }),
    [draft.step1]
  );

  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange', 
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const selectedLanguage = watch('language');
  const selectedStudio = watch('homeStudio');

  const onSubmit = (data: SignUpFormData) => {
    setStep1({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      homeStudioId: data.homeStudio,
      languageId: data.language,
      marketing: Boolean(data.marketing),
      terms: Boolean(data.terms),
    });
    router.push('/(auth)/sign-up-step-2');
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/landing');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <AuthTextureBackground height={560} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SignUpTopBar onBack={handleBack} />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 18 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        >
          <SignUpTitles />

          <SignUpForm
            control={control}
            errors={errors}
            onSubmit={handleSubmit(onSubmit)}
            onLogin={() => router.replace('/(auth)/login')}
            onStudioPress={() => setStudioModalVisible(true)}
            onLanguagePress={() => setLanguageModalVisible(true)}
            formatHomeStudioValue={formatStudioLabel}
            formatLanguageValue={formatLanguageLabel}
          />
        </ScrollView>
      </SafeAreaView>

      <SlideUpModal
        visible={isStudioModalVisible}
        onClose={() => setStudioModalVisible(false)}
        title="Choose Home Studio"
        data={studioOptions}
        isLoading={isLoadingStudios}
        emptyText={
          isLoadingStudios ? 'Loading…' : studiosError ? 'Unable to load studios.' : 'No studios available.'
        }
        renderItem={({ item }: { item: { id: string; name: string } }) => {
          const isSelected = selectedStudio === item.id;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                setValue('homeStudio', item.id, { shouldValidate: true });
                setStudioModalVisible(false);
              }}
              style={styles.modalRow}
            >
              <Text style={[styles.modalRowText, isSelected ? styles.modalRowTextActive : styles.modalRowTextInactive]}>
                {item.name}
              </Text>
              {isSelected ? <IconSymbol name="checkmark" size={18} color="#FFFFFF" /> : null}
            </TouchableOpacity>
          );
        }}
      />

      <SlideUpModal
        visible={isLanguageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        title="Choose Language"
        data={LANGUAGES}
        renderItem={({ item }: { item: typeof LANGUAGES[0] }) => {
          const isSelected = selectedLanguage === item.id;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                setValue('language', item.id, { shouldValidate: true });
                setLanguageModalVisible(false);
              }}
              style={styles.modalRow}
            >
              <Text style={styles.modalFlag}>{item.flag}</Text>
              <Text style={[styles.modalRowText, isSelected ? styles.modalRowTextActive : styles.modalRowTextInactive]}>
                {item.id === 'en-GB' ? 'English, UK' : item.name}
              </Text>
              {isSelected ? <IconSymbol name="checkmark" size={18} color="#FFFFFF" /> : null}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.surface.elevated,
  },
  modalFlag: {
    fontSize: typography.size.xxxl,
    marginRight: 12,
    color: '#FFFFFF',
  },
  modalRowText: {
    fontSize: typography.size.md,
    flex: 1,
    letterSpacing: 0.4,
  },
  modalRowTextActive: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
  },
  modalRowTextInactive: {
    color: colors.text.secondary,
    fontWeight: typography.weight.bold,
  },
});