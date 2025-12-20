import { SettingsCard } from '@/components/profile/settings/SettingsCard';
import { SettingsHeader } from '@/components/profile/settings/SettingsHeader';
import { SettingsToggleRow } from '@/components/profile/settings/SettingsRow';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [marketingEmailsEnabled, setMarketingEmailsEnabled] = useState(false);

  useEffect(() => {
    let mounted = true;
    storageUtils.getString(StorageKeys.SETTINGS_MARKETING_EMAILS).then((value) => {
      if (!mounted) return;
      setMarketingEmailsEnabled(value === 'true');
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggle = async (value: boolean) => {
    setMarketingEmailsEnabled(value);
    await storageUtils.setString(StorageKeys.SETTINGS_MARKETING_EMAILS, value ? 'true' : 'false');
  };

  const scrollBottomPadding = Math.max(insets.bottom, 16) + 40;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader title="NOTIFICATIONS" onBack={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        >
          <SettingsCard>
            <SettingsToggleRow
              title="Marketing emails"
              subtitle={`Keep up to date with news and promotions from your studio and UN1T\u00A0HQ`}
              value={marketingEmailsEnabled}
              onValueChange={handleToggle}
            />
          </SettingsCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
});
