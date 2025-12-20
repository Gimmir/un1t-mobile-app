import { CustomInput, PrimaryButton } from '@/components/auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import type { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Step3Fields = {
  nokFirstName: string;
  nokLastName: string;
  nokPhoneNumber: string;
};

export function Step3Form<T extends FieldValues & Step3Fields>(props: {
  control: Control<T>;
  errors: FieldErrors<T>;
  hasPhoneSelected: boolean;
  onPickContact: () => void;
  onSubmit: () => void;
}) {
  const { control, errors, hasPhoneSelected, onPickContact, onSubmit } = props;

  return (
    <View style={styles.form}>
      <View style={styles.twoColRow}>
        <View style={[styles.col, styles.colLeft]}>
          <CustomInput
            control={control}
            name={'nokFirstName' as any}
            error={errors.nokFirstName as any}
            placeholder="First Name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.col}>
          <CustomInput
            control={control}
            name={'nokLastName' as any}
            error={errors.nokLastName as any}
            placeholder="Last Name"
            autoCapitalize="words"
          />
        </View>
      </View>

      <CustomInput
        control={control}
        name={'nokPhoneNumber' as any}
        error={errors.nokPhoneNumber as any}
        placeholder="Phone Number"
        type="phone"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />

      <TouchableOpacity
        accessibilityRole="button"
        activeOpacity={0.85}
        onPress={onPickContact}
        style={styles.contactsButton}
      >
        <View style={styles.contactsButtonLeft}>
          <IconSymbol name="magnifyingglass" size={18} color="#A1A1AA" />
          <Text style={styles.contactsButtonText}>
            {hasPhoneSelected ? 'Pick another contact' : 'Pick from contacts'}
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={18} color="#71717A" />
      </TouchableOpacity>

      <View style={{ marginTop: 6 }}>
        <PrimaryButton title="NEXT" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 14,
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
  contactsButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    backgroundColor: '#111113',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactsButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  contactsButtonText: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '700',
  },
});

