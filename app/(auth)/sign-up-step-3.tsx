import { SlideUpModal } from '@/components/auth';
import { SignUpStepHeading } from '@/components/auth/signup/SignUpStepHeading';
import { SignUpStepScreen } from '@/components/auth/signup/SignUpStepScreen';
import { ContactOption, ContactRow } from '@/components/auth/signup/step3/ContactRow';
import { Step3Form } from '@/components/auth/signup/step3/Step3Form';
import { useSignUpDraft } from '@/src/features/auth/signup/sign-up-draft';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Contacts from 'expo-contacts';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import * as z from 'zod';

const step3Schema = z.object({
  nokFirstName: z.string().min(2, { message: 'First name is required' }),
  nokLastName: z.string().min(2, { message: 'Last name is required' }),
  nokPhoneNumber: z.string().min(5, { message: 'Phone number is required' }),
});

type Step3FormData = z.infer<typeof step3Schema>;

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

function toContactOption(contact: Contacts.Contact): ContactOption | null {
  const rawId = (contact as any)?.id ?? (contact as any)?.contactId;
  if (!rawId) return null;
  const first = contact.firstName ?? '';
  const last = contact.lastName ?? '';
  const name = `${first} ${last}`.trim() || 'Unknown';
  const phone = contact.phoneNumbers?.[0]?.number ?? '';
  if (!phone) return null;
  const initial = (first[0] || last[0] || '#').toUpperCase();
  return { id: String(rawId), name, phone, initial };
}

export default function SignUpStep3Screen() {
  const router = useRouter();
  const { draft, setStep3 } = useSignUpDraft();

  const [contacts, setContacts] = useState<ContactOption[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactOption[]>([]);
  const [isContactsModalVisible, setContactsModalVisible] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
    defaultValues: {
      nokFirstName: draft.step3?.nokFirstName ?? '',
      nokLastName: draft.step3?.nokLastName ?? '',
      nokPhoneNumber: draft.step3?.nokPhoneNumber ?? '',
    },
  });

  const openContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need permission to access your contacts.');
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.FirstName, Contacts.Fields.LastName],
        sort: Contacts.SortTypes.FirstName,
      });

      const mapped = data.map(toContactOption).filter(Boolean) as ContactOption[];
      if (mapped.length === 0) {
        Alert.alert('No contacts found', 'Your contact book seems empty.');
        return;
      }

      setContacts(mapped);
      setFilteredContacts(mapped);
      setContactsModalVisible(true);
    } catch {
      Alert.alert('Error', 'Failed to load contacts.');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleSearch = (text: string) => {
    const nameQuery = text.trim().toLowerCase();
    const phoneQuery = normalizePhone(text);
    if (!nameQuery && !phoneQuery) {
      setFilteredContacts(contacts);
      return;
    }
    const filtered = contacts.filter((contact) => {
      const byName = nameQuery ? contact.name.toLowerCase().includes(nameQuery) : false;
      const byPhone = phoneQuery ? normalizePhone(contact.phone).includes(phoneQuery) : false;
      return byName || byPhone;
    });
    setFilteredContacts(filtered);
  };

  const handleSelectContact = (contact: ContactOption) => {
    const [first, ...rest] = contact.name.split(' ');
    const last = rest.join(' ');
    if (first) setValue('nokFirstName', first, { shouldValidate: true });
    if (last) setValue('nokLastName', last, { shouldValidate: true });
    setValue('nokPhoneNumber', contact.phone, { shouldValidate: true });
    setContactsModalVisible(false);
  };

  const onSubmit = (data: Step3FormData) => {
    setStep3({
      nokFirstName: data.nokFirstName,
      nokLastName: data.nokLastName,
      nokPhoneNumber: data.nokPhoneNumber,
    });
    router.push('/(auth)/sign-up-step-4');
  };

  const selectedPhone = watch('nokPhoneNumber');

  return (
    <SignUpStepScreen step={3} totalSteps={5} backgroundHeight={480} onBack={() => router.back()}>
      <SignUpStepHeading title="NEXT OF KIN" subtitle="Add contact in case of emergency" />

      <Step3Form
        control={control}
        errors={errors}
        hasPhoneSelected={Boolean(selectedPhone)}
        onPickContact={openContacts}
        onSubmit={handleSubmit(onSubmit)}
      />

      <SlideUpModal
        visible={isContactsModalVisible}
        onClose={() => setContactsModalVisible(false)}
        title="Pick a contact"
        data={filteredContacts}
        searchable
        onSearch={handleSearch}
        isLoading={isLoadingContacts}
        emptyText={isLoadingContacts ? 'Loading…' : 'No contacts found.'}
        height="80%"
        renderItem={({ item }: { item: ContactOption }) => (
          <ContactRow contact={item} onPress={() => handleSelectContact(item)} />
        )}
      />
    </SignUpStepScreen>
  );
}
