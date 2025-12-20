import { EventCard } from '@/components/events';
import {
  CreditSummaryCard,
  HomeHero,
  HomeImageCard,
  HomeTopBackground,
  PowerPanel,
  SnapCarouselSection,
} from '@/components/home';
import type { Event } from '@/DATA_TYPES/event';
import { useAuth } from '@/src/features/auth/hooks/use-auth';
import { useEvents, usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CREDIT_SUMMARY = {
  remaining: 15,
  total: 20,
  expires: '30.08.2020',
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
  const { width: screenWidth } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const { data: allEvents = [] } = useEvents();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchUser();
    } finally {
      setRefreshing(false);
    }
  }, [refetchUser]);

  // Refresh data when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refetchUser();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refetchUser]);

  const welcomeText = user?.firstName
    ? `WELCOME BACK, ${user.firstName.toUpperCase()}`
    : 'WELCOME BACK';

  const userStudioRef = user?.studio ?? null;
  const studioId =
    typeof userStudioRef === 'string'
      ? userStudioRef
      : userStudioRef && typeof userStudioRef === 'object'
        ? userStudioRef._id
        : null;

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
        const eventDate = new Date(event.start_time);
        return eventDate > now;
      })
      .sort((a: Event, b: Event) => {
        const dateA = new Date(a.start_time!);
        const dateB = new Date(b.start_time!);
        return dateA.getTime() - dateB.getTime();
      });
    
    return upcomingEvents[0] || null;
  }, [allEvents, studioId]);

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
                  STUDIO <Text style={styles.heroLocation}>{studioTitle.toUpperCase()}</Text> • 06:30 — 21:00
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

          {nextEvent && <NextEventCard event={nextEvent} studioTitle={studioTitle.toUpperCase()} />}

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
  nextEventSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  nextEventLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginLeft: 4,
    marginBottom: 10,
  },
  nextEventLocation: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
