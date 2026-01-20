import { AuthHeader } from '@/components/auth/auth-header';
import { AuthTextureBackground } from '@/components/auth/auth-texture-background';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { ReactNode, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

export function SignUpStepScreen(props: {
  step: number;
  totalSteps: number;
  backgroundHeight: number;
  onBack: () => void;
  keyboardAvoiding?: boolean;
  scrollable?: boolean;
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
}) {
  const {
    step,
    totalSteps,
    backgroundHeight,
    onBack,
    keyboardAvoiding = false,
    scrollable = true,
    children,
    contentContainerStyle,
  } = props;

  const insets = useSafeAreaInsets();
  const keyboardOffset = useMemo(() => (Platform.OS === 'ios' ? 60 : 0), []);
  const bottomPadding = Math.max(insets.bottom, 16) + 18;

  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, { paddingBottom: bottomPadding }, contentContainerStyle]}>{children}</View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <AuthTextureBackground height={backgroundHeight} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <AuthHeader currentStep={step} totalSteps={totalSteps} onBack={onBack} />

        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardOffset}
            style={{ flex: 1 }}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </SafeAreaView>
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
});
