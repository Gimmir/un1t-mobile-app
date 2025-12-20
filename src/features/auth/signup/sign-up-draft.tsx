import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type SignUpStep1 = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  homeStudioId: string;
  languageId: string;
  marketing?: boolean;
  terms?: boolean;
};

export type SignUpStep2 = {
  phoneNumber: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  dob: Date;
  gender: 'Male' | 'Female' | 'Prefer not to say';
  measurement: 'Imperial' | 'Metric';
};

export type SignUpStep3 = {
  nokFirstName: string;
  nokLastName: string;
  nokPhoneNumber: string;
};

export type SignUpDraft = {
  step1?: SignUpStep1;
  step2?: SignUpStep2;
  step3?: SignUpStep3;
};

type Ctx = {
  draft: SignUpDraft;
  setStep1: (value: SignUpStep1) => void;
  setStep2: (value: SignUpStep2) => void;
  setStep3: (value: SignUpStep3) => void;
  reset: () => void;
};

const SignUpDraftContext = createContext<Ctx | null>(null);

export function SignUpDraftProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [draft, setDraft] = useState<SignUpDraft>({});

  const value = useMemo<Ctx>(
    () => ({
      draft,
      setStep1: (step1) => setDraft((prev) => ({ ...prev, step1 })),
      setStep2: (step2) => setDraft((prev) => ({ ...prev, step2 })),
      setStep3: (step3) => setDraft((prev) => ({ ...prev, step3 })),
      reset: () => setDraft({}),
    }),
    [draft]
  );

  return <SignUpDraftContext.Provider value={value}>{children}</SignUpDraftContext.Provider>;
}

export function useSignUpDraft() {
  const ctx = useContext(SignUpDraftContext);
  if (!ctx) {
    throw new Error('useSignUpDraft must be used within SignUpDraftProvider');
  }
  return ctx;
}

