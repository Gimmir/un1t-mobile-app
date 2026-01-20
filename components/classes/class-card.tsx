import { Ionicons } from '@expo/vector-icons';
import { format, isToday } from 'date-fns';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HexagonAvatar } from './hexagon-avatar';
import { ClassItem } from './types';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

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
    textColor: colors.text.secondary,
    backgroundColor: 'rgba(161, 161, 170, 0.12)',
    accentColor: colors.border.strong,
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
  const creditCost = 1;

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

          <View style={styles.creditRow}>
            <Text style={styles.creditText}>
              {creditCost} {creditCost === 1 ? 'CREDIT' : 'CREDITS'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={ colors.text.secondary } />
          </View>
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
    borderColor: colors.surface.elevated,
    backgroundColor: colors.surface.base,
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
    fontSize: typography.size.sm,
    fontWeight: typography.weight.heavy,
    color: colors.text.secondary,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  classTime: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  className: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.heavy,
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
    fontSize: typography.size.sm,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  trainerName: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#E4E4E7',
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  creditText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.bold,
    color: colors.text.secondary,
    letterSpacing: 0.6,
  },
});