import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from './auth-header';

interface AuthLayoutProps {
  children: ReactNode;
  currentStep?: number;
  totalSteps?: number;
  showHeader?: boolean;
  scrollable?: boolean;
  onBack?: () => void;
}

export function AuthLayout({
  children,
  currentStep,
  totalSteps,
  showHeader = true,
  scrollable = true,
  onBack,
}: AuthLayoutProps) {
  const content = scrollable ? (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <View className="flex-1 bg-[#191919]">
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <SafeAreaView className="flex-1">
        {showHeader && currentStep && totalSteps && (
          <AuthHeader 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            onBack={onBack}
          />
        )}

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          className="flex-1"
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
