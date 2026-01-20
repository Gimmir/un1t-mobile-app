import type { Event } from '@/DATA_TYPES/event';
import { useBookings } from '@/src/features/bookings/hooks/use-bookings';
import { useCurrentUser } from '@/src/features/users/hooks/use-users';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonAvatar } from '../classes/hexagon-avatar';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';
import {
  formatEventDate,
  formatEventTime,
  isEventToday,
} from '@/src/features/events/utils/event-datetime';

type EventCardProps = {
  event: Event;
  onPress?: (event: Event) => void;
  statusLabelOverride?: string;
};

const STATUS_STYLES = {
  active: {
    label: 'Book Now',
    textColor: '#34D399',
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    accent: '#34D399',
  },
  full: {
    label: 'Full',
    textColor: '#F87171',
    badgeBg: 'rgba(248, 113, 113, 0.18)',
    accent: '#F87171',
  },
  cancelled: {
    label: 'Cancelled',
    textColor: colors.text.secondary,
    badgeBg: 'rgba(161, 161, 170, 0.12)',
    accent: colors.border.strong,
  },
  finished: {
    label: 'Ended',
    textColor: colors.text.secondary,
    badgeBg: 'rgba(113, 113, 122, 0.18)',
    accent: colors.text.placeholder,
  },
} as const;

export function EventCard({ event, onPress, statusLabelOverride }: EventCardProps) {
  const { data: bookings = [] } = useBookings();
  const { data: currentUser } = useCurrentUser();

  const isBooked = useMemo(() => {
    if (!event?._id) return false;
    const currentUserId = currentUser?._id ?? null;
    if (!currentUserId) return false;

    for (const booking of bookings as any[]) {
      const bookingStatus = booking?.status as string | undefined;
      if (bookingStatus === 'cancelled' || bookingStatus === 'refunded') continue;

      const creatorRef = booking?.creator;
      const creatorId = typeof creatorRef === 'string' ? creatorRef : creatorRef?._id;
      if (creatorId && String(creatorId) !== String(currentUserId)) continue;

      const bookingEventRef = booking?.event;
      const bookingEventId =
        typeof bookingEventRef === 'string' ? bookingEventRef : bookingEventRef?._id;
      if (!bookingEventId) continue;
      if (String(bookingEventId) === String(event._id)) return true;
    }

    return false;
  }, [bookings, currentUser?._id, event?._id]);

  const shouldShowBooked = isBooked && event.status !== 'cancelled' && event.status !== 'finished';
  const baseStatusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES.active;
  const statusStyle = shouldShowBooked ? STATUS_STYLES.active : baseStatusStyle;
  const effectiveStatusLabel =
    statusLabelOverride ?? (shouldShowBooked ? 'Booked' : statusStyle.label);

  const startTime = useMemo(() => {
    return formatEventTime(event.start_time);
  }, [event.start_time]);

  const endTime = useMemo(() => {
    return formatEventTime(event.end_time);
  }, [event.end_time]);

  const dateLabel = useMemo(() => {
    if (!event.start_time) return '';
    return isEventToday(event.start_time)
      ? 'Today'
      : formatEventDate(event.start_time, 'MMM d');
  }, [event.start_time]);

  const coachName = useMemo(() => {
    const coachProfile =
      event.instructor ??
      (event.coach && typeof event.coach === 'object' ? (event.coach as any) : null);
    if (!coachProfile?.firstName) return 'Coach';
    const lastName = coachProfile.lastName || '';
    return `${coachProfile.firstName} ${lastName}`.trim();
  }, [event.coach, event.instructor]);
  
  const primaryTag = event.tags?.[0] ?? '';
  const coachProfile =
    event.instructor ?? (event.coach && typeof event.coach === 'object' ? (event.coach as any) : null);
  const showCoachIcon =
    event.status === 'full' ||
    event.status === 'cancelled' ||
    event.status === 'finished' ||
    !coachProfile?.avatar;
  const creditCost = 1;
  const coachImageUri =
    coachProfile?.avatar ??
    `https://i.pravatar.cc/100?u=${coachProfile?._id ?? (typeof event.coach === 'string' ? event.coach : 'coach')}`;
  const locationName = event.location?.title ?? '';

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      disabled={!onPress}
      onPress={() => onPress?.(event)}
      style={[
        styles.touchTarget,
        event.status === 'cancelled' && styles.cancelled,
        event.status === 'finished' && styles.finished,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: statusStyle.accent }]} />

      <View style={styles.cardBody}>
        <View style={styles.topRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeText}>{startTime}</Text>
            <Text style={styles.timeMeta}>
              {(dateLabel ? `${dateLabel} • ` : '') + `${event.duration || 0} MIN • ${endTime}`}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.badgeBg }]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {effectiveStatusLabel}
            </Text>
          </View>
        </View>

        <View style={styles.middleRow}>
          {!!primaryTag && <Text style={styles.tagText}>{primaryTag}</Text>}
          <Text style={styles.eventName} numberOfLines={1}>
            {event.name}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.coachRow}>
            <HexagonAvatar
              uri={coachImageUri}
              size={40}
              isIcon={showCoachIcon}
            />
            <View style={styles.coachText}>
              <Text style={styles.coachLabel}>Instructor</Text>
              <Text style={styles.coachName} numberOfLines={1}>
                {coachName || '—'}
              </Text>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <Text style={styles.locationText} numberOfLines={1}>
              {locationName || '—'}
            </Text>
            <View style={styles.actionRow}>
              <Text style={styles.creditText}>
                {creditCost} {creditCost === 1 ? 'CREDIT' : 'CREDITS'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={ colors.text.muted } />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchTarget: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
    overflow: 'hidden',
  },
  cancelled: {
    opacity: 0.75,
  },
  finished: {
    opacity: 0.7,
    backgroundColor: '#0B0B0D',
    borderColor: colors.surface.panel,
  },
  accent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  timeBlock: {
    flex: 1,
  },
  timeText: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timeMeta: {
    marginTop: 4,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.muted,
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  middleRow: {
    marginTop: 10,
  },
  tagText: {
    color: colors.text.secondary,
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eventName: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  coachRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  coachText: {
    flex: 1,
  },
  coachLabel: {
    fontSize: typography.size.sm,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: typography.weight.bold,
  },
  coachName: {
    marginTop: 2,
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: '#E4E4E7',
    letterSpacing: 0.4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  locationText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    color: colors.text.secondary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    maxWidth: 140,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  creditText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    color: colors.text.muted,
    letterSpacing: 1,
  },
});
