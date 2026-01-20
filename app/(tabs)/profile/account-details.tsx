import { AccountDetailsHeader } from '@/components/profile/account-details/AccountDetailsHeader';
import { CountryPickerModal } from '@/components/profile/account-details/CountryPickerModal';
import { DetailSectionCard } from '@/components/profile/account-details/DetailSectionCard';
import { DobPickerModal } from '@/components/profile/account-details/DobPickerModal';
import { formatCountry, formatDob, maxDobDate, parseDob, resolveCountryCode } from '@/components/profile/account-details/account-details.utils';
import { buildUpdateProfilePayload } from '@/components/profile/account-details/build-update-profile-payload';
import type { DetailSection, FormKey, FormValues } from '@/components/profile/account-details/types';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useUpdateProfile } from '@/src/features/profile/hooks/use-update-profile';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

export default function AccountDetailsScreen() {
  const router = useRouter();
  const { data: user } = useAuth();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const insets = useSafeAreaInsets();
  const userId = user?._id ?? '';
  const canEdit = Boolean(userId);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const rawFirstName = user?.firstName ?? '';
  const rawLastName = user?.lastName ?? '';
  const rawEmail = user?.email ?? '';
  const rawDob = (user as any)?.birthday || (user as any)?.dob || '';
  const rawPhone =
    (user as any)?.phone ||
    (user as any)?.phoneNumber ||
    (user as any)?.phoneNumber?.toString?.() ||
    '';
  const rawAddressLine1 = (user as any)?.address || (user as any)?.addressLine1 || '';
  const rawCity = (user as any)?.city || '';
  const rawPostCode = (user as any)?.postCode || (user as any)?.postcode || '';
  const rawCountryInput =
    (user as any)?.country || (user as any)?.countryCode || (user as any)?.countryName || '';
  const resolvedCountryCode = resolveCountryCode(rawCountryInput);

  const rawNextOfKinFirstName = (user as any)?.nextOfKin?.firstName || '';
  const rawNextOfKinLastName = (user as any)?.nextOfKin?.lastName || '';
  const rawNextOfKinPhone = (user as any)?.nextOfKin?.phone || '';
  const initialHadNextOfKin = Boolean(rawNextOfKinFirstName || rawNextOfKinLastName || rawNextOfKinPhone);

  const firstName = rawFirstName || '';
  const lastName = rawLastName || '';
  const email = rawEmail || '';
  const phone = rawPhone || '';
  const addressLine1 = rawAddressLine1 || '';
  const city = rawCity || '';
  const postCode = rawPostCode || '';

  const nextOfKin = useMemo(() => {
    return {
      firstName: rawNextOfKinFirstName || '',
      lastName: rawNextOfKinLastName || '',
      phone: rawNextOfKinPhone || '',
    };
  }, [rawNextOfKinFirstName, rawNextOfKinLastName, rawNextOfKinPhone]);

  const initialFormValues = useMemo<FormValues>(
    () => ({
      firstName: rawFirstName,
      lastName: rawLastName,
      email: rawEmail,
      dob: rawDob,
      phone: rawPhone,
      addressLine1: rawAddressLine1,
      city: rawCity,
      postCode: rawPostCode,
      country: resolvedCountryCode,
      nextOfKinFirstName: rawNextOfKinFirstName,
      nextOfKinLastName: rawNextOfKinLastName,
      nextOfKinPhone: rawNextOfKinPhone,
    }),
    [
      rawAddressLine1,
      rawCity,
      rawDob,
      rawEmail,
      rawFirstName,
      rawLastName,
      rawNextOfKinFirstName,
      rawNextOfKinLastName,
      rawNextOfKinPhone,
      rawPhone,
      rawPostCode,
      resolvedCountryCode,
    ]
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues]);

  const dobDisplay = useMemo(() => formatDob(formValues.dob || rawDob), [formValues.dob, rawDob]);

  const countryDisplay = useMemo(() => {
    const effective = formValues.country || resolvedCountryCode;
    return effective ? formatCountry(effective) : '';
  }, [formValues.country, resolvedCountryCode]);

  const handleInputChange = (key: FormKey, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleCancelEdit = () => {
    setFormValues(initialFormValues);
    setIsEditing(false);
  };

  const handleEditPress = () => {
    if (!userId) {
      Alert.alert('Unavailable', 'User data is not ready yet. Please try again shortly.');
      return;
    }
    setIsEditing(true);
  };

  const sanitize = (value?: string) => {
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  };

  const sanitizeField = (key: FormKey) => sanitize(formValues[key]);

  const requiredFields: FormKey[] = ['firstName', 'lastName', 'email', 'phone', 'addressLine1', 'city', 'postCode'];
  const fieldLabels: Partial<Record<FormKey, string>> = {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    phone: 'Phone',
    addressLine1: 'Address',
    city: 'City',
    postCode: 'Post code',
  };

  const handleSave = () => {
    if (!userId) {
      Alert.alert('Unavailable', 'User data is not ready yet. Please try again shortly.');
      return;
    }

    const missingFields = requiredFields.filter((key) => !sanitizeField(key));
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map((key) => fieldLabels[key] || key).join(', ');
      Alert.alert('Missing information', `Please fill in: ${missingLabels}.`);
      return;
    }

    const payload = buildUpdateProfilePayload({ formValues, initialHadNextOfKin });

    updateProfile(
      {
        userId,
        data: payload,
      },
      {
        onSuccess: () => {
          Alert.alert('Saved', 'Account details updated');
          setIsEditing(false);
        },
        onError: (error) => {
          const message =
            (error.response?.data as any)?.message ||
            error.message ||
            'Unable to update account details';
          Alert.alert('Error', message);
        },
      }
    );
  };

  const dobDate = useMemo(() => parseDob(formValues.dob), [formValues.dob]);

  const handleDobPress = () => {
    if (!isEditing) return;
    setShowDatePicker(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (!selectedDate) {
      return;
    }
    const iso = selectedDate.toISOString().split('T')[0];
    setFormValues((prev) => ({ ...prev, dob: iso }));
  };

  const handleCountryPress = () => {
    if (!isEditing) return;
    setShowCountryPicker(true);
  };

  const handleCountrySelect = (code: string) => {
    setFormValues((prev) => ({ ...prev, country: code }));
    setShowCountryPicker(false);
  };

  const handleCountryPickerClose = () => {
    setShowCountryPicker(false);
  };

  const sections: DetailSection[] = useMemo(
    () => [
      {
        key: 'personal',
        title: 'PERSONAL INFO',
        rows: [
          {
            key: 'firstName',
            label: 'First name',
            value: formValues.firstName || firstName,
            formKey: 'firstName',
            autoCapitalize: 'words',
            autoComplete: 'given-name',
            textContentType: 'givenName',
          },
          {
            key: 'lastName',
            label: 'Last name',
            value: formValues.lastName || lastName,
            formKey: 'lastName',
            autoCapitalize: 'words',
            autoComplete: 'family-name',
            textContentType: 'familyName',
          },
          {
            key: 'email',
            label: 'Email Address',
            value: formValues.email || email,
            valueNumberOfLines: 1,
            valueEllipsizeMode: 'middle',
            formKey: 'email',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
            placeholder: 'name@example.com',
            autoComplete: 'email',
            textContentType: 'emailAddress',
          },
          {
            key: 'dob',
            label: 'DOB',
            value: dobDisplay,
            formKey: 'dob',
            placeholder: 'DD/MM/YYYY',
            autoCapitalize: 'none',
            isDate: true,
          },
        ],
      },
      {
        key: 'details',
        title: 'DETAILS',
        rows: [
          {
            key: 'phone',
            label: 'Phone',
            value: formValues.phone || phone,
            formKey: 'phone',
            keyboardType: 'phone-pad',
            autoComplete: 'tel',
            textContentType: 'telephoneNumber',
          },
          {
            key: 'addressLine1',
            label: 'Address',
            value: formValues.addressLine1 || addressLine1,
            formKey: 'addressLine1',
            multiline: true,
            autoCapitalize: 'words',
            autoComplete: 'street-address',
            textContentType: 'fullStreetAddress',
          },
          {
            key: 'city',
            label: 'City',
            value: formValues.city || city,
            formKey: 'city',
            autoCapitalize: 'words',
            autoComplete: 'street-address',
            textContentType: 'addressCity',
          },
          {
            key: 'postCode',
            label: 'Post code',
            value: formValues.postCode || postCode,
            formKey: 'postCode',
            autoCapitalize: 'characters',
            autoComplete: 'postal-code',
            textContentType: 'postalCode',
          },
          {
            key: 'country',
            label: 'Country',
            value: countryDisplay,
            formKey: 'country',
            autoCapitalize: 'characters',
            placeholder: 'Select country',
            isCountry: true,
          },
        ],
      },
      {
        key: 'nok',
        title: 'NEXT OF KIN',
        rows: [
          {
            key: 'nokFirstName',
            label: 'First name',
            value: formValues.nextOfKinFirstName || nextOfKin.firstName,
            formKey: 'nextOfKinFirstName',
            autoCapitalize: 'words',
          },
          {
            key: 'nokLastName',
            label: 'Last name',
            value: formValues.nextOfKinLastName || nextOfKin.lastName,
            formKey: 'nextOfKinLastName',
            autoCapitalize: 'words',
          },
          {
            key: 'nokPhone',
            label: 'Phone',
            value: formValues.nextOfKinPhone || nextOfKin.phone,
            formKey: 'nextOfKinPhone',
            keyboardType: 'phone-pad',
          },
        ],
      },
    ],
    [
      addressLine1,
      city,
      countryDisplay,
      dobDisplay,
      email,
      firstName,
      formValues,
      lastName,
      nextOfKin,
      phone,
      postCode,
    ]
  );

  const scrollBottomPadding = Math.max(insets.bottom, 16) + 80;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <AccountDetailsHeader
        title="ACCOUNT DETAILS"
        isEditing={isEditing}
        canEdit={canEdit}
        isSaving={isPending}
        onBack={() => router.back()}
        onCancel={handleCancelEdit}
        onEdit={handleEditPress}
        onSave={handleSave}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {sections.map((section) => (
          <DetailSectionCard
            key={section.key}
            section={section}
            isEditing={isEditing}
            formValues={formValues}
            onChange={handleInputChange}
            onDobPress={handleDobPress}
            onCountryPress={handleCountryPress}
          />
        ))}
      </ScrollView>

      <DobPickerModal
        visible={isEditing && showDatePicker}
        value={dobDate || maxDobDate}
        maximumDate={maxDobDate}
        onChange={handleDateChange}
        onClose={() => setShowDatePicker(false)}
      />

      <CountryPickerModal
        visible={isEditing && showCountryPicker}
        selectedCode={formValues.country || resolvedCountryCode}
        onSelect={handleCountrySelect}
        onClose={handleCountryPickerClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
  },
});
