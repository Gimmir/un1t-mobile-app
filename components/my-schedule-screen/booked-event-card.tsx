import type { Event } from '@/DATA_TYPES/event';
import { EventCard } from '@/components/events';
import { usePopulatedEvent } from '@/src/features/events/hooks/use-events';
import React from 'react';

export function BookedEventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress?: (event: Event) => void;
}) {
  const { populatedEvent } = usePopulatedEvent(event);
  const displayEvent = populatedEvent ?? event;

  return (
    <EventCard
      event={displayEvent}
      onPress={onPress}
    />
  );
}
