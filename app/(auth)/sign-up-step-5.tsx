import { SignUpStepScreen } from '@/components/auth/signup/SignUpStepScreen';
import { Step5Content } from '@/components/auth/signup/step5/Step5Content';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SignUpStep5Screen() {
  const router = useRouter();

  return (
    <SignUpStepScreen
      step={5}
      totalSteps={5}
      backgroundHeight={420}
      onBack={() => router.back()}
      keyboardAvoiding={false}
      contentContainerStyle={styles.contentContainer}
    >
      <Step5Content onLetsGo={() => router.replace('/(tabs)')} />
    </SignUpStepScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: 'center',
  },
});
