import { AuthLayout, CustomCheckbox, PrimaryButton } from '@/components/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert, ScrollView, Text, View } from 'react-native';
import * as z from 'zod';

const step4Schema = z.object({
  waiverAgreed: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the waiver' }),
  }),
});

type Step4FormData = z.infer<typeof step4Schema>;

export default function SignUpStep4Screen() {
  const router = useRouter();

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

  const onSubmit = (data: Step4FormData) => {
    Alert.alert('Welcome to UN1T!', 'Your account has been successfully created.', [
      { text: "Let's Go", onPress: () => router.replace('/(tabs)') },
    ]);
  };

  return (
    <AuthLayout currentStep={4} totalSteps={4} scrollable={false}>
      <View className="flex-1 px-6">
        <Text className="text-white text-2xl font-bold mt-2 mb-6 text-center tracking-wider uppercase">
          SIGN WAIVER
        </Text>

        <View className="flex-1 mb-6">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={true} indicatorStyle="white">
            <Text className="text-zinc-400 text-sm leading-6 mb-4">
              Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out
              print, graphic or web designs. The passage is attributed to an unknown typesetter in
              the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum
              et Malorum for use in a type specimen book. It usually begins with:
            </Text>
            <Text className="text-zinc-400 text-sm leading-6 mb-4 italic">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua."
            </Text>
            <Text className="text-zinc-400 text-sm leading-6 mb-4">
              The purpose of lorem ipsum is to create a natural looking block of text (sentence,
              paragraph, page, etc.) that doesn't distract from the layout. A practice not without
              controversy, laying out pages with meaningless filler text can be very useful when the
              focus is meant to be on design, not content.
            </Text>
            <Text className="text-zinc-400 text-sm leading-6 mb-4">
              Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out
              print, graphic or web designs. The passage is attributed to an unknown typesetter in
              the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum
              et Malorum for use in a type specimen book.
            </Text>
            <Text className="text-zinc-400 text-sm leading-6 mb-10">
              By checking the box below, you acknowledge that you have read, understood, and agree
              to be bound by these terms.
            </Text>
          </ScrollView>

          <View
            className="h-8 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#191919] to-transparent"
            pointerEvents="none"
          />
        </View>

        <View className="mb-8">
          <CustomCheckbox control={control} name="waiverAgreed" error={errors.waiverAgreed} label="I agree" />

          <View className="mt-6">
            <PrimaryButton title="REGISTER" onPress={handleSubmit(onSubmit)} />
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}
