import type { Event } from '@/DATA_TYPES/event';
import type { Studio } from '@/DATA_TYPES/studio';
import type { User } from '@/DATA_TYPES/user';
import { useStudio } from '@/src/features/studios/hooks/use-studios';
import { useUser } from '@/src/features/users/hooks/use-users';
import { queryClient } from '@/src/lib/query-client';
import { useMemo } from 'react';

/**
 * Hook to get minimal event display data with smart caching
 * Only fetches coach/studio if not already in cache
 * Good for lists where we want to show basic info without making tons of requests
 */
export function useEventDisplayData(event: Event | null | undefined) {
  const coachId = typeof event?.coach === 'string' ? event.coach : null;
  const studioId = typeof event?.studio === 'string' ? event.studio : null;

  // Check if data is already in cache
  const cachedCoach = coachId ? queryClient.getQueryData<User>(['users', coachId]) : null;
  const cachedStudio = studioId
    ? queryClient.getQueryData<Studio>(['studios', studioId, 'auth', null]) ??
      queryClient.getQueryData<Studio>(['studios', studioId, 'public', null]) ??
      queryClient.getQueryData<Studio>(['studios', studioId, 'auth']) ??
      queryClient.getQueryData<Studio>(['studios', studioId, 'public']) ??
      queryClient.getQueryData<Studio>(['studios', studioId])
    : null;

  // Only fetch if not in cache
  const { data: fetchedCoach } = useUser(cachedCoach ? null : coachId);
  const { data: fetchedStudio } = useStudio(cachedStudio ? null : studioId);

  const coach = cachedCoach || fetchedCoach;
  const studio = cachedStudio || fetchedStudio;

  const displayData = useMemo(() => {
    if (!event) return null;

    return {
      ...event,
      instructor: coach ? {
        _id: coach._id,
        first_name: coach.firstName,
        last_name: coach.lastName,
        image_url: coach.avatar,
      } : undefined,
      location: studio ? {
        _id: studio._id,
        name: studio.title || 'Studio',
      } : undefined,
    };
  }, [event, coach, studio]);

  return displayData;
}
