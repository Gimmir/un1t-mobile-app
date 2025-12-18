import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/features/auth/hooks/use-auth';

const QUICK_STATS = [
  { label: 'CREDITS', value: '12', sublabel: 'remaining' },
  { label: 'STREAK', value: '07', sublabel: 'days' },
  { label: 'OUTPUT', value: '85%', sublabel: 'season avg' },
];

const HIGHLIGHTS = [
  {
    id: '1',
    title: 'New benchmark unlocked',
    subtitle: 'Row 500m under 1:40 and earn extra credits.',
  },
  {
    id: '2',
    title: 'Coach spotlight',
    subtitle: 'Sara leads the new TROOPER block this Friday.',
  },
];

const UPCOMING_CLASS = {
  program: 'TROOPER',
  date: 'SEP 30',
  time: '09:00 AM',
  location: 'LONDON BRIDGE',
};

export default function HomeScreen() {
  const { data: user, isLoading } = useAuth();

  const greeting = user?.firstName
    ? `Ready to move, ${user.firstName.toUpperCase()}`
    : 'Ready to move';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.textureWrapper}>
        <Image
          source={require('@/assets/images/home-top-texture.png')}
          style={styles.textureImage}
          resizeMode="cover"
        />
        <LinearGradient colors={['rgba(0,0,0,0)', '#191919']} style={styles.gradientOverlay} />
      </View>

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>UNIT HQ</Text>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.heroTitle}>{greeting}</Text>
            )}
            <Text style={styles.heroSubtitle}>
              Dial in your energy and follow your customized weekly block.
            </Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.heroButton}>
              <Text style={styles.heroButtonText}>VIEW TRAINING PLAN</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {QUICK_STATS.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statSublabel}>{stat.sublabel}</Text>
              </View>
            ))}
          </View>

          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=1760&auto=format&fit=crop',
            }}
            style={styles.nextClassCard}
            imageStyle={{ borderRadius: 14 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.nextClassContent}>
              <Text style={styles.nextClassEyebrow}>NEXT SESSION</Text>
              <Text style={styles.nextClassTitle}>{UPCOMING_CLASS.program}</Text>
              <View style={styles.nextClassMeta}>
                <Text style={styles.metaChip}>{UPCOMING_CLASS.date}</Text>
                <Text style={styles.metaChip}>{UPCOMING_CLASS.time}</Text>
                <Text style={styles.metaChip}>{UPCOMING_CLASS.location}</Text>
              </View>
              <TouchableOpacity activeOpacity={0.85} style={styles.nextClassButton}>
                <Text style={styles.nextClassButtonText}>CHECK IN</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <View style={styles.dualCardRow}>
            <View style={styles.dualCard}>
              <Text style={styles.dualCardEyebrow}>TODAY&apos;S PULSE</Text>
              <Text style={styles.dualValue}>76%</Text>
              <Text style={styles.dualSubtitle}>Effort vs. last week</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '76%' }]} />
              </View>
            </View>
            <View style={styles.dualCard}>
              <Text style={styles.dualCardEyebrow}>HEART RATE</Text>
              <Text style={styles.dualValue}>142</Text>
              <Text style={styles.dualSubtitle}>Avg BPM previous class</Text>
              <View style={styles.progressMetrics}>
                <View>
                  <Text style={styles.metricLabel}>Peak</Text>
                  <Text style={styles.metricValue}>168</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Recovery</Text>
                  <Text style={styles.metricValue}>92</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.highlightCard}>
            <Text style={styles.highlightTitle}>Studio Feed</Text>
            {HIGHLIGHTS.map((item) => (
              <View key={item.id} style={styles.highlightRow}>
                <View style={styles.highlightDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.highlightRowTitle}>{item.title}</Text>
                  <Text style={styles.highlightRowSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
            ))}
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
    height: 420,
  },
  textureImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 260,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  heroEyebrow: {
    color: '#A1A1AA',
    fontSize: 12,
    letterSpacing: 3,
  },
  heroTitle: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroSubtitle: {
    color: '#D4D4D8',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 20,
  },
  heroButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#101012',
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F1F23',
    padding: 14,
  },
  statLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
  },
  statSublabel: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  nextClassCard: {
    marginHorizontal: 16,
    borderRadius: 14,
    overflow: 'hidden',
    height: 220,
    marginBottom: 24,
  },
  nextClassContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  nextClassEyebrow: {
    color: '#D4D4D8',
    letterSpacing: 2,
    fontSize: 11,
  },
  nextClassTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
    letterSpacing: 3,
  },
  nextClassMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 1,
  },
  nextClassButton: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  nextClassButtonText: {
    color: '#000000',
    fontWeight: '800',
    letterSpacing: 2,
  },
  dualCardRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  dualCard: {
    flex: 1,
    backgroundColor: '#101012',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1F1F23',
    padding: 16,
  },
  dualCardEyebrow: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 1.5,
  },
  dualValue: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
  },
  dualSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#27272A',
    borderRadius: 999,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  progressMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  metricLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    letterSpacing: 1,
  },
  metricValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  highlightCard: {
    backgroundColor: '#101012',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    marginHorizontal: 16,
    padding: 18,
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
    letterSpacing: 1,
  },
  highlightRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  highlightRowTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  highlightRowSubtitle: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
});
