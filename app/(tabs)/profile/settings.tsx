import { SettingsHeader } from '@/components/profile/settings/SettingsHeader';
import { SettingsCard } from '@/components/profile/settings/SettingsCard';
import { SettingsDivider } from '@/components/profile/settings/SettingsDivider';
import { SettingsRow } from '@/components/profile/settings/SettingsRow';
import { SelectionModal } from '@/components/profile/settings/SelectionModal';
import { LANGUAGES } from '@/src/constants/auth-data';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useUpdateProfile } from '@/src/features/profile/hooks/use-update-profile';
import { StorageKeys, storageUtils } from '@/src/lib/storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Units = 'metric' | 'imperial';

const UNITS_OPTIONS: { key: Units; label: string }[] = [
  { key: 'metric', label: 'Metric (kg)' },
  { key: 'imperial', label: 'Imperial (lb)' },
];

function normalizeLanguageId(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed === 'uk') return 'ua';
  return trimmed;
}

function formatLanguageLabel(langId: string) {
  const match = LANGUAGES.find((l) => l.id === langId);
  if (!match) return '—';
  if (match.id === 'en-GB') return 'English, UK';
  return match.name;
}

function formatUnitsLabel(units: Units) {
  return UNITS_OPTIONS.find((o) => o.key === units)?.label ?? '—';
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuth();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();

  const userId = user?._id ?? '';
  const currentLanguageId = normalizeLanguageId((user as any)?.language);

  const [units, setUnits] = useState<Units>('metric');
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showUnitsPicker, setShowUnitsPicker] = useState(false);

  useEffect(() => {
    let mounted = true;
    storageUtils.getString(StorageKeys.SETTINGS_UNITS).then((value) => {
      if (!mounted) return;
      if (value === 'imperial' || value === 'metric') {
        setUnits(value);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const languageOptions = useMemo(
    () => LANGUAGES.map((l) => ({ key: l.id, label: l.id === 'en-GB' ? 'English, UK' : l.name })),
    []
  );

  const unitsOptions = useMemo(
    () => UNITS_OPTIONS.map((u) => ({ key: u.key, label: u.label })),
    []
  );

  const scrollBottomPadding = Math.max(insets.bottom, 16) + 40;

  const handleLanguageSelect = (language: string) => {
    if (!userId) {
      Alert.alert('Unavailable', 'User data is not ready yet. Please try again shortly.');
      return;
    }

    if (language === currentLanguageId) {
      setShowLanguagePicker(false);
      return;
    }

    updateProfile(
      { userId, data: { language } as any },
      {
        onSuccess: () => {
          setShowLanguagePicker(false);
        },
        onError: (err) => {
          Alert.alert('Error', err.message || 'Unable to update language');
        },
      }
    );
  };

  const handleUnitsSelect = async (nextUnits: string) => {
    if (nextUnits !== 'metric' && nextUnits !== 'imperial') return;
    setUnits(nextUnits);
    setShowUnitsPicker(false);
    await storageUtils.setString(StorageKeys.SETTINGS_UNITS, nextUnits);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <SettingsHeader title="SETTINGS" onBack={() => router.back()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollBottomPadding }]}
        >
          <SettingsCard>
            <SettingsRow
              label="Language"
              value={formatLanguageLabel(currentLanguageId)}
              onPress={() => setShowLanguagePicker(true)}
            />
            <SettingsDivider />
            <SettingsRow
              label="Units"
              value={formatUnitsLabel(units)}
              onPress={() => setShowUnitsPicker(true)}
              isLast
            />
          </SettingsCard>
        </ScrollView>
      </SafeAreaView>

      <SelectionModal
        visible={showLanguagePicker}
        title="LANGUAGE"
        selectedKey={currentLanguageId}
        options={languageOptions}
        onSelect={handleLanguageSelect}
        onClose={() => setShowLanguagePicker(false)}
      />

      <SelectionModal
        visible={showUnitsPicker}
        title="UNITS"
        selectedKey={units}
        options={unitsOptions}
        onSelect={handleUnitsSelect}
        onClose={() => setShowUnitsPicker(false)}
      />

      {isSaving ? <View style={styles.savingBlock} pointerEvents="none" /> : null}
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
  savingBlock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});
