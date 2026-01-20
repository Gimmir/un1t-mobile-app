import type { Event } from '@/DATA_TYPES/event';
import { useMemo } from 'react';
import { colors } from '@/src/theme/colors';
import { formatEventDate, formatEventTime, parseEventDateTime } from '@/src/features/events/utils/event-datetime';

type StatusConfig = {
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  ctaText: string;
  ctaBg: string;
  ctaTextColor: string;
  ctaDisabled: boolean;
};

export function useClassDetailsDerived(args: {
  displayEvent: Event | null | undefined;
  eventId: string | null;
  bookings: any[];
  currentUserId: string | null;
}) {
  const { displayEvent, eventId, bookings, currentUserId } = args;

  const title = useMemo(() => (displayEvent?.name ?? 'CLASS').toUpperCase(), [displayEvent?.name]);
  const status = displayEvent?.status ?? 'active';

  const startTime = useMemo(
    () => formatEventTime(displayEvent?.start_time, ''),
    [displayEvent?.start_time]
  );
  const endTime = useMemo(
    () => formatEventTime(displayEvent?.end_time, ''),
    [displayEvent?.end_time]
  );
  const startTimeISO = displayEvent?.start_time ?? (displayEvent as any)?.startTime ?? null;
  const endTimeISO = displayEvent?.end_time ?? (displayEvent as any)?.endTime ?? null;
  const dateLabel = useMemo(
    () => formatEventDate(displayEvent?.start_time, 'd MMMM yyyy'),
    [displayEvent?.start_time]
  );

  const timeRange = useMemo(() => {
    if (startTime && endTime) return `${startTime} — ${endTime}`;
    return startTime || endTime || '';
  }, [endTime, startTime]);

  const isEventEnded = useMemo(() => {
    const now = Date.now();
    const end = endTimeISO ? parseEventDateTime(endTimeISO) : null;
    if (end) return end.getTime() < now;

    const start = startTimeISO ? parseEventDateTime(startTimeISO) : null;
    if (!start) return status === 'finished';

    const durationMinutes = displayEvent?.duration ?? null;
    if (durationMinutes && durationMinutes > 0) {
      const computedEnd = start.getTime() + durationMinutes * 60 * 1000;
      return computedEnd < now;
    }

    return status === 'finished' && start.getTime() < now;
  }, [displayEvent?.duration, endTimeISO, startTimeISO, status]);

  const statusConfig: StatusConfig = useMemo(() => {
    switch (status) {
      case 'cancelled':
        return {
          badgeText: 'Cancelled',
          badgeBg: 'rgba(161, 161, 170, 0.12)',
          badgeTextColor: colors.text.secondary,
          ctaText: 'CLASS CANCELLED',
          ctaBg: colors.surface.panel,
          ctaTextColor: colors.text.secondary,
          ctaDisabled: true,
        };
      case 'finished':
        return {
          badgeText: 'Ended',
          badgeBg: 'rgba(113, 113, 122, 0.18)',
          badgeTextColor: colors.text.secondary,
          ctaText: 'CLASS ENDED',
          ctaBg: colors.surface.panel,
          ctaTextColor: colors.text.secondary,
          ctaDisabled: true,
        };
      case 'full':
        return {
          badgeText: 'Full',
          badgeBg: 'rgba(248, 113, 113, 0.18)',
          badgeTextColor: '#F87171',
          ctaText: 'CLASS FULL',
          ctaBg: colors.surface.panel,
          ctaTextColor: colors.text.secondary,
          ctaDisabled: true,
        };
      case 'active':
      default:
        return {
          badgeText: 'Book Now',
          badgeBg: 'rgba(52, 211, 153, 0.15)',
          badgeTextColor: '#34D399',
          ctaText: 'BOOK CLASS',
          ctaBg: '#FFFFFF',
          ctaTextColor: '#000000',
          ctaDisabled: false,
        };
    }
  }, [status]);

  const coachName = useMemo(() => {
    const firstName = displayEvent?.instructor?.firstName || '';
    const lastName = displayEvent?.instructor?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Coach';
  }, [displayEvent?.instructor?.firstName, displayEvent?.instructor?.lastName]);

  const coachNameForModal = useMemo(() => {
    const firstName = displayEvent?.instructor?.firstName || '';
    const lastName = displayEvent?.instructor?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || '—';
  }, [displayEvent?.instructor?.firstName, displayEvent?.instructor?.lastName]);

  const coachImageUri =
    displayEvent?.instructor?.avatar ??
    `https://i.pravatar.cc/100?u=${displayEvent?.instructor?._id ?? 'coach'}`;
  const coachHasAvatar = Boolean(displayEvent?.instructor?.avatar);

  const studioName = displayEvent?.location?.title?.trim() || '';

  const eventNameForModal = displayEvent?.name || (displayEvent as any)?.title || 'Class';
  const modalDateLabel = useMemo(
    () => formatEventDate(displayEvent?.start_time, 'd MMM yyyy'),
    [displayEvent?.start_time]
  );
  const modalStartTimeLabel = useMemo(
    () => formatEventTime(displayEvent?.start_time, ''),
    [displayEvent?.start_time]
  );

  const modalDuration = displayEvent?.duration ?? null;
  const modalCreditCost = 1;

  const activeBookingId = useMemo(() => {
    const idToMatch = displayEvent?._id ?? eventId ?? null;
    if (!idToMatch || !currentUserId) return null;

    for (const booking of bookings as any[]) {
      const bookingStatus = booking?.status as string | undefined;
      if (bookingStatus === 'cancelled' || bookingStatus === 'refunded') continue;

      const creatorRef = booking?.creator;
      const creatorId = typeof creatorRef === 'string' ? creatorRef : creatorRef?._id;
      if (creatorId && String(creatorId) !== String(currentUserId)) continue;

      const eventRef = booking?.event;
      const bookedEventId = typeof eventRef === 'string' ? eventRef : eventRef?._id;
      if (bookedEventId && String(bookedEventId) === String(idToMatch)) {
        return booking?._id ?? null;
      }
    }

    return null;
  }, [bookings, currentUserId, displayEvent?._id, eventId]);

  const isBookedByMe = Boolean(activeBookingId);
  const badgeText = isBookedByMe && status === 'active' ? 'Booked' : statusConfig.badgeText;
  const badgeBg = isBookedByMe && status === 'active' ? 'rgba(52, 211, 153, 0.15)' : statusConfig.badgeBg;
  const badgeTextColor = isBookedByMe && status === 'active' ? '#34D399' : statusConfig.badgeTextColor;

  return {
    title,
    status,
    startTime,
    endTime,
    dateLabel,
    timeRange,
    statusConfig,
    coachName,
    coachNameForModal,
    coachImageUri,
    coachHasAvatar,
    studioName,
    eventNameForModal,
    modalDateLabel,
    modalStartTimeLabel,
    modalDuration,
    modalCreditCost,
    activeBookingId,
    isBookedByMe,
    badgeText,
    badgeBg,
    badgeTextColor,
    isEventEnded,
  };
}
