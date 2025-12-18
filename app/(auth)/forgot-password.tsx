import { CustomInput, PrimaryButton } from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();

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
    router.push('/(auth)/check-email');
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
            <IconSymbol name="chevron.left" size={28} color="white" />
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
            <View className="px-5 w-full pb-20">
              <Text className="text-white text-2xl font-bold mb-4 text-center tracking-wider uppercase">
                FORGOT PASSWORD
              </Text>

              <Text className="text-[#a1a1aa] text-center mb-10 px-4 leading-5">
                Enter the email address associated with your account to receive a reset link
              </Text>

              <View className="gap-4">
                <CustomInput
                  control={control}
                  name="email"
                  error={errors.email}
                  placeholder="Your Email"
                  type="email"
                  showClearButton
                />

                <View className="mt-6">
                  <PrimaryButton title="Send Reset Link" onPress={handleSubmit(onSubmit)} />
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}