import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyScheduleState, type ScheduleTab } from './empty-schedule-state';
import { MyScheduleTabs } from './my-schedule-tabs';
import { styles } from './styles';
import { useBookings } from '@/src/features/bookings/hooks/use-bookings';
import { useEvents } from '@/src/features/events/hooks/use-events';
import type { Event } from '@/DATA_TYPES/event';
import { useCurrentUser } from '@/src/features/users/hooks/use-users';
import { parseISO } from 'date-fns';
import { BookedEventCard } from './booked-event-card';
import { useNavigation } from '@react-navigation/native';

export function MyScheduleScreen() {
  const router = useRouter();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<ScheduleTab>('upcoming');
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = typeof params.returnTo === 'string' ? params.returnTo : null;
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch: refetchBookings,
  } = useBookings();
  const {
    data: events = [],
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = useEvents();
  const { data: currentUser, isLoading: currentUserLoading } = useCurrentUser();

  const eventsById = useMemo(() => {
    const map = new Map<string, Event>();
    for (const event of events) {
      if (event?._id) map.set(event._id, event);
    }
    return map;
  }, [events]);

  const { upcomingEvents, historyEvents } = useMemo(() => {
    const currentUserId = currentUser?._id ?? null;
    if (!currentUserId) {
      return { upcomingEvents: [], historyEvents: [] };
    }

    const now = new Date();
    const upcoming: Event[] = [];
    const history: Event[] = [];

    const byEventId = new Map<string, { event: Event; bookingUpdatedAt: string; bookingStatus: string }>();

    for (const booking of bookings as any[]) {
      const creatorRef = booking?.creator;
      const creatorId = typeof creatorRef === 'string' ? creatorRef : creatorRef?._id;
      if (creatorId && String(creatorId) !== String(currentUserId)) continue;

      const bookingStatus = (booking?.status as string | undefined) ?? 'active';
      if (bookingStatus === 'refunded') continue;

      const bookingEvent = booking?.event;
      const eventId = typeof bookingEvent === 'string' ? bookingEvent : bookingEvent?._id;
      if (!eventId) continue;

      const eventFromBooking = typeof bookingEvent === 'object' && bookingEvent ? (bookingEvent as Event) : null;
      const event = eventFromBooking ?? eventsById.get(String(eventId)) ?? null;
      if (!event) continue;
      const eventStart = getEventStartISO(event);
      if (!eventStart) continue;

      const updatedAt = (booking?.updatedAt as string) || (booking?.createdAt as string) || '';
      const existing = byEventId.get(String(eventId));
      if (!existing || updatedAt > existing.bookingUpdatedAt) {
        byEventId.set(String(eventId), { event, bookingUpdatedAt: updatedAt, bookingStatus });
      }
    }

    for (const { event, bookingStatus } of byEventId.values()) {
      const ended = isEventEnded(event, now);
      const isActiveBooking = bookingStatus === 'active' || bookingStatus === 'pending';

      if (ended || event.status === 'finished') {
        history.push(event.status === 'active' ? { ...event, status: 'finished' } : event);
        continue;
      }

      if (isActiveBooking) {
        upcoming.push(event);
      }
    }

    upcoming.sort((a, b) => (getEventStartISO(a) ?? '').localeCompare(getEventStartISO(b) ?? ''));
    history.sort((a, b) => (getEventStartISO(b) ?? '').localeCompare(getEventStartISO(a) ?? ''));

    return { upcomingEvents: upcoming, historyEvents: history };
  }, [bookings, currentUser?._id, eventsById]);

  const visibleEvents = tab === 'upcoming' ? upcomingEvents : historyEvents;
  const isLoading = currentUserLoading || bookingsLoading || eventsLoading;
  const errorMessage = (bookingsError as Error | null)?.message ?? (eventsError as Error | null)?.message ?? null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image source={require('@/assets/images/schedule-bg.png')} style={styles.bgImage} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.92)', '#000000']}
        locations={[0, 0.55, 1]}
        style={styles.bgOverlay}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.topBar}>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => {
              if (returnTo) {
                router.replace(returnTo as any);
                return;
              }
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
                return;
              }
              router.replace('/classes');
            }}
            activeOpacity={0.8}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.title}>MY SCHEDULE</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <MyScheduleTabs tab={tab} setTab={setTab} />

        {isLoading && !visibleEvents.length ? (
          <View style={styles.helperBlock}>
            <ActivityIndicator color="#FFFFFF" />
            <Text style={styles.helperText}>Loading bookings…</Text>
          </View>
        ) : null}

        {!isLoading && !!errorMessage ? (
          <View style={styles.helperBlock}>
            <Text style={styles.helperTitle}>Couldn’t load schedule</Text>
            <Text style={styles.helperText}>{errorMessage}</Text>
          </View>
        ) : null}

        {!isLoading && !visibleEvents.length ? (
          <EmptyScheduleState
            tab={tab}
            bottomInset={insets.bottom}
            onBrowseClasses={() => router.push('/(tabs)/classes')}
          />
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Math.max(24, insets.bottom + 140) },
            ]}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={Boolean(isLoading)}
                onRefresh={async () => {
                  await Promise.all([refetchBookings(), refetchEvents()]);
                }}
                tintColor="#FFFFFF"
                titleColor="#FFFFFF"
                colors={['#FFFFFF']}
                progressBackgroundColor="transparent"
              />
            }
          >
            {visibleEvents.map((event) => (
              <BookedEventCard
                key={event._id}
                event={event}
                onPress={(pressedEvent) =>
                  router.push({
                    pathname: '/class-details/[id]',
                    params: {
                      id: pressedEvent._id,
                      event: encodeURIComponent(JSON.stringify(pressedEvent)),
                    },
                  })
                }
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

function safeParseISO(value: string): Date | null {
  try {
    return parseISO(value);
  } catch {
    return null;
  }
}

function getEventStartISO(event: Event): string | null {
  return (event.start_time ?? (event as any).startTime ?? null) as string | null;
}

function getEventEndISO(event: Event): string | null {
  return (event.end_time ?? (event as any).endTime ?? null) as string | null;
}

function isEventEnded(event: Event, now: Date): boolean {
  const endISO = getEventEndISO(event);
  const end = endISO ? safeParseISO(endISO) : null;
  if (end) return end < now;

  const startISO = getEventStartISO(event);
  const start = startISO ? safeParseISO(startISO) : null;
  if (!start) return false;

  const durationMinutes = event.duration ?? null;
  if (durationMinutes && durationMinutes > 0) {
    const computedEnd = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return computedEnd < now;
  }

  return event.status === 'finished' && start < now;
}
