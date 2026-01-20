import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WEEK_DAYS } from './constants';
import { typography } from '@/src/theme/typography';
import { colors } from '@/src/theme/colors';

interface MonthViewProps {
  calendarHeight: Animated.Value;
  monthCalendar: (number | null)[][];
  selectedDate: number;
  today: Date;
  currentWeekDate: Date;
  datesWithClasses: number[];
  onDateSelect: (day: number | null) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  calendarHeight,
  monthCalendar,
  selectedDate,
  today,
  currentWeekDate,
  datesWithClasses,
  onDateSelect,
}) => {
  return (
    <Animated.View
      style={[
        styles.monthCalendarContainer,
        {
          maxHeight: calendarHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 320],
          }),
          opacity: calendarHeight,
        },
      ]}
    >
      <View style={styles.calendarWeekHeader}>
        {WEEK_DAYS.map((day, i) => (
          <Text key={i} style={styles.calendarWeekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {monthCalendar.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.calendarWeek}>
            {week.map((day, dayIndex) => {
              const isSelected = day === selectedDate;
              const isToday =
                day === today.getDate() &&
                currentWeekDate.getMonth() === today.getMonth() &&
                currentWeekDate.getFullYear() === today.getFullYear();
              const hasClasses = day && datesWithClasses.includes(day);

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.calendarDay,
                    isSelected && styles.calendarDaySelected,
                    isToday && !isSelected && styles.calendarDayToday,
                  ]}
                  onPress={() => onDateSelect(day)}
                  disabled={!day}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      !day && styles.calendarDayTextEmpty,
                      isSelected && styles.calendarDayTextSelected,
                      isToday && !isSelected && styles.calendarDayTextToday,
                    ]}
                  >
                    {day || ''}
                  </Text>
                  {hasClasses && !isSelected && <View style={styles.calendarDayIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  monthCalendarContainer: {
    overflow: 'hidden',
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
    marginTop: 6,
  },
  calendarWeekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: typography.size.xs,
    fontWeight: typography.weight.semibold,
    color: colors.text.muted,
    letterSpacing: 0.4,
  },
  calendarGrid: {
    gap: 6,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    position: 'relative',
  },
  calendarDaySelected: {
    backgroundColor: '#FFFFFF',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: colors.text.muted,
  },
  calendarDayText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    color: '#FFFFFF',
  },
  calendarDayTextEmpty: {
    opacity: 0,
  },
  calendarDayTextSelected: {
    color: '#000000',
  },
  calendarDayTextToday: {
    color: '#FFFFFF',
  },
  calendarDayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
});