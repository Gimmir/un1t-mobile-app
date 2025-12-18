import {
  CreditSummaryCard,
  HomeHero,
  HomeImageCard,
  HomeTopBackground,
  NextClassPanel,
  PowerPanel,
  SnapCarouselSection,
} from '@/components/home';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CREDIT_SUMMARY = {
  remaining: 15,
  total: 20,
  expires: '30.08.2020',
};

const UPCOMING_CLASS = {
  program: 'TROOPER',
  date: 'SEP 30',
  time: '9.00 AM',
  location: 'LONDON BRIDGE',
};

const CHALLENGES = [
  {
    id: '1',
    title: '500 M ROW',
    subtitle: 'TIER 3 • PB 2:42',
    badge: 'CHALLENGE OF THE MONTH',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '100 BURPEES',
    subtitle: 'TIER 1 • PB 8:15',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop',
  },
];

const PERFORMANCE = [
  {
    id: '1',
    title: 'DEADLIFT',
    value: '150 KG',
    date: 'SEP 11, 11.00 AM',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'BENCH PRESS',
    value: '110 KG',
    date: 'SEP 14, 10.00 AM',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
  },
];

const SLIDE_OUTER_MARGIN = 20;
const SLIDE_PREVIEW = 40;
const SLIDE_SPACING = 12;

export default function HomeScreen() {
  const { data: user, isLoading } = useAuth();
  const { width: screenWidth } = useWindowDimensions();

  const welcomeText = user?.firstName
    ? `WELCOME BACK, ${user.firstName.toUpperCase()}`
    : 'WELCOME BACK';

  const carouselLayout = useMemo(() => {
    const itemWidth = Math.max(240, screenWidth - SLIDE_OUTER_MARGIN * 2 - SLIDE_PREVIEW);
    const snapInterval = itemWidth + SLIDE_SPACING;
    return { itemWidth, snapInterval };
  }, [screenWidth]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <HomeTopBackground />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HomeHero
            isLoading={isLoading}
            title={welcomeText}
            subtitle={
              <>
                UN1T <Text style={styles.heroLocation}>LONDON BRIDGE</Text> • 06:30 — 21:00
              </>
            }
          />

          <CreditSummaryCard
            remaining={CREDIT_SUMMARY.remaining}
            total={CREDIT_SUMMARY.total}
            expires={CREDIT_SUMMARY.expires}
            status="ACTIVE"
          />

          <PowerPanel />

          <NextClassPanel
            program={UPCOMING_CLASS.program}
            date={UPCOMING_CLASS.date}
            time={UPCOMING_CLASS.time}
            location={UPCOMING_CLASS.location}
          />

          <SnapCarouselSection
            title="CHALLENGES"
            count={CHALLENGES.length}
            itemWidth={carouselLayout.itemWidth}
            outerMargin={SLIDE_OUTER_MARGIN}
            itemSpacing={SLIDE_SPACING}
            snapInterval={carouselLayout.snapInterval}
          >
            {(itemWidth) =>
              CHALLENGES.map((challenge) => (
                <HomeImageCard
                  key={challenge.id}
                  width={itemWidth}
                  imageUri={challenge.image}
                  title={challenge.title}
                  metaText={challenge.subtitle}
                  metaIcon="star"
                  metaIconLibrary="Ionicons"
                  badgeText={challenge.badge}
                />
              ))
            }
          </SnapCarouselSection>

          <SnapCarouselSection
            title="PERFORMANCE"
            count={PERFORMANCE.length}
            itemWidth={carouselLayout.itemWidth}
            outerMargin={SLIDE_OUTER_MARGIN}
            itemSpacing={SLIDE_SPACING}
            snapInterval={carouselLayout.snapInterval}
          >
            {(itemWidth) =>
              PERFORMANCE.map((item) => (
                <HomeImageCard
                  key={item.id}
                  width={itemWidth}
                  imageUri={item.image}
                  title={item.title}
                  metaText={item.date}
                  metaIcon="time"
                  metaIconLibrary="Ionicons"
                  secondaryText={item.value}
                />
              ))
            }
          </SnapCarouselSection>
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
  scrollContent: {
    paddingBottom: 140,
  },
  heroLocation: {
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
});
