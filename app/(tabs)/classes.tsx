import {
  ClassCard,
  DATES_WITH_CLASSES,
  DatePicker,
  EmptyState,
  Header,
  MOCK_CLASSES,
  StudioSelector,
  generateMonthCalendar,
  generateWeekDates,
  getMonthYear,
} from '@/components/classes';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentWeekDate, setCurrentWeekDate] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarHeight = useRef(new Animated.Value(0)).current;

  const weekDates = generateWeekDates(currentWeekDate);
  const monthYear = getMonthYear(currentWeekDate);
  const monthCalendar = generateMonthCalendar(currentWeekDate);
  const classes = MOCK_CLASSES[selectedDate] || [];

  const goToNextWeek = () => {
    if (isCalendarOpen) {
      goToNextMonth();
    } else {
      const nextWeek = new Date(currentWeekDate);
      nextWeek.setDate(currentWeekDate.getDate() + 7);
      setCurrentWeekDate(nextWeek);

      const newWeekDates = generateWeekDates(nextWeek);
      setSelectedDate(newWeekDates[0].date);
    }
  };

  const goToPreviousWeek = () => {
    if (isCalendarOpen) {
      goToPreviousMonth();
    } else {
      const prevWeek = new Date(currentWeekDate);
      prevWeek.setDate(currentWeekDate.getDate() - 7);
      setCurrentWeekDate(prevWeek);

      const newWeekDates = generateWeekDates(prevWeek);
      setSelectedDate(newWeekDates[0].date);
    }
  };

  const goToToday = () => {
    setCurrentWeekDate(today);
    setSelectedDate(today.getDate());
  };

  const toggleCalendar = () => {
    const newState = !isCalendarOpen;
    setIsCalendarOpen(newState);

    Animated.timing(calendarHeight, {
      toValue: newState ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentWeekDate);
    nextMonth.setMonth(currentWeekDate.getMonth() + 1);
    setCurrentWeekDate(nextMonth);
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentWeekDate);
    prevMonth.setMonth(currentWeekDate.getMonth() - 1);
    setCurrentWeekDate(prevMonth);
  };

  const selectDateFromCalendar = (day: number | null) => {
    if (day) {
      const newDate = new Date(currentWeekDate);
      newDate.setDate(day);

      setSelectedDate(day);
      setCurrentWeekDate(newDate);
    }
  };

  const handleSwipeLeft = () => {
    goToNextWeek();
  };

  const handleSwipeRight = () => {
    goToPreviousWeek();
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-10, 10])
    .onEnd((event) => {
      'worklet';
      const { translationX, velocityX } = event;

      if (translationX < -50 || velocityX < -500) {
        runOnJS(handleSwipeLeft)();
      } else if (translationX > 50 || velocityX > 500) {
        runOnJS(handleSwipeRight)();
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar style="light" />

        <Header />

        <StudioSelector />

        <GestureDetector gesture={swipeGesture}>
          <DatePicker
            monthYear={monthYear}
            isCalendarOpen={isCalendarOpen}
            weekDates={weekDates}
            selectedDate={selectedDate}
            datesWithClasses={DATES_WITH_CLASSES}
            calendarHeight={calendarHeight}
            monthCalendar={monthCalendar}
            today={today}
            currentWeekDate={currentWeekDate}
            onPrevious={goToPreviousWeek}
            onNext={goToNextWeek}
            onToday={goToToday}
            onToggleCalendar={toggleCalendar}
            onDateSelect={setSelectedDate}
            onCalendarDateSelect={selectDateFromCalendar}
          />
        </GestureDetector>

        <ScrollView
          style={styles.classList}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          showsVerticalScrollIndicator={false}
        >
          {classes.length > 0 ? (
            classes.map((classItem) => <ClassCard key={classItem.id} {...classItem} />)
          ) : (
            <EmptyState />
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  classList: {
    flex: 1,
  },
});
