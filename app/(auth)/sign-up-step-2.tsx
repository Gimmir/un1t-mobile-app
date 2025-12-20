import { IconSymbol } from '@/components/ui/icon-symbol';
import { COUNTRY_NAMES } from '@/constants/country-names';
import { SignUpStepHeading } from '@/components/auth/signup/SignUpStepHeading';
import { SignUpStepScreen } from '@/components/auth/signup/SignUpStepScreen';
import { DobPickerModal } from '@/components/auth/signup/step2/DobPickerModal';
import { Step2Form } from '@/components/auth/signup/step2/Step2Form';
import { SlideUpModal } from '@/components/auth';
import { useSignUpDraft } from '@/src/features/auth/signup/sign-up-draft';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

const today = new Date();
const maxDobDate = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());

const GENDER_VALUES = ['Male', 'Female', 'Prefer not to say'] as const;
type GenderValue = (typeof GENDER_VALUES)[number];
const GENDER_OPTIONS: { id: GenderValue; name: string }[] = GENDER_VALUES.map((value) => ({
  id: value,
  name: value,
}));

const UNIT_VALUES = ['Metric', 'Imperial'] as const;
type UnitValue = (typeof UNIT_VALUES)[number];
const UNITS_OPTIONS: { id: UnitValue; name: string }[] = UNIT_VALUES.map((value) => ({
  id: value,
  name: value === 'Metric' ? 'Metric (kg)' : 'Imperial (lb)',
}));

const step2Schema = z.object({
  phoneNumber: z.string().min(5, { message: 'Phone number is required' }),
  address: z.string().min(5, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  postcode: z.string().min(3, { message: 'Postcode is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  dob: z.date({ required_error: 'Date of birth is required' }),
  gender: z.enum(['Male', 'Female', 'Prefer not to say'], { required_error: 'Please select gender' }),
  measurement: z.enum(['Imperial', 'Metric'], { required_error: 'Please select units' }),
});

type Step2FormData = z.infer<typeof step2Schema>;

export default function SignUpStep2Screen() {
  const router = useRouter();
  const { draft, setStep2 } = useSignUpDraft();

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showUnitsPicker, setShowUnitsPicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const countryOptions = useMemo(() => {
    return Object.entries(COUNTRY_NAMES)
      .map(([code, name]) => ({ id: code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);
  const [filteredCountries, setFilteredCountries] = useState<{ id: string; name: string }[]>(countryOptions);

  const defaultValues = useMemo(
    () => ({
      phoneNumber: draft.step2?.phoneNumber ?? '',
      address: draft.step2?.address ?? '',
      city: draft.step2?.city ?? '',
      postcode: draft.step2?.postcode ?? '',
      country: draft.step2?.country ?? '',
      dob: (draft.step2?.dob ?? (undefined as unknown as Date)) as any,
      gender: draft.step2?.gender ?? 'Male',
      measurement: draft.step2?.measurement ?? 'Metric',
    }),
    [draft.step2]
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const dobValue = watch('dob');
  const selectedCountry = watch('country');

  const onSubmit = (data: Step2FormData) => {
    setStep2(data);
    router.push('/(auth)/sign-up-step-3');
  };

  const handleDobChange = (_event: unknown, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDobPicker(false);
    }
    if (!selectedDate) return;
    setValue('dob', selectedDate, { shouldValidate: true });
  };

  return (
    <SignUpStepScreen step={2} totalSteps={5} backgroundHeight={520} onBack={() => router.back()}>
      <SignUpStepHeading title="CREATE YOUR ACCOUNT" />

      <Step2Form
        control={control}
        errors={errors}
        onOpenCountry={() => {
          setFilteredCountries(countryOptions);
          setShowCountryPicker(true);
        }}
        onOpenDob={() => setShowDobPicker(true)}
        onOpenGender={() => setShowGenderPicker(true)}
        onOpenUnits={() => setShowUnitsPicker(true)}
        onSubmit={handleSubmit(onSubmit)}
      />

      <SlideUpModal
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        title="Country"
        data={filteredCountries}
        searchable
        onSearch={(text) => {
          const trimmed = text.trim().toLowerCase();
          if (!trimmed) {
            setFilteredCountries(countryOptions);
            return;
          }
          const filtered = countryOptions.filter(
            (option) => option.name.toLowerCase().includes(trimmed) || option.id.toLowerCase().includes(trimmed)
          );
          setFilteredCountries(filtered);
        }}
        height="80%"
        renderItem={({ item }: { item: { id: string; name: string } }) => {
          const selected = selectedCountry === item.id;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                setValue('country', item.id, { shouldValidate: true });
                setShowCountryPicker(false);
              }}
              style={styles.countryRow}
            >
              <Text style={[styles.countryName, selected ? styles.modalRowTextActive : styles.modalRowTextInactive]}>
                {item.name}
              </Text>
              <View style={styles.countryRight}>
                <Text style={styles.countryCode}>{item.id}</Text>
                {selected ? <IconSymbol name="checkmark" size={18} color="#FFFFFF" /> : null}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <SlideUpModal
        visible={showGenderPicker}
        onClose={() => setShowGenderPicker(false)}
        title="Select Gender"
        data={GENDER_OPTIONS}
        renderItem={({ item }: { item: (typeof GENDER_OPTIONS)[number] }) => {
          const selected = watch('gender') === item.id;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                setValue('gender', item.id, { shouldValidate: true });
                setShowGenderPicker(false);
              }}
              style={styles.modalRow}
            >
              <Text style={[styles.modalRowText, selected ? styles.modalRowTextActive : styles.modalRowTextInactive]}>
                {item.name}
              </Text>
              {selected ? <IconSymbol name="checkmark" size={18} color="#FFFFFF" /> : null}
            </TouchableOpacity>
          );
        }}
      />

      <SlideUpModal
        visible={showUnitsPicker}
        onClose={() => setShowUnitsPicker(false)}
        title="Units"
        data={UNITS_OPTIONS}
        renderItem={({ item }: { item: (typeof UNITS_OPTIONS)[number] }) => {
          const selected = watch('measurement') === item.id;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.85}
              onPress={() => {
                setValue('measurement', item.id, { shouldValidate: true });
                setShowUnitsPicker(false);
              }}
              style={styles.modalRow}
            >
              <Text style={[styles.modalRowText, selected ? styles.modalRowTextActive : styles.modalRowTextInactive]}>
                {item.name}
              </Text>
              {selected ? <IconSymbol name="checkmark" size={18} color="#FFFFFF" /> : null}
            </TouchableOpacity>
          );
        }}
      />

      <DobPickerModal
        visible={showDobPicker}
        value={dobValue || maxDobDate}
        maximumDate={maxDobDate}
        onChange={handleDobChange}
        onClose={() => setShowDobPicker(false)}
      />
    </SignUpStepScreen>
  );
}

const styles = StyleSheet.create({
  modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  modalRowText: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  modalRowTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  modalRowTextInactive: {
    color: '#A1A1AA',
    fontWeight: '700',
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
    gap: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 14,
    letterSpacing: 0.4,
  },
  countryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryCode: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
