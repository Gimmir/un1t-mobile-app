import type { KeyboardTypeOptions, TextInputProps } from 'react-native';

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  phone: string;
  addressLine1: string;
  city: string;
  postCode: string;
  country: string;
  nextOfKinFirstName: string;
  nextOfKinLastName: string;
  nextOfKinPhone: string;
};

export type FormKey = keyof FormValues;

export type DetailRow = {
  key: string;
  label: string;
  value: string;
  valueNumberOfLines?: number;
  valueEllipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  formKey?: FormKey;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  placeholder?: string;
  multiline?: boolean;
  isDate?: boolean;
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  isCountry?: boolean;
};

export type DetailSection = {
  key: string;
  title: string;
  rows: DetailRow[];
};

