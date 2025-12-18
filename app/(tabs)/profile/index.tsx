import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  { key: 'preferences', label: 'Preferences', icon: 'notifications-outline' },
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

export default function ProfileScreen() {
  const [touchIdEnabled, setTouchIdEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const { data: user } = useAuth();
  const router = useRouter();

  const fullName = useMemo(() => {
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
    return name ? name.toUpperCase() : 'JO BOTTELL';
  }, [user?.firstName, user?.lastName]);
  const studioLocation =
    ((user as any)?.studio?.name || (user as any)?.studioName || 'LONDON BRIDGE').toUpperCase();

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
  };

  const renderRow = (item: ProfileSettingItem, isLast = false) => {
    if (item.type === 'switch') {
      return (
        <View key={item.key} style={[styles.row, isLast && styles.rowLast]}>
          <View style={styles.rowLeft}>
            <Ionicons name={item.icon as any} size={18} color="#E4E4E7" style={{ width: 22 }} />
            <Text style={styles.rowLabel}>{item.label}</Text>
          </View>

          <Switch
            value={Boolean(item.value)}
            onValueChange={item.toggle}
            trackColor={{ true: '#FFFFFF', false: '#3F3F46' }}
            thumbColor="#191919"
          />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={item.key}
        activeOpacity={0.7}
        accessibilityRole="button"
        onPress={() => handleRowPress(item.key)}
        style={[styles.row, isLast && styles.rowLast]}
      >
        <View style={styles.rowLeft}>
          <Ionicons name={item.icon as any} size={18} color="#E4E4E7" style={{ width: 22 }} />
          <Text style={styles.rowLabel}>{item.label}</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#71717A" />
      </TouchableOpacity>
    );
  };

  const renderSimpleRow = (item: (typeof socialLinks)[number], isLast = false) => (
    <View key={item.key} style={[styles.row, isLast && styles.rowLast]}>
      <View style={styles.rowLeft}>
        <Ionicons name={item.icon as any} size={18} color="#E4E4E7" style={{ width: 22 }} />
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#71717A" />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.textureWrapper}>
        <Image
          source={require('@/assets/images/home-top-texture.png')}
          style={styles.textureImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', '#191919']}
          style={styles.textureOverlay}
        />
      </View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>{fullName}</Text>
            <Text style={styles.heroSubtitle}>
              STUDIO <Text style={styles.heroSubtitleAccent}>{studioLocation}</Text>
            </Text>
          </View>

          <View style={styles.membershipCard}>
            <Text style={styles.cardTitle}>MEMBERSHIP AND PASSES</Text>
            <Text style={styles.bundleLabel}>20 CLASS BUNDLE</Text>
            <View style={styles.cardStats}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>CREDITS REMAINING</Text>
                <Text style={styles.statValue}>15</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>EXPIRES</Text>
                <Text style={styles.statValue}>30.08.2020</Text>
              </View>
            </View>

            <View style={styles.cardDivider} />

            <TouchableOpacity activeOpacity={0.8} style={styles.ctaButton}>
              <Text style={styles.ctaText}>BUY MEMBERSHIP</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {sections.map((item, index) => renderRow(item, index === sections.length - 1))}
          </View>

          <View style={styles.card}>
            {socialLinks.map((item, index) => renderSimpleRow(item, index === socialLinks.length - 1))}
          </View>

          <View style={styles.card}>
            <TouchableOpacity activeOpacity={0.7} style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons name="log-out-outline" size={18} color="#FACC15" style={{ width: 22 }} />
                <Text style={[styles.rowLabel, { color: '#FACC15' }]}>Log out</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={[styles.row, styles.rowLast]}>
              <View style={styles.rowLeft}>
                <Ionicons name="trash-outline" size={18} color="#F87171" style={{ width: 22 }} />
                <Text style={[styles.rowLabel, { color: '#F87171' }]}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
            </TouchableOpacity>
          </View>

          <View style={styles.versionBlock}>
            <Text style={styles.versionText}>Version 1.0</Text>
            <Text style={styles.versionText}>Un1t LTD UK</Text>
          </View>
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
  textureWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  textureImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  textureOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
  },
  safeArea: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#D4D4D8',
    marginTop: 6,
  },
  heroSubtitleAccent: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 3,
  },
  membershipCard: {
    backgroundColor: '#101012',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginHorizontal: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardTitle: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 8,
  },
  bundleLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#27272A',
    marginBottom: 18,
  },
  ctaButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#111113',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1C1C1F',
    marginHorizontal: 16,
    marginBottom: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1F1F23',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    color: '#E4E4E7',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  versionBlock: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    color: '#6B7280',
    fontSize: 11,
    letterSpacing: 1,
  },
});
