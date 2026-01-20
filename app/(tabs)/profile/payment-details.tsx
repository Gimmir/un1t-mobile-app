import { ProfileCard } from '@/components/profile/profile/ProfileCard';
import { ProfileTopBackground } from '@/components/profile/profile/ProfileTopBackground';
import { SettingsHeader } from '@/components/profile/settings/SettingsHeader';
import { TAB_HEIGHT } from '@/components/tabs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import React from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme/colors';
import { typography } from '@/src/theme/typography';

const ACCENT_COLOR = '#FCD34D';

const resolvePortalUrl = (value: string | string[] | undefined) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : '';
  }
  if (Array.isArray(value) && value.length > 0) {
    const trimmed = String(value[0]).trim();
    return trimmed.length ? trimmed : '';
  }
  return '';
};

export default function PaymentDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ url?: string }>();
  const envPortalUrl = resolvePortalUrl(process.env.EXPO_PUBLIC_STRIPE_PORTAL_URL);
  const portalUrl = resolvePortalUrl(params?.url) || envPortalUrl;
  const isConfigured = Boolean(portalUrl);
  const scrollBottomPadding = Math.max(insets.bottom, 16) + TAB_HEIGHT + 24;

  const handleOpenPortal = async () => {
    if (!isConfigured) {
      Alert.alert('Unavailable', 'Payment portal is not configured yet.');
      return;
    }
    if (Platform.OS === 'web') {
      await Linking.openURL(portalUrl);
      return;
    }
    await openBrowserAsync(portalUrl, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ProfileTopBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader title="PAYMENT DETAILS" onBack={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        >
          <ProfileCard style={styles.card}>
            <Text style={styles.title}>MANAGE BILLING</Text>
            <Text style={styles.subtitle}>
              We will open Stripe's secure portal to update your payment method and view invoices.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenPortal}
              disabled={!isConfigured}
              style={[styles.button, !isConfigured && styles.buttonDisabled]}
            >
              <Text style={[styles.buttonText, !isConfigured && styles.buttonTextDisabled]}>
                {isConfigured ? 'OPEN STRIPE PORTAL' : 'PORTAL NOT CONFIGURED'}
              </Text>
            </TouchableOpacity>

            {!isConfigured ? (
              <Text style={styles.note}>Set `EXPO_PUBLIC_STRIPE_PORTAL_URL` to enable this screen.</Text>
            ) : null}
          </ProfileCard>
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
  },
  card: {
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: typography.size.lg,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1.2,
  },
  subtitle: {
    marginTop: 10,
    color: colors.text.secondary,
    fontSize: typography.size.md,
    lineHeight: 22,
  },
  button: {
    marginTop: 20,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surface.panel,
  },
  buttonText: {
    color: '#0B0B0B',
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: colors.text.muted,
  },
  note: {
    marginTop: 12,
    color: colors.text.muted,
    fontSize: typography.size.sm,
    lineHeight: 18,
  },
});
