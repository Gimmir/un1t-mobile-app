import { useChangePassword } from '@/src/features/auth/hooks/use-auth';
import { PasswordInputCard } from '@/components/profile/password/PasswordInputCard';
import { SettingsHeader } from '@/components/profile/settings/SettingsHeader';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useRef, useState } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const KEYBOARD_VERTICAL_OFFSET = Platform.OS === 'ios' ? 60 : 0;

function validatePassword(value: string) {
  const hasMinLength = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  return hasMinLength && hasUpper && hasLower && hasNumber;
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const newPasswordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);

  const isNewPasswordValid = useMemo(() => validatePassword(newPassword), [newPassword]);
  const doesNewPasswordMatch = confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    isNewPasswordValid &&
    doesNewPasswordMatch &&
    !isPending;

  const handleSave = () => {
    if (!currentPassword) {
      Alert.alert('Missing information', 'Please enter your current password.');
      return;
    }
    if (!newPassword) {
      Alert.alert('Missing information', 'Please enter a new password.');
      return;
    }
    if (!isNewPasswordValid) {
      Alert.alert(
        'Invalid password',
        'Password must contain at least 8 characters including an uppercase letter, a lowercase letter and a number.'
      );
      return;
    }
    if (!confirmNewPassword) {
      Alert.alert('Missing information', 'Please repeat your new password.');
      return;
    }
    if (!doesNewPasswordMatch) {
      Alert.alert('Passwords do not match', 'Please make sure the new password fields match.');
      return;
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          Alert.alert('Saved', 'Password updated', [
            {
              text: 'OK',
              onPress: () => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                router.back();
              },
            },
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Unable to change password');
        },
      }
    );
  };

  const scrollBottomPadding = Math.max(insets.bottom, 16) + 24;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader title="CHANGE PASSWORD" onBack={() => router.back()} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={KEYBOARD_VERTICAL_OFFSET}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            contentContainerStyle={[styles.content, { paddingBottom: scrollBottomPadding }]}
          >
            <PasswordInputCard
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter Current Password"
              autoComplete="password"
              textContentType="password"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => newPasswordRef.current?.focus()}
            />

            <PasswordInputCard
              ref={newPasswordRef}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter New Password"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />

            <PasswordInputCard
              ref={confirmPasswordRef}
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              placeholder="Repeat New Password"
              autoComplete="password-new"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSave}
            />

            <Text style={styles.helperText}>
              Must contain at least 8 characters including an uppercase letter, a lowercase letter and a number.
            </Text>
            {!!confirmNewPassword && !doesNewPasswordMatch ? (
              <Text style={styles.helperError}>Passwords do not match.</Text>
            ) : null}

            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.9}
              onPress={handleSave}
              disabled={!canSubmit}
              style={[styles.saveButton, !canSubmit && styles.saveButtonDisabled]}
            >
              <Text style={styles.saveText}>{isPending ? 'SAVING…' : 'SAVE'}</Text>
            </TouchableOpacity>
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
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 6,
    marginBottom: 10,
  },
  helperError: {
    color: '#F87171',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginBottom: 18,
  },
  saveButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: '#0A0A0A',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
