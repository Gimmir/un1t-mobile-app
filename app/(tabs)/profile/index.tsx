import { MembershipCard } from '@/components/profile/profile/MembershipCard';
import { ProfileCard } from '@/components/profile/profile/ProfileCard';
import { ProfileHero } from '@/components/profile/profile/ProfileHero';
import { ProfileRow } from '@/components/profile/profile/ProfileRow';
import { ProfileTopBackground } from '@/components/profile/profile/ProfileTopBackground';
import { ProfileVersionBlock } from '@/components/profile/profile/ProfileVersionBlock';
import { TAB_HEIGHT } from '@/components/tabs';
import { useAuth, useLogout } from '@/src/features/auth/hooks/use-auth';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

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
  { key: 'notifications', label: 'Notifications', icon: 'notifications-outline' },
  { key: 'settings', label: 'Settings', icon: 'settings-outline' },
  { key: 'password', label: 'Change Password', icon: 'shield-checkmark-outline' },
  { key: 'touch', label: 'Sign in with Touch ID', icon: 'finger-print-outline', type: 'switch' },
  { key: 'face', label: 'Sign in with Face ID', icon: 'scan-outline', type: 'switch' },
];

const socialLinks = [
  { key: 'rate', label: 'Rate us on the App Store', icon: 'star-outline' },
  { key: 'facebook', label: 'Like us on Facebook', icon: 'logo-facebook' },
  { key: 'instagram', label: 'Follow us on Instagram', icon: 'logo-instagram' },
  { key: 'privacy', label: 'Privacy policy', icon: 'document-text-outline' },
  { key: 'terms', label: 'Terms & conditions', icon: 'information-circle-outline' },
];

const MEMBERSHIP_CREDITS_REMAINING = 15;
const MEMBERSHIP_CREDITS_TOTAL = 20;
const MEMBERSHIP_EXPIRES = '30.08.2020';

export default function ProfileScreen() {
  const [touchIdEnabled, setTouchIdEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const { data: user, isLoading: isLoadingUser } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollBottomPadding = Math.max(insets.bottom, 16) + TAB_HEIGHT + 24;

  const fullName = useMemo(() => {
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return name ? name.toUpperCase() : 'JO BOTTELL';
  }, [user?.firstName, user?.lastName]);

  const userStudioRef = (user as any)?.studio ?? null;
  const studioId =
    typeof userStudioRef === 'string'
      ? userStudioRef
      : userStudioRef && typeof userStudioRef === 'object'
        ? (userStudioRef._id ?? userStudioRef.id ?? null)
        : null;

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

  const sections = useMemo<ProfileSettingItem[]>(
    () =>
      accountSettings.map((item) => {
        if (item.key === 'touch') {
          return { ...item, value: touchIdEnabled, toggle: () => setTouchIdEnabled((prev) => !prev) };
        }
        if (item.key === 'face') {
          return { ...item, value: faceIdEnabled, toggle: () => setFaceIdEnabled((prev) => !prev) };
        }
        return item;
      }),
    [touchIdEnabled, faceIdEnabled]
  );

  const handleRowPress = (key: string) => {
    if (key === 'account') {
      router.push('/profile/account-details');
    }
    if (key === 'notifications') {
      router.push('/profile/notifications');
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
    Alert.alert('Delete account', 'This feature is not available yet.');
  };

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
            remaining={MEMBERSHIP_CREDITS_REMAINING}
            total={MEMBERSHIP_CREDITS_TOTAL}
            expires={MEMBERSHIP_EXPIRES}
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
              label="Delete Account"
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
    backgroundColor: '#191919',
  },
  safeArea: {
    flex: 1,
  },
});
