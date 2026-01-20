import type { Event } from '@/DATA_TYPES/event';
import { useEvents } from '@/src/features/events/hooks/use-events';
import { useStudios } from '@/src/features/studios/hooks/use-studios';
import { useCurrentUser } from '@/src/features/users/hooks/use-users';
import { isSameDay } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { parseEventDateTime } from '@/src/features/events/utils/event-datetime';

type StudioOption = { id: string; title: string };

export function useClassesScreenData(args: { currentWeekDate: Date; selectedDate: number }) {
  const { data: studiosData, isLoading: studiosLoading } = useStudios();
  const { data: eventsData, isLoading: eventsLoading, error: eventsError, refetch: refetchEvents } = useEvents();
  const { data: currentUser } = useCurrentUser();

  const studios = useMemo<StudioOption[]>(
    () =>
      (studiosData ?? []).map((studio) => ({
        id: studio._id,
        title: studio.title,
      })),
    [studiosData]
  );

  const [selectedStudioId, setSelectedStudioId] = useState<string | null>(null);

  // Set user's studio as default, fallback to first studio
  useEffect(() => {
    if (!selectedStudioId && studios.length) {
      // Try to get user's studio first
      const userStudio = currentUser?.studio;
      const userStudioId = typeof userStudio === 'string' 
        ? userStudio 
        : userStudio?._id;
      
      if (userStudioId) {
        // Check if user's studio is in the list
        const studioExists = studios.some(s => s.id === userStudioId);
        if (studioExists) {
          setSelectedStudioId(userStudioId);
          return;
        }
      }
      
      // Fallback to first studio
      setSelectedStudioId(studios[0].id);
    }
  }, [selectedStudioId, studios, currentUser]);

  const eventsForStudio = useMemo(() => {
    const allEvents = eventsData ?? [];
    
    if (!selectedStudioId) return allEvents;
    
    const filtered = allEvents.filter((event) => {
      // event.studio is the correct field - it's the studio ID from backend
      const studioId = event.studio;
      return studioId ? String(studioId) === String(selectedStudioId) : false;
    });
    
    return filtered;
  }, [eventsData, selectedStudioId]);

  const datesWithClasses = useMemo(() => {
    const month = args.currentWeekDate.getMonth();
    const year = args.currentWeekDate.getFullYear();
    const set = new Set<number>();

    for (const event of eventsForStudio) {
      if (!event || !event.start_time) continue;
      
      try {
        const parsed = parseEventDateTime(event.start_time);
        if (parsed && parsed.getMonth() === month && parsed.getFullYear() === year) {
          set.add(parsed.getDate());
        }
      } catch {}
    }

    return Array.from(set.values()).sort((a, b) => a - b);
  }, [args.currentWeekDate, eventsForStudio]);

  const selectedFullDate = useMemo(() => {
    const selected = new Date(args.currentWeekDate);
    selected.setDate(args.selectedDate);
    selected.setHours(12, 0, 0, 0);
    return selected;
  }, [args.currentWeekDate, args.selectedDate]);

  const eventsForSelectedDay = useMemo(() => {
    const dayEvents: Event[] = [];
    
    for (const event of eventsForStudio) {
      if (!event || !event.start_time) {
        continue;
      }
      
      try {
        const start = parseEventDateTime(event.start_time);
        const matches = start ? isSameDay(start, selectedFullDate) : false;
        
        if (matches) {
          dayEvents.push(event);
        }
      } catch {
        // Skip events with invalid dates
      }
    }
    
    dayEvents.sort((a, b) => {
      const aDate = parseEventDateTime(a.start_time);
      const bDate = parseEventDateTime(b.start_time);
      if (aDate && bDate) return aDate.getTime() - bDate.getTime();
      return (a.start_time ?? '').localeCompare(b.start_time ?? '');
    });
    return dayEvents;
  }, [eventsForStudio, selectedFullDate]);

  const eventsErrorMessage = (eventsError as Error | null)?.message ?? null;

  return {
    studios,
    studiosLoading,
    selectedStudioId,
    setSelectedStudioId,
    datesWithClasses,
    eventsForSelectedDay,
    eventsLoading,
    eventsErrorMessage,
    refetchEvents,
  };
}
