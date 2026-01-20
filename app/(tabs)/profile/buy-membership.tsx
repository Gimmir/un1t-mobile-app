import { resolveCountryCode } from '@/components/profile/account-details/account-details.utils';
import { ProfileCard } from '@/components/profile/profile/ProfileCard';
import { ProfileTopBackground } from '@/components/profile/profile/ProfileTopBackground';
import { SettingsHeader } from '@/components/profile/settings/SettingsHeader';
import { TAB_HEIGHT } from '@/components/tabs';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import {
  useBillingProductPrices,
  useCreateCheckoutSession,
  useCreatePaymentSheet,
} from '@/src/features/billing/hooks/use-billing-products';
import { useCancelSubscription, useSubscriptions } from '@/src/features/billing/hooks/use-subscriptions';
import { initStripe, isStripeAvailable, useStripe } from '@/src/features/billing/stripe';
import { resolveUserStudioId } from '@/src/features/users/utils/resolve-user-studio-id';
import { queryClient } from '@/src/lib/query-client';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const ACCENT_COLOR = '#FCD34D'; // Золотий акцент
const STRIPE_URL_SCHEME = 'un1tmobileapp';
const STRIPE_APPEARANCE = {
  colors: {
    primary: ACCENT_COLOR,
    background: colors.surface.base,
    componentBackground: colors.surface.elevated,
    componentBorder: colors.border.strong,
    componentDivider: colors.border.strong,
    primaryText: colors.text.primary,
    secondaryText: colors.text.secondary,
    placeholderText: colors.text.placeholder,
    icon: colors.text.primary,
    error: '#EF4444',
  },
  shapes: {
    borderRadius: 10,
    borderWidth: 1,
  },
  primaryButton: {
    colors: {
      background: '#FFFFFF',
      text: '#0B0B0B',
      border: '#FFFFFF',
    },
    shapes: {
      borderRadius: 10,
      borderWidth: 0,
    },
  },
} as const;

const STRIPE_LINK_DISPLAY_NEVER = 'never';
const STRIPE_MERCHANT_COUNTRY_CODE = (process.env.EXPO_PUBLIC_STRIPE_MERCHANT_COUNTRY_CODE ?? 'US').toUpperCase();

const currencySymbols: Record<string, string> = {
  gbp: '£',
  usd: '$',
  eur: '€',
};

const formatPeriodDate = (value: string | null | undefined) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}.${month}.${year}`;
};

const normalizePlanType = (value: string | null | undefined) =>
  value ? value.trim().toLowerCase() : null;

const normalizeStatus = (value: unknown) =>
  typeof value === 'string' ? value.trim().toLowerCase() : '';

const normalizeBoolean = (value: unknown) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true' || normalized === '1') return true;
    if (normalized === 'false' || normalized === '0') return false;
  }
  return false;
};

const pickStringValue = (value: unknown) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return null;
};

const pickFirstString = (record: Record<string, unknown> | null | undefined, keys: string[]) => {
  if (!record) return null;
  for (const key of keys) {
    const value = pickStringValue(record[key]);
    if (value) return value;
  }
  return null;
};

const resolveSubscriptionStatus = (subscription: Record<string, unknown> | null | undefined) => {
  const direct = pickFirstString(subscription, [
    'status',
    'subscriptionStatus',
    'subscription_status',
    'stripeStatus',
    'stripe_status',
    'stripeSubscriptionStatus',
    'stripe_subscription_status',
  ]);
  if (direct) return normalizeStatus(direct);
  const stripeSub = subscription?.stripeSubscription;
  if (stripeSub && typeof stripeSub === 'object') {
    const nested = pickFirstString(stripeSub as Record<string, unknown>, ['status']);
    if (nested) return normalizeStatus(nested);
  }
  const stripeSubSnake = subscription?.stripe_subscription;
  if (stripeSubSnake && typeof stripeSubSnake === 'object') {
    const nested = pickFirstString(stripeSubSnake as Record<string, unknown>, ['status']);
    if (nested) return normalizeStatus(nested);
  }
  return '';
};

const resolveStudioId = (subscription: Record<string, unknown> | null | undefined) => {
  const direct = pickFirstString(subscription, ['studioId', 'studio_id', 'studio']);
  if (direct) return direct;
  const studio = subscription?.studio;
  if (studio && typeof studio === 'object') {
    return pickFirstString(studio as Record<string, unknown>, ['_id', 'id']);
  }
  return null;
};

const resolvePlanType = (subscription: Record<string, unknown> | null | undefined) =>
  normalizePlanType(
    pickFirstString(subscription, ['planType', 'plan_type', 'plan', 'planName', 'plan_name'])
  );

const resolveCancelAtPeriodEnd = (subscription: Record<string, unknown> | null | undefined) => {
  if (!subscription) return false;
  const direct =
    (subscription as Record<string, unknown>).cancelAtPeriodEnd ??
    (subscription as Record<string, unknown>).cancel_at_period_end ??
    (subscription as Record<string, unknown>).cancelAtPeriodEndAt ??
    (subscription as Record<string, unknown>).cancel_at_period_end_at;
  return normalizeBoolean(direct);
};

const resolveCurrentPeriodEnd = (subscription: Record<string, unknown> | null | undefined) =>
  pickFirstString(subscription, [
    'currentPeriodEnd',
    'current_period_end',
    'currentPeriodEndAt',
    'current_period_end_at',
  ]);

const resolveStripeSubscriptionId = (subscription: Record<string, unknown> | null | undefined) => {
  const direct = pickFirstString(subscription, ['stripeSubscriptionId', 'stripe_subscription_id']);
  if (direct) return direct;
  const stripeSub = subscription?.stripeSubscription;
  if (stripeSub && typeof stripeSub === 'object') {
    const nested = pickFirstString(stripeSub as Record<string, unknown>, ['id', 'subscriptionId', 'subscription_id']);
    if (nested) return nested;
  }
  const stripeSubSnake = subscription?.stripe_subscription;
  if (stripeSubSnake && typeof stripeSubSnake === 'object') {
    const nested = pickFirstString(stripeSubSnake as Record<string, unknown>, ['id', 'subscriptionId', 'subscription_id']);
    if (nested) return nested;
  }
  return null;
};

const inferPlanTypeFromName = (name: string | null | undefined) => {
  if (!name) return null;
  const normalized = name.toLowerCase();
  if (normalized.includes('unlimited')) return 'unlimited';
  const creditsMatch = normalized.match(/(\d+)\s*(x|credits|credit)/);
  if (creditsMatch?.[1]) return creditsMatch[1];
  return null;
};

const resolveIntervalLabels = (interval: string | null | undefined) => {
  if (!interval) return null;
  const normalized = interval.trim().toLowerCase();
  const lookup: Record<string, { long: string; short: string }> = {
    day: { long: 'daily', short: 'day' },
    week: { long: 'weekly', short: 'wk' },
    month: { long: 'monthly', short: 'mo' },
    year: { long: 'yearly', short: 'yr' },
  };
  return lookup[normalized] ?? { long: normalized, short: normalized };
};

function SkeletonLoader() {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerValue]);

  const opacity = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ style }: { style?: any }) => (
    <Animated.View style={[styles.skeletonBox, { opacity }, style]} />
  );

  return (
    <View style={styles.skeletonContainer}>
      {/* Current Plan Skeleton */}
      <View style={[styles.cardBase, styles.cardCurrent, { marginBottom: 24, padding: 16 }]}>
        <SkeletonBox style={{ width: '40%', height: 12, marginBottom: 8 }} />
        <SkeletonBox style={{ width: '70%', height: 20, marginBottom: 8 }} />
        <SkeletonBox style={{ width: '50%', height: 12 }} />
      </View>

      {/* Price Cards Skeletons */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.cardWrapper}>
          <View style={[styles.cardBase, { padding: 16, marginBottom: 12 }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <SkeletonBox style={{ width: '80%', height: 18, marginBottom: 6 }} />
                <SkeletonBox style={{ width: '60%', height: 14 }} />
              </View>
              <View style={styles.priceBlock}>
                <SkeletonBox style={{ width: 60, height: 18, marginBottom: 4 }} />
                <SkeletonBox style={{ width: 40, height: 12 }} />
              </View>
            </View>
            
            <SkeletonBox style={{ width: '100%', height: 14, marginTop: 12 }} />
            
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <SkeletonBox style={{ width: '70%', height: 12, marginBottom: 4 }} />
                <SkeletonBox style={{ width: '50%', height: 14 }} />
              </View>
              <View style={styles.metaItem}>
                <SkeletonBox style={{ width: '70%', height: 12, marginBottom: 4 }} />
                <SkeletonBox style={{ width: '50%', height: 14 }} />
              </View>
            </View>
            
            <SkeletonBox style={{ width: '100%', height: 48, marginTop: 16, borderRadius: 8 }} />
          </View>
        </View>
      ))}
    </View>
  );
}

export default function BuyMembershipScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user, refetch: refetchUser } = useAuth();
  const resolvedStudioId = useMemo(() => resolveUserStudioId(user), [user]);

  const {
    data: prices,
    isLoading: isLoadingPrices,
    error: pricesError,
  } = useBillingProductPrices(resolvedStudioId);
  const {
    data: subscriptions = [],
    isLoading: isLoadingSubscriptions,
    error: subscriptionsError,
    refetch: refetchSubscriptions,
  } = useSubscriptions({ enabled: true, staleTime: 0 });
  const { mutateAsync: cancelSubscription, isPending: isCancelingSubscription } = useCancelSubscription();
  const { mutateAsync: createPaymentSheet, isPending: isCreatingPaymentSheet } = useCreatePaymentSheet();
  const { mutateAsync: createCheckoutSession, isPending: isCreatingCheckoutSession } =
    useCreateCheckoutSession();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [pendingPriceId, setPendingPriceId] = useState<string | null>(null);
  const stripePublishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
  const isLoading = isLoadingPrices || isLoadingSubscriptions;
  const isCheckoutBusy = isCreatingPaymentSheet || isCreatingCheckoutSession;
  const error = pricesError || subscriptionsError;
  const billingDefaults = useMemo(() => {
    if (!user) return null;
    const rawFirstName = user.firstName ?? '';
    const rawLastName = user.lastName ?? '';
    const name = `${rawFirstName} ${rawLastName}`.trim();
    const phone =
      (user as any)?.phone ||
      (user as any)?.phoneNumber ||
      (user as any)?.phoneNumber?.toString?.() ||
      '';
    const line1 = (user as any)?.address || (user as any)?.addressLine1 || '';
    const city = (user as any)?.city || '';
    const postalCode =
      (user as any)?.postCode || (user as any)?.postcode || (user as any)?.zip || (user as any)?.zipCode || '';
    const countryInput =
      (user as any)?.country || (user as any)?.countryCode || (user as any)?.countryName || '';
    const country = resolveCountryCode(countryInput);
    const hasAddress = Boolean(line1 || city || postalCode || country);

    return {
      name: name || undefined,
      email: user.email || undefined,
      phone: phone ? String(phone) : undefined,
      address: hasAddress
        ? {
            line1: line1 || undefined,
            city: city || undefined,
            postalCode: postalCode || undefined,
            country: country || undefined,
          }
        : undefined,
    };
  }, [user]);

  const { sortedPrices, maxPriceId } = useMemo(() => {
    if (!Array.isArray(prices)) return { sortedPrices: [], maxPriceId: null };
    // Сортуємо ціни
    const sorted = [...prices].sort((a, b) => (a.unit_amount || 0) - (b.unit_amount || 0));
    // ID найдорожчого плану
    const maxId = sorted.length > 0 ? sorted[sorted.length - 1].id : null;
    return { sortedPrices: sorted, maxPriceId: maxId };
  }, [prices]);

  const { activeSubscription, currentPlanType, subscriptionRanks, currentPlanPriceId } = useMemo(() => {
    const activeList = subscriptions.filter((item) => {
      const status = resolveSubscriptionStatus(item as Record<string, unknown>);
      return status === 'active' || status === 'trialing';
    });
    const matchStudio = activeList.find(
      (item) => resolveStudioId(item as Record<string, unknown>) === resolvedStudioId
    );
    const fallbackMatch = subscriptions.find(
      (item) => resolveStudioId(item as Record<string, unknown>) === resolvedStudioId
    );
    const active = matchStudio || activeList[0] || fallbackMatch || subscriptions[0] || null;
    const planType = resolvePlanType(active as Record<string, unknown> | null);
    const subscriptionPrices = sortedPrices.filter((price) => price.recurring?.interval);
    const ranked = [...subscriptionPrices].sort((a, b) => (a.unit_amount || 0) - (b.unit_amount || 0));
    const findPlanType = (price: typeof subscriptionPrices[number]) => {
      const metadata = price.metadata || price.product?.metadata;
      const rawPlanType =
        (metadata?.planType as string | undefined) ||
        (metadata?.plan_type as string | undefined) ||
        (metadata?.plan as string | undefined) ||
        (metadata?.plan_name as string | undefined);
      return normalizePlanType(rawPlanType) || inferPlanTypeFromName(price.product?.name) || null;
    };
    const planMap = new Map<string, string | null>();
    for (const price of ranked) {
      planMap.set(price.id, findPlanType(price));
    }
    const matchedPrice =
      (planType
        ? ranked.find((price) => planMap.get(price.id) === planType)
        : null) ||
      (active && ranked.length === 1 ? ranked[0] : null);
    return {
      activeSubscription: active,
      currentPlanType: planType,
      subscriptionRanks: ranked.map((price) => ({
        id: price.id,
        planType: planMap.get(price.id) || null,
      })),
      currentPlanPriceId: matchedPrice?.id ?? null,
    };
  }, [subscriptions, resolvedStudioId, sortedPrices]);

  const currentPlanRankIndex = useMemo(() => {
    if (!currentPlanPriceId) return -1;
    return subscriptionRanks.findIndex((rank) => rank.id === currentPlanPriceId);
  }, [currentPlanPriceId, subscriptionRanks]);

  const currentPlanTitle = useMemo(() => {
    const matched = sortedPrices.find((price) => price.id === currentPlanPriceId);
    if (matched?.product?.name) return matched.product.name;
    if (currentPlanType) return currentPlanType.replace(/[_-]/g, ' ').toUpperCase();
    return 'ACTIVE PLAN';
  }, [currentPlanPriceId, currentPlanType, sortedPrices]);

  const isCancelScheduled = resolveCancelAtPeriodEnd(activeSubscription as Record<string, unknown> | null);
  const subscriptionStatus = resolveSubscriptionStatus(activeSubscription as Record<string, unknown> | null);

  const currentPlanPeriod = useMemo(() => {
    const periodEnd = resolveCurrentPeriodEnd(activeSubscription as Record<string, unknown> | null);
    if (!periodEnd) return null;
    const formatted = formatPeriodDate(periodEnd);
    if (!formatted) return null;
    return isCancelScheduled ? `ENDS ${formatted}` : `RENEWS ${formatted}`;
  }, [activeSubscription, isCancelScheduled]);

  const isCanceledStatus =
    subscriptionStatus === 'canceled' ||
    subscriptionStatus === 'cancelled' ||
    subscriptionStatus === 'incomplete_expired';
  const canCancelSubscription = Boolean(activeSubscription && !isCanceledStatus);

  const formatAmount = (amount: number | null | undefined, currency: string | null | undefined) => {
    if (typeof amount !== 'number') return '—';
    const symbol = currency ? currencySymbols[currency.toLowerCase()] : '';
    const value = (amount / 100).toFixed(2);
    return symbol ? `${symbol}${value}` : `${value} ${String(currency || '').toUpperCase()}`.trim();
  };

  const extractCheckoutUrl = (payload: unknown) => {
    if (typeof payload === 'string') return payload;
    if (!payload || typeof payload !== 'object') return null;
    const record = payload as Record<string, unknown>;
    const direct =
      (record.url as string | undefined) ||
      (record.checkoutUrl as string | undefined) ||
      (record.sessionUrl as string | undefined) ||
      (record.paymentUrl as string | undefined) ||
      (record.redirectUrl as string | undefined) ||
      (record.checkout_url as string | undefined) ||
      (record.payment_url as string | undefined) ||
      (record.redirect_url as string | undefined);
    if (direct) return direct;
    const nested = record.data;
    if (nested && typeof nested === 'object') {
      const nestedRecord = nested as Record<string, unknown>;
      return (
        (nestedRecord.url as string | undefined) ||
        (nestedRecord.checkoutUrl as string | undefined) ||
        (nestedRecord.sessionUrl as string | undefined) ||
        (nestedRecord.paymentUrl as string | undefined) ||
        (nestedRecord.redirectUrl as string | undefined) ||
        (nestedRecord.checkout_url as string | undefined) ||
        (nestedRecord.payment_url as string | undefined) ||
        (nestedRecord.redirect_url as string | undefined) ||
        null
      );
    }
    return null;
  };

  const openCheckoutUrl = async (url: string) => {
    if (process.env.EXPO_OS !== 'web') {
      await openBrowserAsync(url, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
      return;
    }
    await Linking.openURL(url);
  };

  const extractPaymentSheetData = (payload: unknown) => {
    if (!payload || typeof payload !== 'object') return null;
    const record = payload as Record<string, unknown>;
    const isRecord = (value: unknown): value is Record<string, unknown> =>
      Boolean(value) && typeof value === 'object' && !Array.isArray(value);
    const candidates: Record<string, unknown>[] = [record];
    if (isRecord(record.data)) {
      candidates.push(record.data);
    }
    const containerKeys = [
      'stripe',
      'stripeAccount',
      'stripe_account',
      'account',
      'connectedAccount',
      'connected_account',
      'connect',
      'paymentSheet',
      'payment_sheet',
    ];
    for (const key of containerKeys) {
      const value = record[key];
      if (isRecord(value)) candidates.push(value);
    }
    if (isRecord(record.data)) {
      for (const key of containerKeys) {
        const value = (record.data as Record<string, unknown>)[key];
        if (isRecord(value)) candidates.push(value);
      }
    }
    const getStringFromKeys = (keys: string[]) => {
      for (const candidate of candidates) {
        for (const key of keys) {
          const value = candidate[key];
          if (typeof value === 'string' && value.trim().length > 0) {
            return value;
          }
        }
      }
      return null;
    };
    const resolveAccountId = () => {
      const direct = getStringFromKeys([
        'stripeAccountId',
        'stripe_account_id',
        'accountId',
        'account_id',
        'connectedAccountId',
        'connected_account_id',
        'connectAccountId',
        'connect_account_id',
      ]);
      if (direct) return direct;
      const possibleKeys = ['stripeAccount', 'stripe_account', 'account', 'connectedAccount', 'connected_account'];
      for (const candidate of candidates) {
        for (const key of possibleKeys) {
          const value = candidate[key];
          if (typeof value === 'string' && value.trim().length > 0) {
            return value;
          }
          if (isRecord(value) && typeof value.id === 'string') {
            return value.id;
          }
        }
      }
      return null;
    };

    return {
      publishableKey: getStringFromKeys([
        'publishableKey',
        'publishable_key',
        'stripePublishableKey',
        'stripe_publishable_key',
        'stripeKey',
        'stripe_key',
        'pk',
      ]),
      customerId: getStringFromKeys(['customer', 'customerId', 'customer_id']),
      ephemeralKey: getStringFromKeys([
        'ephemeralKey',
        'ephemeralKeySecret',
        'ephemeral_key',
        'ephemeral_key_secret',
      ]),
      paymentIntent: getStringFromKeys([
        'paymentIntent',
        'paymentIntentClientSecret',
        'payment_intent',
        'payment_intent_client_secret',
        'client_secret',
      ]),
      setupIntent: getStringFromKeys([
        'setupIntent',
        'setupIntentClientSecret',
        'setup_intent',
        'setup_intent_client_secret',
      ]),
      stripeAccountId: resolveAccountId(),
    };
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ProfileTopBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader title="BUY MEMBERSHIP" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: Math.max(insets.bottom, 16) + TAB_HEIGHT + 24 }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <SkeletonLoader />
          ) : error ? (
            <View style={styles.stateBlock}>
              <Text style={styles.stateText}>Unable to load memberships.</Text>
            </View>
          ) : null}

          {activeSubscription ? (
            <ProfileCard style={[styles.cardBase, styles.cardCurrent, { marginBottom: 24 }]}>
              <View style={[styles.cardContent, { padding: 20 }]}>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.currentPlanLabel}>CURRENT PLAN</Text>
                  <Text style={styles.currentPlanTitle}>{currentPlanTitle}</Text>
                  {currentPlanPeriod ? <Text style={styles.currentPlanMeta}>{currentPlanPeriod}</Text> : null}
                </View>

                {isCancelScheduled ? (
                  <View style={{ marginTop: 12 }}>
                    <Text style={[styles.currentPlanMeta, { color: colors.text.secondary }]}>
                      Cancellation scheduled
                    </Text>
                  </View>
                ) : null}

                {canCancelSubscription ? (
                  <TouchableOpacity
                    accessibilityRole="button"
                    activeOpacity={0.85}
                    disabled={isCancelingSubscription || isCancelScheduled}
                    style={[
                      styles.cancelButton,
                      (isCancelingSubscription || isCancelScheduled) && styles.cancelButtonDisabled,
                    ]}
                    onPress={() => {
                      const stripeSubscriptionId = resolveStripeSubscriptionId(
                        activeSubscription as Record<string, unknown> | null
                      );
                      if (!stripeSubscriptionId) {
                        Alert.alert('Unavailable', 'Stripe subscription details are missing.');
                        return;
                      }
                      Alert.alert(
                        'Cancel plan',
                        'Your plan will stay active until the end of the current billing period.',
                        [
                          { text: 'Keep plan', style: 'cancel' },
                          {
                            text: 'Cancel plan',
                            style: 'destructive',
                            onPress: async () => {
                              try {
                                await cancelSubscription({ stripeSubscriptionId });
                                await refetchSubscriptions();
                                Alert.alert('Plan canceled', 'Your subscription will end after this period.');
                              } catch (err) {
                                const message = err instanceof Error ? err.message : 'Unable to cancel plan.';
                                Alert.alert('Cancel failed', message);
                              }
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.cancelButtonText}>
                      {isCancelingSubscription ? 'CANCELING…' : 'CANCEL SUBSCRIPTION'}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </ProfileCard>
          ) : null}

          {sortedPrices.map((price) => {
            const product = price.product;
            const creditsRaw = product?.metadata?.countOfCreditsToAdd;
            const credits = creditsRaw ? Number(creditsRaw) : null;
            const expiryRaw = product?.metadata?.expireCreditsInDays;
            const expiry = expiryRaw ? Number(expiryRaw) : null;
            const isRecurring = Boolean(price.recurring?.interval);
            const amountLabel = formatAmount(price.unit_amount, price.currency);
            const intervalLabels = resolveIntervalLabels(price.recurring?.interval);
            const intervalShort = intervalLabels?.short ?? null;
            const intervalLong = intervalLabels?.long ?? null;
            const intervalText = isRecurring && intervalShort ? `/${intervalShort}` : null;
            const intervalTitle = intervalLong ? intervalLong[0].toUpperCase() + intervalLong.slice(1) : null;
            const billingLabel = isRecurring
              ? intervalTitle
                ? `${intervalTitle} subscription`
                : 'Subscription'
              : 'One-time payment';

            const planRankIndex = isRecurring
              ? subscriptionRanks.findIndex((rank) => rank.id === price.id)
              : -1;
            const planType = subscriptionRanks.find((rank) => rank.id === price.id)?.planType ?? null;
            const isCurrentPlan =
              Boolean(activeSubscription) &&
              (price.id === currentPlanPriceId ||
                (Boolean(currentPlanType) && Boolean(planType) && currentPlanType === planType));
            const isUpgrade =
              isRecurring && currentPlanRankIndex >= 0 && planRankIndex > currentPlanRankIndex;
            const isDowngrade =
              isRecurring && currentPlanRankIndex >= 0 && planRankIndex < currentPlanRankIndex;

            const isBestValue = price.id === maxPriceId && !isCurrentPlan;
            const isCheckoutPending = pendingPriceId === price.id;
            const defaultCtaLabel = isRecurring ? 'BUY MEMBERSHIP' : 'BUY PACK';
            const ctaLabel = isCurrentPlan
              ? 'CURRENT PLAN'
              : isUpgrade
                ? 'UPGRADE'
                : isDowngrade
                  ? 'DOWNGRADE'
                  : defaultCtaLabel;
            const toneStyle = isBestValue ? styles.textPremium : isCurrentPlan ? styles.textCurrent : null;
            const metaValueStyle = isBestValue
              ? styles.metaValuePremium
              : isCurrentPlan
                ? styles.metaValueCurrent
                : null;

            return (
              <View key={price.id} style={styles.cardWrapper}>
                {isCurrentPlan ? (
                  <View style={styles.currentBadgeContainer}>
                    <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
                  </View>
                ) : isBestValue ? (
                  <View style={styles.badgeContainer}>
                    <Text style={styles.badgeText}>BEST VALUE</Text>
                  </View>
                ) : null}

                <ProfileCard
                  style={[styles.cardBase, isBestValue && styles.cardPremium, isCurrentPlan && styles.cardCurrent]}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <View style={styles.cardTitleBlock}>
                        <Text style={styles.cardTitle}>{product?.name ?? 'Membership'}</Text>
                        <Text style={styles.cardSubtitle}>{billingLabel}</Text>
                      </View>

                      <View style={styles.priceBlock}>
                        <Text style={[styles.cardPrice, toneStyle]}>
                          {amountLabel}
                          {intervalText ? <Text style={styles.cardInterval}>{intervalText}</Text> : null}
                        </Text>
                      </View>
                    </View>

                    {product?.description ? (
                      <Text style={styles.cardDescription} numberOfLines={1}>
                        {product.description}
                      </Text>
                    ) : null}

                    {isCurrentPlan && currentPlanPeriod ? (
                      <Text style={styles.currentPlanNote}>{currentPlanPeriod}</Text>
                    ) : null}

                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Credits</Text>
                        <Text style={[styles.metaValue, metaValueStyle]}>{credits ? credits : '—'}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Expiry</Text>
                        <Text style={[styles.metaValue, metaValueStyle]}>
                          {expiry ? `${expiry} days` : '—'}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={isCheckoutPending || isCheckoutBusy || isCurrentPlan}
                      style={[
                        styles.ctaButton,
                        isCurrentPlan
                          ? styles.ctaButtonCurrent
                          : isBestValue
                            ? styles.ctaButtonPremium
                            : styles.ctaButtonRegular,
                      ]}
                      onPress={async () => {
                        if (isCheckoutPending || isCheckoutBusy || isCurrentPlan) return;
                        if (!resolvedStudioId) {
                          Alert.alert('Unavailable', 'Studio data is missing. Please try again shortly.');
                          return;
                        }
                        setPendingPriceId(price.id);
                        try {
                          const productType: 'subscription' | 'pack' = isRecurring ? 'subscription' : 'pack';
                          const payload = {
                            studioId: resolvedStudioId,
                            priceId: price.id,
                            productType,
                          };

                          if (process.env.EXPO_OS === 'web' || !isStripeAvailable) {
                            const checkoutResponse = await createCheckoutSession(payload);
                            const checkoutUrl = extractCheckoutUrl(checkoutResponse);
                            if (checkoutUrl) {
                              await openCheckoutUrl(checkoutUrl);
                              return;
                            }
                            throw new Error('Checkout URL is missing.');
                          }

                          const paymentSheetResponse = await createPaymentSheet(payload);

                          const sheetData = extractPaymentSheetData(paymentSheetResponse);
                          const paymentIntentClientSecret = sheetData?.paymentIntent;
                          const setupIntentClientSecret = sheetData?.setupIntent;
                          if (
                            !sheetData?.customerId ||
                            !sheetData?.ephemeralKey ||
                            (!paymentIntentClientSecret && !setupIntentClientSecret)
                          ) {
                            throw new Error('Payment sheet data is missing.');
                          }

                          const effectivePublishableKey = sheetData.publishableKey || stripePublishableKey;
                          if (!effectivePublishableKey) {
                            throw new Error('Stripe publishable key is missing.');
                          }

                          await initStripe({
                            publishableKey: effectivePublishableKey,
                            stripeAccountId: sheetData.stripeAccountId || undefined,
                            urlScheme: STRIPE_URL_SCHEME,
                          });

                          const returnURL = Linking.createURL('stripe-redirect', {
                            scheme: STRIPE_URL_SCHEME,
                          });
                        const initResult = await initPaymentSheet({
                          merchantDisplayName: 'UN1T',
                          customerId: sheetData.customerId,
                          customerEphemeralKeySecret: sheetData.ephemeralKey,
                          paymentIntentClientSecret: paymentIntentClientSecret ?? undefined,
                          setupIntentClientSecret: setupIntentClientSecret ?? undefined,
                          returnURL,
                          defaultBillingDetails: billingDefaults ?? undefined,
                          billingDetailsCollectionConfiguration: {
                            address: 'never',
                          },
                          googlePay: {
                            merchantCountryCode: STRIPE_MERCHANT_COUNTRY_CODE,
                            testEnv: __DEV__,
                          },
                          style: 'alwaysDark',
                          appearance: STRIPE_APPEARANCE,
                          link: { display: STRIPE_LINK_DISPLAY_NEVER },
                        });

                          if (initResult.error) {
                            throw new Error(initResult.error.message);
                          }

                        const presentResult = await presentPaymentSheet();
                        if (presentResult.error) {
                          throw new Error(presentResult.error.message);
                        }

                        await Promise.allSettled([
                          queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'balance'] }),
                          queryClient.invalidateQueries({ queryKey: ['billing', 'credits', 'ledger'] }),
                          queryClient.invalidateQueries({ queryKey: ['billing', 'subscriptions'] }),
                          queryClient.invalidateQueries({ queryKey: ['user', 'me'] }),
                        ]);
                        refetchUser();

                        Alert.alert('Success', 'Membership purchased successfully.');

                        } catch (err) {
                          const message = err instanceof Error ? err.message : 'Unable to start payment.';
                          Alert.alert('Payment error', message);
                        } finally {
                          setPendingPriceId(null);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.ctaText,
                          isCurrentPlan
                            ? styles.ctaTextCurrent
                            : isBestValue
                              ? styles.ctaTextPremium
                              : styles.ctaTextRegular,
                        ]}
                      >
                        {isCheckoutPending ? 'PROCESSING…' : ctaLabel}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ProfileCard>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.app,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  stateBlock: {
    paddingTop: 24,
    alignItems: 'center',
    gap: 10,
  },
  stateText: {
    color: colors.text.secondary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
  },
  currentPlanCard: {
    marginTop: 10,
    marginBottom: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    padding: 16,
    alignItems: 'center',
  },
  currentPlanLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: 1.4,
  },
  currentPlanTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    letterSpacing: 0.6,
    marginTop: 12,
    marginBottom: 4,
  },
  currentPlanMeta: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: colors.border.strong,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#F87171',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  cardWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  cardBase: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: colors.surface.base,
  },
  cardPremium: {
    borderColor: 'rgba(252, 211, 77, 0.35)',
  },
  cardCurrent: {
    borderColor: 'rgba(34, 197, 94, 0.35)',
  },
  cardContent: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
  },
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    zIndex: 10,
    elevation: 5,
  },
  badgeText: {
    color: '#0B0B0B',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.4,
  },
  currentBadgeContainer: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    zIndex: 10,
    elevation: 5,
  },
  currentBadgeText: {
    color: '#86EFAC',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    letterSpacing: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 6,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
  },
  cardSubtitle: {
    color: colors.text.secondary,

    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    marginTop: 4,
  },
  priceBlock: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  cardPrice: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
  },
  cardInterval: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },
  cardDescription: {
    color: colors.text.secondary,
    fontSize: typography.size.xl,
    lineHeight: 22,
    marginTop: 8,
  },
  currentPlanNote: {
    color: colors.text.secondary,
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    color: colors.text.muted,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  metaValue: {
    color: colors.text.primary,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    marginTop: 2,
  },
  metaValuePremium: {
    color: '#FDE68A',
  },
  metaValueCurrent: {
    color: '#86EFAC',
  },
  textPremium: {
    color: '#FDE68A',
  },
  textCurrent: {
    color: '#86EFAC',
  },
  ctaButton: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 14,
    minHeight: 48,
    alignItems: 'center',
    borderWidth: 1,
  },
  ctaButtonRegular: {
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'transparent',
  },
  ctaButtonPremium: {
    borderColor: ACCENT_COLOR,
    backgroundColor: 'rgba(252, 211, 77, 0.12)',
  },
  ctaButtonCurrent: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  ctaText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.8,
  },
  ctaTextRegular: {
    color: '#FFFFFF',
  },
  ctaTextPremium: {
    color: ACCENT_COLOR,
  },
  ctaTextCurrent: {
    color: colors.text.secondary,
  },
  skeletonContainer: {
    width: '100%',
  },
  skeletonBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
});
