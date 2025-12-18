import type { UpdateProfileRequest } from '@/src/types/api';
import type { FormValues } from './types';
import { resolveCountryCode } from './account-details.utils';

function sanitize(value?: string) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

export function buildUpdateProfilePayload(args: {
  formValues: FormValues;
  initialHadNextOfKin: boolean;
}): UpdateProfileRequest {
  const { formValues, initialHadNextOfKin } = args;

  const normalizedPostCode = sanitize(formValues.postCode);

  const payload: UpdateProfileRequest = {
    firstName: sanitize(formValues.firstName),
    lastName: sanitize(formValues.lastName),
    email: sanitize(formValues.email),
    phone: sanitize(formValues.phone),
    phoneNumber: sanitize(formValues.phone),
    birthday: sanitize(formValues.dob),
    dob: sanitize(formValues.dob),
    address: sanitize(formValues.addressLine1),
    city: sanitize(formValues.city),
    postCode: normalizedPostCode,
    postcode: normalizedPostCode,
  };

  const normalizedCountry = sanitize(formValues.country);
  if (normalizedCountry) {
    payload.country = resolveCountryCode(normalizedCountry);
  }

  const nextOfKin = {
    firstName: sanitize(formValues.nextOfKinFirstName),
    lastName: sanitize(formValues.nextOfKinLastName),
    phone: sanitize(formValues.nextOfKinPhone),
  };

  if (
    initialHadNextOfKin ||
    nextOfKin.firstName ||
    nextOfKin.lastName ||
    nextOfKin.phone
  ) {
    payload.nextOfKin = nextOfKin;
  }

  return payload;
}

