import { SignUpDraftProvider } from '@/src/features/auth/signup/sign-up-draft';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <SignUpDraftProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SignUpDraftProvider>
  );
}
