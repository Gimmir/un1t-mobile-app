import { CustomInput, CustomSelect, PrimaryButton } from '@/components/auth';
import { formatCountry } from '@/components/profile/account-details/account-details.utils';
import React from 'react';
import type { Control, FieldErrors, FieldValues } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { DobField } from './DobField';

type Step2Fields = {
  phoneNumber: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  dob: Date;
  gender: string;
  measurement: string;
};

export function Step2Form<T extends FieldValues & Step2Fields>(props: {
  control: Control<T>;
  errors: FieldErrors<T>;
  onOpenCountry: () => void;
  onOpenDob: () => void;
  onOpenGender: () => void;
  onOpenUnits: () => void;
  onSubmit: () => void;
}) {
  const { control, errors, onOpenCountry, onOpenDob, onOpenGender, onOpenUnits, onSubmit } = props;

  return (
    <View style={styles.form}>
      <CustomInput
        control={control}
        name={'phoneNumber' as any}
        error={errors.phoneNumber as any}
        placeholder="Phone Number"
        type="phone"
        textContentType="telephoneNumber"
        autoComplete="tel"
      />

      <CustomInput
        control={control}
        name={'address' as any}
        error={errors.address as any}
        placeholder="Address Line"
        autoCapitalize="words"
        textContentType="fullStreetAddress"
        autoComplete="street-address"
      />

      <View style={styles.twoColRow}>
        <View style={[styles.col, styles.colLeft]}>
          <CustomInput
            control={control}
            name={'city' as any}
            error={errors.city as any}
            placeholder="City"
            autoCapitalize="words"
            textContentType="addressCity"
            autoComplete="postal-address-locality"
          />
        </View>
        <View style={styles.col}>
          <CustomInput
            control={control}
            name={'postcode' as any}
            error={errors.postcode as any}
            placeholder="Postcode"
            autoCapitalize="characters"
            textContentType="postalCode"
            autoComplete="postal-code"
          />
        </View>
      </View>

      <CustomSelect
        control={control}
        name={'country' as any}
        error={errors.country as any}
        placeholder="Country"
        onPress={onOpenCountry}
        formatValue={(value) => formatCountry(value)}
      />

      <DobField control={control} onOpen={onOpenDob} errorText={(errors as any).dob?.message} />

      <CustomSelect
        control={control}
        name={'gender' as any}
        error={errors.gender as any}
        placeholder="Select Gender"
        onPress={onOpenGender}
      />

      <CustomSelect
        control={control}
        name={'measurement' as any}
        error={errors.measurement as any}
        placeholder="Units"
        onPress={onOpenUnits}
        formatValue={(value) =>
          value === 'Metric' ? 'Metric (kg)' : value === 'Imperial' ? 'Imperial (lb)' : value
        }
      />

      <View style={{ marginTop: 6 }}>
        <PrimaryButton title="NEXT" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 10,
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
});
