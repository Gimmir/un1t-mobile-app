import { MembershipCard } from '@/components/profile/profile/MembershipCard';
import { ProfileCard } from '@/components/profile/profile/ProfileCard';
import { ProfileHero } from '@/components/profile/profile/ProfileHero';
import { ProfileRow } from '@/components/profile/profile/ProfileRow';
import { ProfileTopBackground } from '@/components/profile/profile/ProfileTopBackground';
import { ProfileVersionBlock } from '@/components/profile/profile/ProfileVersionBlock';
import { TAB_HEIGHT } from '@/components/tabs';
import { useAuth, useLogout } from '@/src/features/auth/hooks/use-auth';
import { useCreditsBalance, useCreditsLedger } from '@/src/features/billing/hooks/use-credits';
import { useBillingProductPrices } from '@/src/features/billing/hooks/use-billing-products';
import { useSubscriptions } from '@/src/features/billing/hooks/use-subscriptions';
import { resolveLedgerSummary } from '@/src/features/billing/utils/credits';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { useDeleteUser } from '@/src/features/users/hooks/use-users';
import { resolveUserStudioId } from '@/src/features/users/utils/resolve-user-studio-id';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';

type ProfileSettingItem = {
  key: string;
  label: string;
  icon: string;
  type?: 'switch';
  value?: boolean;
  toggle?: () => void;
};

const accountSettings: ProfileSettingItem[] = [
  { key: 'account', label: 'Account details', icon: 'person-outline' },
  { key: 'payment', label: 'Payment details', icon: 'card-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'password', label: 'Change Password', icon: 'shield-checkmark-outline' },
];

const socialLinks = [
  { key: 'rate', label: 'Rate us on the App Store', icon: 'star-outline' },
  { key: 'facebook', label: 'Like us on Facebook', icon: 'logo-facebook' },
  { key: 'instagram', label: 'Follow us on Instagram', icon: 'logo-instagram' },
  { key: 'privacy', label: 'Privacy policy', icon: 'document-text-outline' },
  { key: 'terms', label: 'Terms & conditions', icon: 'information-circle-outline' },
];

const EMPTY_EXPIRY_TOKENS = new Set(['-', '—', 'n/a', 'na', 'none', 'null']);
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

const inferPlanTypeFromName = (name: string | null | undefined) => {
  if (!name) return null;
  const normalized = name.toLowerCase();
  if (normalized.includes('unlimited')) return 'unlimited';
  const creditsMatch = normalized.match(/(\d+)\s*(x|credits|credit)/);
  if (creditsMatch?.[1]) return creditsMatch[1];
  return null;
};

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

const resolveSubscriptionPlanLabel = (subscription: unknown) => {
  if (!subscription || typeof subscription !== 'object') return null;
  const record = subscription as Record<string, unknown>;
  const direct = pickFirstString(record, PLAN_TYPE_KEYS);
  if (direct) return direct;
  const nested = record.stripeSubscription ?? record.stripe_subscription ?? null;
  if (nested && typeof nested === 'object') {
    const nestedRecord = nested as Record<string, unknown>;
    const nestedValue = pickFirstString(nestedRecord, PLAN_TYPE_KEYS);
    if (nestedValue) return nestedValue;
  }
  return null;
};

const isUnlimitedPlanType = (planType: string | null) => {
  if (!planType) return false;
  return UNLIMITED_PLAN_TOKENS.some((token) => planType.includes(token));
};

export default function ProfileScreen() {
  const { data: user, isLoading: isLoadingUser, refetch: refetchUser } = useAuth();
  const userStudioRef = (user as any)?.studio ?? null;
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
  const { data: prices } = useBillingProductPrices(studioId);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollBottomPadding = Math.max(insets.bottom, 16) + TAB_HEIGHT + 24;
  const userId = user?._id ?? user?.id ?? null;

  const fullName = useMemo(() => {
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return name ? name.toUpperCase() : 'JO BOTTELL';
  }, [user?.firstName, user?.lastName]);

  const populatedStudioTitle =
    userStudioRef && typeof userStudioRef === 'object'
      ? (userStudioRef.title ?? userStudioRef.name)
      : undefined;

  const { data: fetchedStudio } = useStudio(populatedStudioTitle ? null : studioId);
  const studioTitle =
    populatedStudioTitle ??
    fetchedStudio?.title ??
    (fetchedStudio as any)?.name ??
    (isLoadingUser ? '…' : '—');
  const studioLocation = String(studioTitle).toUpperCase();

  const subscriptions = useMemo(() => {
    if (Array.isArray(subscriptionsData)) return subscriptionsData;
    if (subscriptionsData && typeof subscriptionsData === 'object') {
      return [subscriptionsData as unknown as Record<string, unknown>];
    }
    return [];
  }, [subscriptionsData]);

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
  const subscriptionPlanLabel = useMemo(
    () => resolveSubscriptionPlanLabel(subscriptionSource),
    [subscriptionSource]
  );
  const subscriptionPrices = useMemo(() => {
    if (!Array.isArray(prices)) return [];
    return prices.filter((price) => price.recurring?.interval);
  }, [prices]);
  const planDisplayName = useMemo(() => {
    const planType = subscriptionPlanType;
    const resolvePricePlanType = (price: (typeof subscriptionPrices)[number]) => {
      const metadata = price.metadata || price.product?.metadata;
      const rawPlanType =
        (metadata?.planType as string | undefined) ||
        (metadata?.plan_type as string | undefined) ||
        (metadata?.plan as string | undefined) ||
        (metadata?.plan_name as string | undefined);
      return normalizePlanType(rawPlanType ?? null) || inferPlanTypeFromName(price.product?.name) || null;
    };
    const matchedPrice =
      planType
        ? subscriptionPrices.find((price) => resolvePricePlanType(price) === planType)
        : null;
    const fallbackPrice = !matchedPrice && subscriptionPrices.length === 1 ? subscriptionPrices[0] : null;
    const productName = matchedPrice?.product?.name ?? fallbackPrice?.product?.name ?? null;
    if (productName) return productName;
    if (subscriptionPlanLabel) return subscriptionPlanLabel;
    if (planType) return planType.replace(/[_-]/g, ' ').toUpperCase();
    return null;
  }, [subscriptionPlanLabel, subscriptionPlanType, subscriptionPrices]);
  const ledgerSummary = useMemo(() => {
    const ledger = creditsLedger ?? (user as any)?.creditLedger ?? null;
    return resolveLedgerSummary(ledger);
  }, [creditsLedger, user]);
  const hasUnlimitedPlan = useMemo(
    () => isUnlimitedPlanType(subscriptionPlanType) || ledgerSummary.isUnlimited,
    [subscriptionPlanType, ledgerSummary.isUnlimited]
  );

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

  const sections = accountSettings;

  const handleRowPress = (key: string) => {
    if (key === 'account') {
      router.push('/profile/account-details');
    }
    if (key === 'payment') {
      router.push('/profile/payment-details');
    }
    if (key === 'settings') {
      router.push('/profile/settings');
    }
    if (key === 'password') {
      router.push('/profile/change-password');
    }
  };

  const handleLogoutPress = () => {
    if (isLoggingOut) return;
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const handleDeleteAccountPress = () => {
    if (isDeleting || isLoggingOut) return;
    if (!userId) {
      Alert.alert('Unavailable', 'User data is not ready yet. Please try again shortly.');
      return;
    }

    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteUser(
              { userId },
              {
                onSuccess: () => logout(),
                onError: (error) => {
                  const message =
                    (error as any)?.response?.data?.message ||
                    (error as Error)?.message ||
                    'Unable to delete account. Please try again.';
                  Alert.alert('Error', message);
                },
              }
            );
          },
        },
      ]
    );
  };

  const handleBuyMembershipPress = () => {
    router.push('/profile/buy-membership');
  };

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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ProfileTopBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: scrollBottomPadding }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileHero fullName={fullName} studioLocation={studioLocation} />

          <MembershipCard
            remaining={creditsRemaining}
            total={creditsTotal}
            expires={creditsExpires}
            planTitle={planDisplayName}
            onPressCta={handleBuyMembershipPress}
          />

          <ProfileCard>
            {sections.map((item, index) => (
              <ProfileRow
                key={item.key}
                label={item.label}
                icon={item.icon}
                isLast={index === sections.length - 1}
                onPress={item.type === 'switch' ? undefined : () => handleRowPress(item.key)}
                switchValue={item.type === 'switch' ? Boolean(item.value) : undefined}
                onToggle={item.type === 'switch' ? item.toggle : undefined}
              />
            ))}
          </ProfileCard>

          <ProfileCard>
            {socialLinks.map((item, index) => (
              <ProfileRow
                key={item.key}
                label={item.label}
                icon={item.icon}
                isLast={index === socialLinks.length - 1}
              />
            ))}
          </ProfileCard>

          <ProfileCard>
            <ProfileRow
              label={isLoggingOut ? 'Logging out…' : 'Log out'}
              icon="log-out-outline"
              accentColor="#FACC15"
              onPress={handleLogoutPress}
            />
            <ProfileRow
              label={isDeleting ? 'Deleting account…' : 'Delete Account'}
              icon="trash-outline"
              accentColor="#F87171"
              onPress={handleDeleteAccountPress}
              isLast
            />
          </ProfileCard>

          <ProfileVersionBlock version="Version 2.0" company="Un1t LTD UK" />
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
});
