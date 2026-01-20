import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

interface DateItemProps {
  day: string;
  date: number;
  isSelected: boolean;
  hasClasses: boolean;
  onPress: () => void;
}

export const DateItem: React.FC<DateItemProps> = ({ day, date, isSelected, hasClasses, onPress }) => {
  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dayLabel}>{day}</Text>
      <TouchableOpacity
        style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
        onPress={onPress}
      >
        <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{date}</Text>
      </TouchableOpacity>
      {hasClasses && !isSelected && <View style={styles.classIndicator} />}
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayLabel: {
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.muted,
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  dateButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    marginBottom: 4,
  },
  dateButtonSelected: {
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.bold,
    color: '#FFFFFF',
  },
  dateTextSelected: {
    color: '#000000',
  },
  classIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
});