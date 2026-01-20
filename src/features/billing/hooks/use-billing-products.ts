import { useFetch, useMutate } from '@/src/hooks/useFetch';
import {
  billingApi,
  type BillingPrice,
  type PaymentSheetPayload,
  type PaymentSheetResponse,
} from '@/src/features/billing/api/billing.api';

export function useBillingProductPrices(studioId: string | null | undefined) {
  return useFetch<BillingPrice[]>(
    ['billing', 'purchases', 'products', studioId],
    () => billingApi.getProductPrices(String(studioId)),
    {
      enabled: Boolean(studioId),
      staleTime: 60 * 1000,
    }
  );
}

export function useCreatePaymentSheet() {
  return useMutate<PaymentSheetResponse, Error, PaymentSheetPayload>((payload) =>
    billingApi.createPaymentSheet(payload)
  );
}

export function useCreateCheckoutSession() {
  return useMutate<PaymentSheetResponse, Error, PaymentSheetPayload>((payload) =>
    billingApi.createCheckoutSession(payload)
  );
}
