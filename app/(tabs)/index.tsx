import { EventCard } from '@/components/events';
import {
  CreditSummaryCard,
  HomeHero,
  HomeTopBackground,
} from '@/components/home';
import type { Event } from '@/DATA_TYPES/event';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useCreditsBalance, useCreditsLedger } from '@/src/features/billing/hooks/use-credits';
import { useSubscriptions } from '@/src/features/billing/hooks/use-subscriptions';
import { resolveLedgerSummary } from '@/src/features/billing/utils/credits';
import { useEvents, usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { resolveUserStudioId } from '@/src/features/users/utils/resolve-user-studio-id';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';
import { parseEventDateTime } from '@/src/features/events/utils/event-datetime';

const EMPTY_EXPIRY_TOKENS = new Set(['-', '—', 'n/a', 'na', 'none', 'null']);
const USER_STATUSES = new Set(['active', 'inactive', 'blocked']);
const PLAN_TYPE_KEYS = ['planType', 'plan_type', 'plan', 'planName', 'plan_name'];
const UNLIMITED_PLAN_TOKENS = ['unlimited', 'no limit', 'nolimit', 'infinite', 'infinity', '∞', 'безліміт', 'безлимит'];

function formatExpiry(value?: string | number | null) {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value) || value <= 0) return null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const normalized = trimmed.toLowerCase();
    if (!normalized || EMPTY_EXPIRY_TOKENS.has(normalized)) return null;
    if (!/\d/.test(trimmed)) return null;
  }
  const parsed = new Date(
    typeof value === 'number' && value < 1_000_000_000_000 ? value * 1000 : value
  );
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value : null;
  }
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}.${month}.${year}`;
}

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

const normalizeUserStatus = (value: string | null) => {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;
  return USER_STATUSES.has(normalized) ? normalized : null;
};

const resolveUserStatus = (user: unknown) => {
  if (!user || typeof user !== 'object') return null;
  const record = user as Record<string, unknown>;
  const direct = pickFirstString(record, ['status', 'userStatus', 'user_status']);
  return normalizeUserStatus(direct);
};

const resolveSubscriptionPeriodEnd = (subscription: unknown) => {
  if (!subscription || typeof subscription !== 'object') return null;
  const record = subscription as Record<string, unknown>;
  const direct =
    record.currentPeriodEnd ??
    record.current_period_end ??
    record.currentPeriodEndAt ??
    record.current_period_end_at ??
    null;
  if (direct) return direct as string | number;
  const nested = record.stripeSubscription ?? record.stripe_subscription ?? null;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    return (
      (nestedRecord.currentPeriodEnd ??
        nestedRecord.current_period_end ??
        nestedRecord.currentPeriodEndAt ??
        nestedRecord.current_period_end_at ??
        null) as string | number | null
    );
  }
  return null;
};

const normalizePlanType = (value: string | null) => (value ? value.trim().toLowerCase() : null);

const resolveSubscriptionPlanType = (subscription: unknown) => {
  if (!subscription || typeof subscription !== 'object') return null;
  const record = subscription as Record<string, unknown>;
  const direct = pickFirstString(record, PLAN_TYPE_KEYS);
  if (direct) return normalizePlanType(direct);
  const nested = record.stripeSubscription ?? record.stripe_subscription ?? null;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    const nestedValue = pickFirstString(nestedRecord, PLAN_TYPE_KEYS);
    if (nestedValue) return normalizePlanType(nestedValue);
  }
  return null;
};

const isUnlimitedPlanType = (planType: string | null) => {
  if (!planType) return false;
  return UNLIMITED_PLAN_TOKENS.some((token) => planType.includes(token));
};

function NextEventCard({ event, studioTitle }: { event: Event; studioTitle: string }) {
  const router = useRouter();
  const { populatedEvent } = usePopulatedEvent(event);
  const displayEvent = populatedEvent ?? event;

  return (
    <View style={styles.nextEventSection}>
      <Text style={styles.nextEventLabel}>
        NEXT CLASS AT <Text style={styles.nextEventLocation}>{studioTitle}</Text>
      </Text>
      <EventCard
        event={displayEvent}
        onPress={(e) =>
          router.push({
            pathname: '/class-details/[id]',
            params: { id: e._id, event: encodeURIComponent(JSON.stringify(e)) },
          })
        }
      />
    </View>
  );
}

export default function HomeScreen() {
  const { data: user, isLoading, refetch: refetchUser } = useAuth();
  const userStudioRef = user?.studio ?? null;
  const studioId = useMemo(() => resolveUserStudioId(user), [user]);
  const creditsEnabled = Boolean(user);
  const { data: creditsBalance, refetch: refetchCreditsBalance } = useCreditsBalance({
    enabled: creditsEnabled,
    studioId,
  });
  const { data: creditsLedger, refetch: refetchCreditsLedger } = useCreditsLedger({
    enabled: creditsEnabled,
    studioId,
  });
  const { data: subscriptionsData, refetch: refetchSubscriptions } = useSubscriptions({
    enabled: creditsEnabled,
    staleTime: 0,
  });
  const subscriptions = useMemo(() => {
    if (Array.isArray(subscriptionsData)) return subscriptionsData;
    if (subscriptionsData && typeof subscriptionsData === 'object') {
      return [subscriptionsData as unknown as Record<string, unknown>];
    }
    return [];
  }, [subscriptionsData]);
  const [refreshing, setRefreshing] = useState(false);
  const { data: allEvents = [] } = useEvents();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const tasks: Promise<unknown>[] = [refetchUser()];
      if (creditsEnabled) {
        tasks.push(refetchCreditsBalance(), refetchCreditsLedger(), refetchSubscriptions());
      }
      await Promise.allSettled(tasks);
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser, refetchCreditsBalance, refetchCreditsLedger, refetchSubscriptions, creditsEnabled]);

  useFocusEffect(
    useCallback(() => {
      refetchUser();
      if (creditsEnabled) {
        refetchCreditsBalance();
        refetchCreditsLedger();
        refetchSubscriptions();
      }
    }, [refetchUser, refetchCreditsBalance, refetchCreditsLedger, refetchSubscriptions, creditsEnabled])
  );

  // Refresh data when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refetchUser();
        if (creditsEnabled) {
          refetchCreditsBalance();
          refetchCreditsLedger();
          refetchSubscriptions();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refetchUser, refetchCreditsBalance, refetchCreditsLedger, refetchSubscriptions, creditsEnabled]);

  useEffect(() => {
    if (creditsEnabled) {
      refetchSubscriptions();
    }
  }, [creditsEnabled, refetchSubscriptions]);

  const welcomeText = user?.firstName
    ? `WELCOME BACK, ${user.firstName.toUpperCase()}`
    : 'WELCOME BACK';

  const populatedStudioTitle =
    userStudioRef && typeof userStudioRef === 'object' ? userStudioRef.title : undefined;
  const { data: fetchedStudio } = useStudio(populatedStudioTitle ? null : studioId);
  const studioTitle = populatedStudioTitle ?? fetchedStudio?.title ?? (isLoading ? '…' : '—');

  // Find next upcoming event for user's studio
  const nextEvent = useMemo(() => {
    if (!allEvents.length || !studioId) return null;
    
    const now = new Date();
    const upcomingEvents = allEvents
      .filter((event: Event) => {
        // Filter by user's studio
        if (event.studio !== studioId) return false;
        
        // Filter only active events
        if (event.status !== 'active') return false;
        
        // Filter only future events
        if (!event.start_time) return false;
        const eventDate = parseEventDateTime(event.start_time);
        return eventDate ? eventDate > now : false;
      })
      .sort((a: Event, b: Event) => {
        const dateA = parseEventDateTime(a.start_time);
        const dateB = parseEventDateTime(b.start_time);
        if (dateA && dateB) return dateA.getTime() - dateB.getTime();
        return (a.start_time ?? '').localeCompare(b.start_time ?? '');
      });
    
    return upcomingEvents[0] || null;
  }, [allEvents, studioId]);

  const activeSubscription = useMemo(() => {
    if (!subscriptions.length) return null;
    if (studioId) {
      const match = subscriptions.find((item) => {
        const itemStudioId =
          (item as any)?.studioId ??
          (item as any)?.studio_id ??
          (typeof (item as any)?.studio === 'string' ? (item as any)?.studio : (item as any)?.studio?._id);
        return itemStudioId && String(itemStudioId) === String(studioId);
      });
      if (match) return match;
    }
    return subscriptions[0] ?? null;
  }, [subscriptions, studioId]);

  const subscriptionSource = activeSubscription ?? user?.subscription ?? null;
  const subscriptionPeriodEnd = useMemo(
    () => resolveSubscriptionPeriodEnd(subscriptionSource),
    [subscriptionSource]
  );
  const subscriptionPlanType = useMemo(
    () => resolveSubscriptionPlanType(subscriptionSource),
    [subscriptionSource]
  );
  const ledgerSummary = useMemo(() => {
    const ledger = creditsLedger ?? (user as any)?.creditLedger ?? null;
    return resolveLedgerSummary(ledger);
  }, [creditsLedger, user]);
  const hasUnlimitedPlan = useMemo(
    () => isUnlimitedPlanType(subscriptionPlanType) || ledgerSummary.isUnlimited,
    [subscriptionPlanType, ledgerSummary.isUnlimited]
  );
  const userStatus = useMemo(() => resolveUserStatus(user), [user]);

  const rawAvailable = creditsBalance?.available ?? null;
  const shouldUseLedgerBalance =
    rawAvailable == null ||
    (rawAvailable === 0 && ledgerSummary.balance != null && ledgerSummary.balance > 0);
  const creditsRemaining = hasUnlimitedPlan
    ? Number.POSITIVE_INFINITY
    : shouldUseLedgerBalance
      ? ledgerSummary.balance
      : rawAvailable;
  const creditsTotal = hasUnlimitedPlan ? null : creditsBalance?.total ?? null;
  const creditsExpires =
    formatExpiry(creditsBalance?.expiresAt ?? ledgerSummary.expiresAt) ??
    formatExpiry(subscriptionPeriodEnd);
  const creditsStatus = userStatus || '—';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeTopBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              titleColor="#FFFFFF"
              colors={['#FFFFFF']}
              progressBackgroundColor="transparent"
            />
          }
        >
            <HomeHero
              isLoading={isLoading}
              title={welcomeText}
              subtitle={
                <>
                  STUDIO <Text style={styles.heroLocation}>{studioTitle.toUpperCase()}</Text>
                </>
              }
            />

      <CreditSummaryCard
        remaining={creditsRemaining}
        total={creditsTotal}
        expires={creditsExpires}
        status={creditsStatus}
      />

          {nextEvent && <NextEventCard event={nextEvent} studioTitle={studioTitle.toUpperCase()} />}
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
  scrollContent: {
    paddingBottom: 140,
  },
  heroLocation: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  nextEventSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  nextEventLabel: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.5,
    marginLeft: 4,
    marginBottom: 10,
  },
  nextEventLocation: {
    color: '#FFFFFF',
    fontWeight: typography.weight.heavy,
  },
});
