import { Ionicons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonAvatar } from './hexagon-avatar';
import { ClassItem } from './types';

const STATUS_STYLES = {
  AVAILABLE: {
    label: 'Spots open',
    textColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    accentColor: '#34D399',
  },
  BOOKED: {
    label: 'Booked',
    textColor: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    accentColor: '#34D399',
  },
  WAITLIST: {
    label: 'Waitlist',
    textColor: '#FACC15',
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    accentColor: '#FACC15',
  },
  FULL: {
    label: 'Class full',
    textColor: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
    accentColor: '#F87171',
  },
  FINISHED: {
    label: 'Finished',
    textColor: '#A1A1AA',
    backgroundColor: 'rgba(161, 161, 170, 0.12)',
    accentColor: '#3F3F46',
  },
  CANCELLED: {
    label: 'Cancelled',
    textColor: '#F87171',
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
    accentColor: '#F87171',
  },
} as const;

export type ClassCardProps = ClassItem & {
  date?: Date;
  dateLabel?: string;
  onPress?: () => void;
};

export const ClassCard: React.FC<ClassCardProps> = ({
  time,
  name,
  trainer,
  status,
  avatar,
  date,
  dateLabel,
  onPress,
}) => {
  const statusStyle = STATUS_STYLES[status] ?? STATUS_STYLES.AVAILABLE;

  const resolvedDateLabel = React.useMemo(() => {
    if (dateLabel) return dateLabel;
    if (!date) return 'Today';
    try {
      return isToday(date) ? 'Today' : format(date, 'MMM d');
    } catch {
      return 'Today';
    }
  }, [date, dateLabel]);

  return (
    <TouchableOpacity activeOpacity={0.92} style={styles.touchTarget} onPress={onPress}>
      <View style={[styles.accent, { backgroundColor: statusStyle.accentColor }]} />
      <View style={styles.cardBody}>
        <View style={styles.headerRow}>
          <View style={styles.timeBlock}>
            <Text style={styles.dateText}>{resolvedDateLabel}</Text>
            <Text style={styles.classTime}>{time}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {statusStyle.label}
            </Text>
          </View>
        </View>

        <Text style={styles.className}>{name}</Text>

        <View style={styles.footerRow}>
          <View style={styles.trainerCard}>
            <HexagonAvatar uri={avatar} size={40} isIcon={status === 'FULL'} />
            <View>
              <Text style={styles.trainerLabel}>Coach</Text>
              <Text style={styles.trainerName}>{trainer}</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchTarget: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  timeBlock: {
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A1A1AA',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  classTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  className: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trainerLabel: {
    fontSize: 12,
    color: '#A1A1AA',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E4E4E7',
  },
});
