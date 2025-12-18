import type { Event } from '@/DATA_TYPES/event';
import type { Studio } from '@/DATA_TYPES/studio';
import type { User } from '@/DATA_TYPES/user';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { useUser } from '@/src/features/users/hooks/use-users';
import { useMemo } from 'react';

/**
 * Enhanced event with populated coach and studio data
 */
export interface PopulatedEvent extends Event {
  instructor: User;
  location: Studio;
}

/**
 * Hook to get event with populated coach and studio data
 * Fetches coach (User) and studio (Studio) separately based on event.coach and event.studio IDs
 * 
 * @param event - The event from API
 * @returns Object with event, coach data, studio data, and loading states
 * 
 * @example
 * const { data: event } = useEvent(eventId);
 * const { populatedEvent, isLoading } = usePopulatedEvent(event);
 * 
 * // populatedEvent will have:
 * // - instructor: User (with firstName, lastName, avatar)
 * // - location: Studio (with title)
 */
export function usePopulatedEvent(event: Event | null | undefined) {
  const coachId = typeof event?.coach === 'string' ? event.coach : null;
  const studioId = typeof event?.studio === 'string' ? event.studio : null;

  const { data: coach, isLoading: coachLoading } = useUser(coachId);
  const { data: studio, isLoading: studioLoading } = useStudio(studioId);

  const populatedEvent = useMemo(() => {
    if (!event) return null;

    return {
      ...event,
      instructor: coach || event.instructor,
      location: studio || event.location,
    };
  }, [event, coach, studio]);

  return {
    populatedEvent,
    coach,
    studio,
    isLoading: coachLoading || studioLoading,
  };
}
