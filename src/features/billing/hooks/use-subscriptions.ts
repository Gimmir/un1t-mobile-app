import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { billingApi, type Subscription } from '@/src/features/billing/api/billing.api';

type UseSubscriptionsOptions = {
  enabled?: boolean;
  staleTime?: number;
};

export function useSubscriptions(options?: UseSubscriptionsOptions) {
  return useFetch<Subscription[]>(
    ['billing', 'subscriptions'],
    () => billingApi.getSubscriptions(),
    {
      enabled: options?.enabled ?? true,
      staleTime: options?.staleTime ?? 60 * 1000,
    }
  );
}

export function useCancelSubscription() {
  return useMutate<unknown, Error, { stripeSubscriptionId: string }>((payload) =>
    billingApi.cancelSubscription(payload.stripeSubscriptionId)
  );
}
