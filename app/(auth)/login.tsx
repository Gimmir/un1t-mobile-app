import { CustomInput, PrimaryButton } from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    console.log('Login Data:', data);
    router.replace('/(tabs)');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <View className="flex-1 bg-[#191919]">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <SafeAreaView className="flex-1">
        <View className="px-6 py-2 z-10">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="xmark" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-5 w-full pb-5">
              <Text className="text-white text-2xl font-bold mb-10 text-center tracking-wider uppercase">
                LOGIN
              </Text>

              <View className="gap-4">
                <CustomInput
                  control={control}
                  name="email"
                  error={errors.email}
                  placeholder="Email"
                  type="email"
                  showClearButton
                  // --- ВИПРАВЛЕНО: Використовуємо emailAddress для Email поля ---
                  textContentType="emailAddress" 
                  autoComplete="email"
                />

                <CustomInput
                  control={control}
                  name="password"
                  error={errors.password}
                  placeholder="Password"
                  type="password"
                  // --- Поля пароля ---
                  textContentType="password" 
                  autoComplete="password"
                />

                <Text className="text-[#52525b] text-xs leading-4 mt-1">
                  Must contain at least 8 characters including an uppercase letter, a lowercase
                  letter and a number.
                </Text>

                <View className="mt-6">
                  <PrimaryButton title="LOGIN" onPress={handleSubmit(onSubmit)} />
                </View>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  className="mt-6 items-center"
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-white text-sm underline decoration-white">
                    Forgot password?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}