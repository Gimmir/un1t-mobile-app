import { AuthLayout } from '@/components/auth';
import { WaiverCopy } from '@/components/auth/signup/step4/WaiverCopy';
import { WaiverFooter } from '@/components/auth/signup/step4/WaiverFooter';
import { useRegister } from '@/src/features/auth/hooks/use-auth';
import { buildRegisterPayload } from '@/src/features/auth/signup/build-register-payload';
import { useSignUpDraft } from '@/src/features/auth/signup/sign-up-draft';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';
import * as z from 'zod';

const step4Schema = z.object({
  waiverAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the waiver' }),
  }),
});

type Step4FormData = z.infer<typeof step4Schema>;

export default function SignUpStep4Screen() {
  const router = useRouter();
  const { draft, reset: resetDraft } = useSignUpDraft();
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      waiverAgreed: undefined,
    },
  });

  const onSubmit = () => {
    if (isPending) return;
    const step1 = draft.step1;
    const step2 = draft.step2;
    const step3 = draft.step3;

    if (!step1 || !step2 || !step3) {
      router.replace('/(auth)/sign-up');
      return;
    }

    if (!step1.email || !step1.password || !step1.firstName || !step1.lastName) {
      Alert.alert('Missing information', 'Please complete step 1.');
      router.replace('/(auth)/sign-up');
      return;
    }

    if (!step1.homeStudioId) {
      Alert.alert('Missing information', 'Please select a home studio.');
      router.replace('/(auth)/sign-up');
      return;
    }

    const payload = buildRegisterPayload(draft);
    if (!payload) {
      Alert.alert('Missing information', 'Please complete the previous steps.');
      router.replace('/(auth)/sign-up');
      return;
    }

    register(payload, {
      onSuccess: () => {
        resetDraft();
        router.push('/(auth)/sign-up-step-5');
      },
      onError: (err) => {
        Alert.alert('Error', err.message || 'Unable to register. Please try again.');
      },
    });
  };

  return (
    <AuthLayout currentStep={4} totalSteps={5} scrollable={false}>
      <View className="flex-1 px-6">
        <Text className="text-white text-2xl font-bold mt-2 mb-6 text-center tracking-wider uppercase">
          SIGN WAIVER
        </Text>

        <WaiverCopy />

        <WaiverFooter
          control={control}
          error={errors.waiverAgreed}
          isPending={isPending}
          onSubmit={handleSubmit(onSubmit)}
        />
      </View>
    </AuthLayout>
  );
}
