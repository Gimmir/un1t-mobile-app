import type { Event } from '@/DATA_TYPES/event';
import { EventCard } from '@/components/events';
import { usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

type ClassesEventsListProps = {
  events: Event[];
  isLoading?: boolean;
  errorMessage?: string | null;
  onEventPress?: (event: Event) => void;
};

function PopulatedEventCard({ event, onEventPress }: { event: Event; onEventPress?: (event: Event) => void }) {
  const { populatedEvent } = usePopulatedEvent(event);
  const displayEvent = populatedEvent ?? event;

  return <EventCard event={displayEvent} onPress={onEventPress} />;
}

export function ClassesEventsList({
  events,
  isLoading,
  errorMessage,
  onEventPress,
}: ClassesEventsListProps) {
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#FFFFFF" />
        <Text style={styles.helperText}>Loading classes…</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn’t load classes</Text>
        <Text style={styles.helperText}>{errorMessage}</Text>
      </View>
    );
  }

  if (!events.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.helperText}>No classes available for this date</Text>
      </View>
    );
  }

  return (
    <View>
      {events.map((event, index) => (
        <PopulatedEventCard 
          key={event._id ?? `event_${index}`} 
          event={event} 
          onEventPress={onEventPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: typography.size.md,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  helperText: {
    marginTop: 10,
    color: colors.text.muted,
    fontSize: typography.size.md,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
});