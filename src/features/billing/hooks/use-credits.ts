import { useFetch } from '@/src/hooks/useFetch';
import {
  billingApi,
  type CreditsBalance,
  type CreditsLedger,
} from '@/src/features/billing/api/billing.api';

type CreditsQueryOptions = {
  enabled?: boolean;
  staleTime?: number;
  studioId?: string | null;
};

export function useCreditsBalance(options?: CreditsQueryOptions) {
  const studioId = options?.studioId ?? null;
  return useFetch<CreditsBalance>(
    ['billing', 'credits', 'balance', studioId],
    () => billingApi.getCreditsBalance(studioId),
    {
      staleTime: options?.staleTime ?? 60 * 1000,
      enabled: options?.enabled ?? true,
    }
  );
}

export function useCreditsLedger(options?: CreditsQueryOptions) {
  const studioId = options?.studioId ?? null;
  return useFetch<CreditsLedger>(
    ['billing', 'credits', 'ledger', studioId],
    () => billingApi.getCreditsLedger(studioId),
    {
      staleTime: options?.staleTime ?? 60 * 1000,
      enabled: options?.enabled ?? true,
    }
  );
}
