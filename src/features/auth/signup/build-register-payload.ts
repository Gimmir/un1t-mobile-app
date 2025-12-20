import type { RegisterRequest } from '@/src/types/api';
import type { SignUpDraft } from './sign-up-draft';

export function buildRegisterPayload(draft: SignUpDraft): RegisterRequest | null {
  const step1 = draft.step1;
  const step2 = draft.step2;
  const step3 = draft.step3;

  if (!step1 || !step2 || !step3) return null;
  if (!step1.email || !step1.password || !step1.firstName || !step1.lastName) return null;
  if (!step1.homeStudioId) return null;

  const birthdayIso = step2.dob ? step2.dob.toISOString() : undefined;

  return {
    email: step1.email,
    password: step1.password,
    firstName: step1.firstName,
    lastName: step1.lastName,
    role: 'client' as any,
    phoneNumber: step2.phoneNumber,
    phone: step2.phoneNumber,
    address: step2.address,
    city: step2.city,
    postcode: step2.postcode,
    postCode: step2.postcode,
    country: step2.country,
    birthday: birthdayIso,
    dob: birthdayIso,
    language: step1.languageId,
    languageId: step1.languageId as any,
    studio: step1.homeStudioId,
    studioId: step1.homeStudioId as any,
    homeStudio: step1.homeStudioId as any,
    nextOfKin: {
      firstName: step3.nokFirstName,
      lastName: step3.nokLastName,
      phone: step3.nokPhoneNumber,
    },
    marketing: step1.marketing,
    gender: step2.gender,
    measurement: step2.measurement,
  };
}

