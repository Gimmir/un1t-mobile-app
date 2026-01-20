import React from 'react';

type StripeProviderProps = {
  children: React.ReactNode;
  publishableKey: string;
  merchantIdentifier?: string;
  stripeAccountId?: string;
  threeDSecureParams?: unknown;
  urlScheme?: string;
  setReturnUrlSchemeOnAndroid?: boolean;
};

type PaymentSheetResult = { error?: { message?: string } };
type StripeHookResult = {
  initPaymentSheet: (options: Record<string, unknown>) => Promise<PaymentSheetResult>;
  presentPaymentSheet: () => Promise<PaymentSheetResult>;
};

type InitStripeParams = Record<string, unknown>;

// Stripe temporarily disabled for iOS 26 compatibility testing
const StripeProvider: React.ComponentType<StripeProviderProps> = ({ children }) => <>{children}</>;
const useStripe = (): StripeHookResult => ({
  initPaymentSheet: async () => ({ error: { message: 'Stripe SDK temporarily disabled.' } }),
  presentPaymentSheet: async () => ({ error: { message: 'Stripe SDK temporarily disabled.' } }),
});
const initStripe = async (_params: InitStripeParams) => {
  throw new Error('Stripe SDK temporarily disabled.');
};
const isStripeAvailable = false;

export { StripeProvider, initStripe, isStripeAvailable, useStripe };

