import type { Event } from '@/DATA_TYPES/event';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonAvatar } from '../classes/hexagon-avatar';

type EventCardProps = {
  event: Event;
  onPress?: (event: Event) => void;
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
    textColor: '#A1A1AA',
    badgeBg: 'rgba(161, 161, 170, 0.12)',
    accent: '#3F3F46',
  },
  finished: {
    label: 'Finished',
    textColor: '#A1A1AA',
    badgeBg: 'rgba(161, 161, 170, 0.12)',
    accent: '#52525B',
  },
} as const;

export function EventCard({ event, onPress }: EventCardProps) {
  const statusStyle = STATUS_STYLES[event.status] ?? STATUS_STYLES.active;

  const startTime = useMemo(() => {
    if (!event.start_time) return '--:--';
    try {
      return format(parseISO(event.start_time), 'HH:mm');
    } catch {
      return '--:--';
    }
  }, [event.start_time]);

  const endTime = useMemo(() => {
    if (!event.end_time) return '--:--';
    try {
      return format(parseISO(event.end_time), 'HH:mm');
    } catch {
      return '--:--';
    }
  }, [event.end_time]);

  const dateLabel = useMemo(() => {
    if (!event.start_time) return '';
    try {
      return format(parseISO(event.start_time), 'MMM d');
    } catch {
      return '';
    }
  }, [event.start_time]);

  const coachName = useMemo(() => {
    if (!event.instructor?.firstName) return 'Coach';
    const lastName = event.instructor.lastName || '';
    return `${event.instructor.firstName} ${lastName}`.trim();
  }, [event.instructor]);
  
  const primaryTag = event.tags?.[0] ?? '';
  const showCoachIcon =
    event.status === 'full' ||
    event.status === 'cancelled' ||
    event.status === 'finished' ||
    !event.instructor?.avatar;
  const coachImageUri = event.instructor?.avatar ?? `https://i.pravatar.cc/100?u=${event.instructor?._id ?? 'coach'}`;
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
              {event.duration || 0} MIN • {endTime}
              {dateLabel && <Text> • {dateLabel.toUpperCase()}</Text>}
            </Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.badgeBg }]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {statusStyle.label}
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
                {event.credit_cost || 0} {(event.credit_cost || 0) === 1 ? 'CREDIT' : 'CREDITS'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#71717A" />
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
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  cancelled: {
    opacity: 0.75,
  },
  finished: {
    opacity: 0.85,
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
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  timeMeta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  middleRow: {
    marginTop: 10,
  },
  tagText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '900',
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
    fontSize: 11,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
  },
  coachName: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '700',
    color: '#E4E4E7',
    letterSpacing: 0.4,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A1A1AA',
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
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 1,
  },
});
