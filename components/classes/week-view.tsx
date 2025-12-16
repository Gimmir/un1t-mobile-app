import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DateItem } from './date-item';
import { DateInfo } from './types';

interface WeekViewProps {
  weekDates: DateInfo[];
  selectedDate: number;
  datesWithClasses: number[];
  onDateSelect: (date: number) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  weekDates,
  selectedDate,
  datesWithClasses,
  onDateSelect,
}) => {
  return (
    <View style={styles.dateList}>
      {weekDates.map((item, index) => (
        <DateItem
          key={index}
          day={item.day}
          date={item.date}
          isSelected={selectedDate === item.date}
          hasClasses={datesWithClasses.includes(item.date)}
          onPress={() => onDateSelect(item.date)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dateList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
