import { CustomInput, PrimaryButton } from '@/components/auth';
import React from 'react';
import type { Control, FieldErrors, FieldValues } from 'react-hook-form';
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type LoginFields = {
  email: string;
  password: string;
};

export function LoginForm<T extends FieldValues & LoginFields>(props: {
  control: Control<T>;
  errors: FieldErrors<T>;
  isPending: boolean;
  serverError: string;
  containerTranslateY: any;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onSubmit: () => void;
  onInputFocus?: () => void;
  onInputBlur?: () => void;
}) {
  const {
    control,
    errors,
    isPending,
    serverError,
    containerTranslateY,
    onForgotPassword,
    onSignUp,
    onSubmit,
    onInputFocus,
    onInputBlur,
  } = props;

  const showServerError = Boolean(serverError) && !errors.email && !errors.password;

  return (
    <Animated.View style={[styles.form, { transform: [{ translateY: containerTranslateY }] }]}>
      <View style={styles.formInner}>
        <View style={{ gap: 14 }}>
          <CustomInput
            control={control}
            name={'email' as any}
            error={errors.email as any}
            placeholder="Email"
            type="email"
            showClearButton
            editable={!isPending}
            textContentType="emailAddress"
            autoComplete="email"
            leadingIconName="envelope"
            onFocus={onInputFocus}
            onBlur={onInputBlur}
          />

          <CustomInput
            control={control}
            name={'password' as any}
            error={errors.password as any}
            placeholder="Password"
            type="password"
            editable={!isPending}
            textContentType="password"
            autoComplete="password"
            leadingIconName="lock"
            onFocus={onInputFocus}
            onBlur={onInputBlur}
          />

          {showServerError ? <Text style={styles.serverErrorText}>{serverError}</Text> : null}

          <TouchableOpacity
            onPress={onForgotPassword}
            style={styles.forgotButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 6 }}>
            {isPending ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator size="small" color="#ffffff" />
              </View>
            ) : (
              <PrimaryButton title="LOGIN" onPress={onSubmit} disabled={isPending} />
            )}
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>{"Don't have an account?"}</Text>
            <TouchableOpacity onPress={onSignUp} accessibilityRole="button" activeOpacity={0.8}>
              <Text style={styles.bottomLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 10,
  },
  formInner: {
    width: '100%',
  },
  serverErrorText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
    marginLeft: 10,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  forgotText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingButton: {
    height: 52,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    paddingBottom: 8,
  },
  bottomText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomLink: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
