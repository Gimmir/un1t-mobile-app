import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WEEK_DAYS } from './constants';

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
            outputRange: [0, 400],
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
    marginBottom: 12,
    marginTop: 12,
  },
  calendarWeekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#71717A',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    gap: 8,
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
    borderRadius: 8,
    position: 'relative',
  },
  calendarDaySelected: {
    backgroundColor: '#FFFFFF',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#71717A',
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '600',
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
