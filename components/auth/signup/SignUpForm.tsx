import { CustomCheckbox, CustomInput, CustomSelect, PrimaryButton } from '@/components/auth';
import React from 'react';
import type { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SignUpFields = {
  firstName: string;
  lastName: string;
  email: string;
  homeStudio: string;
  language: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  marketing?: boolean;
};

export function SignUpForm<T extends FieldValues & SignUpFields>(props: {
  control: Control<T>;
  errors: FieldErrors<T>;
  onSubmit: () => void;
  onLogin: () => void;
  onStudioPress: () => void;
  onLanguagePress: () => void;
  formatHomeStudioValue?: (value: string) => string;
  formatLanguageValue?: (value: string) => string;
}) {
  const {
    control,
    errors,
    onSubmit,
    onLogin,
    onStudioPress,
    onLanguagePress,
    formatHomeStudioValue,
    formatLanguageValue,
  } = props;

  return (
    <View style={styles.form}>
      <View style={styles.formInner}>
        <View style={{ gap: 14 }}>
          <View style={styles.twoColRow}>
            <View style={[styles.col, styles.colLeft]}>
              <CustomInput
                control={control}
                name={'firstName' as any}
                error={errors.firstName as any}
                placeholder="First Name"
                autoCapitalize="words"
                textContentType="givenName"
                autoComplete="name-given"
              />
            </View>

            <View style={styles.col}>
              <CustomInput
                control={control}
                name={'lastName' as any}
                error={errors.lastName as any}
                placeholder="Last Name"
                autoCapitalize="words"
                textContentType="familyName"
                autoComplete="name-family"
              />
            </View>
          </View>

          <CustomInput
            control={control}
            name={'email' as any}
            error={errors.email as any}
            placeholder="Email"
            type="email"
            showClearButton
            textContentType="emailAddress"
            autoComplete="email"
            leadingIconName="envelope"
          />

          <CustomInput
            control={control}
            name={'password' as any}
            error={errors.password as any}
            placeholder="Password"
            type="password"
            textContentType="newPassword"
            autoComplete="password-new"
            leadingIconName="lock"
            helperText="Must contain at least 8 characters including an uppercase letter, a lowercase letter and a number."
          />

          <CustomInput
            control={control}
            name={'confirmPassword' as any}
            error={errors.confirmPassword as any}
            placeholder="Confirm Password"
            type="password"
            textContentType="newPassword"
            autoComplete="password-new"
            leadingIconName="lock"
          />

          <CustomSelect
            control={control}
            name={'homeStudio' as any}
            error={errors.homeStudio as any}
            placeholder="Choose Home Studio"
            onPress={onStudioPress}
            formatValue={formatHomeStudioValue}
          />

          <CustomSelect
            control={control}
            name={'language' as any}
            error={errors.language as any}
            placeholder="Choose Language"
            onPress={onLanguagePress}
            formatValue={formatLanguageValue}
          />

          <View style={styles.checkboxBlock}>
            <CustomCheckbox
              control={control}
              name={'terms' as any}
              error={errors.terms as any}
              label={
                <Text style={styles.termsText}>
                  I agree to UN1T&apos;s <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
                  <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              }
            />

            <View style={{ marginTop: 14 }}>
              <CustomCheckbox control={control} name={'marketing' as any} label="Opt-in for marketing communications" />
            </View>
          </View>

          <View style={{ marginTop: 6 }}>
            <PrimaryButton title="NEXT" onPress={onSubmit} />
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <TouchableOpacity onPress={onLogin} accessibilityRole="button" activeOpacity={0.8}>
              <Text style={styles.bottomLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 10,
  },
  formInner: {
    width: '100%',
  },
  twoColRow: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  colLeft: {
    marginRight: 12,
  },
  checkboxBlock: {
    marginTop: 10,
  },
  termsText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  termsLink: {
    textDecorationLine: 'underline',
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
