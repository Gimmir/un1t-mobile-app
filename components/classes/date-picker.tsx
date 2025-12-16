import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { MonthView } from './month-view';
import { NavigationButtons } from './navigation-buttons';
import { DateInfo } from './types';
import { WeekView } from './week-view';

interface DatePickerProps {
  monthYear: string;
  isCalendarOpen: boolean;
  weekDates: DateInfo[];
  selectedDate: number;
  datesWithClasses: number[];
  calendarHeight: Animated.Value;
  monthCalendar: (number | null)[][];
  today: Date;
  currentWeekDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onToggleCalendar: () => void;
  onDateSelect: (date: number) => void;
  onCalendarDateSelect: (day: number | null) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  monthYear,
  isCalendarOpen,
  weekDates,
  selectedDate,
  datesWithClasses,
  calendarHeight,
  monthCalendar,
  today,
  currentWeekDate,
  onPrevious,
  onNext,
  onToday,
  onToggleCalendar,
  onDateSelect,
  onCalendarDateSelect,
}) => {
  return (
    <View style={styles.datePicker}>
      <View style={styles.dateHeader}>
        <Text style={styles.monthYear}>{monthYear}</Text>
        <NavigationButtons
          isCalendarOpen={isCalendarOpen}
          onPrevious={onPrevious}
          onNext={onNext}
          onToday={onToday}
          onToggleCalendar={onToggleCalendar}
        />
      </View>

      {!isCalendarOpen && (
        <WeekView
          weekDates={weekDates}
          selectedDate={selectedDate}
          datesWithClasses={datesWithClasses}
          onDateSelect={onDateSelect}
        />
      )}

      <MonthView
        calendarHeight={calendarHeight}
        monthCalendar={monthCalendar}
        selectedDate={selectedDate}
        today={today}
        currentWeekDate={currentWeekDate}
        datesWithClasses={datesWithClasses}
        onDateSelect={onCalendarDateSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  datePicker: {
    backgroundColor: '#1C1C1E',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
