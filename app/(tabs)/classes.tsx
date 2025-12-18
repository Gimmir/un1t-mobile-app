import {
  DatePicker,
  Header,
  StudioSelector,
  generateMonthCalendar,
  generateWeekDates,
  getMonthYear,
} from '@/components/classes';
import { ClassesEventsList, useClassesScreenData } from '@/components/classes-screen';
import { HomeTopBackground } from '@/components/home';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ClassesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentWeekDate, setCurrentWeekDate] = useState(today);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarHeight = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const {
    studios,
    studiosLoading,
    selectedStudioId,
    setSelectedStudioId,
    datesWithClasses,
    eventsForSelectedDay,
    eventsLoading,
    eventsErrorMessage,
    refetchEvents,
  } = useClassesScreenData({ currentWeekDate, selectedDate });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchEvents();
    } finally {
      setRefreshing(false);
    }
  }, [refetchEvents]);

  // Refresh events when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        refetchEvents();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refetchEvents]);

  const weekDates = generateWeekDates(currentWeekDate);
  const monthYear = getMonthYear(currentWeekDate);
  const monthCalendar = generateMonthCalendar(currentWeekDate);

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
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <HomeTopBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.headerBlock}>
          <Header />
        </View>

        <StudioSelector
          studios={studios}
          selectedStudioId={selectedStudioId}
          onSelectStudio={setSelectedStudioId}
          isLoading={studiosLoading}
        />

        <GestureDetector gesture={swipeGesture}>
          <View style={styles.datePickerCard} collapsable={false}>
            <DatePicker
              monthYear={monthYear}
              isCalendarOpen={isCalendarOpen}
              weekDates={weekDates}
              selectedDate={selectedDate}
              datesWithClasses={datesWithClasses}
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
          </View>
        </GestureDetector>

        <ScrollView
          style={styles.classList}
          contentContainerStyle={[
            styles.classListContent,
            { paddingBottom: insets.bottom + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#FFFFFF']}
            />
          }
        >
          <ClassesEventsList
            events={eventsForSelectedDay}
            isLoading={eventsLoading}
            errorMessage={eventsErrorMessage}
            onEventPress={(pressedEvent) =>
              router.push({
                pathname: '/class-details/[id]',
                params: { id: pressedEvent._id, event: encodeURIComponent(JSON.stringify(pressedEvent)) },
              })
            }
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191919',
  },
  safeArea: {
    flex: 1,
  },
  headerBlock: {
    marginTop: 10,
  },
  datePickerCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F1F23',
    backgroundColor: '#101012',
    overflow: 'hidden',
  },
  classList: {
    flex: 1,
  },
  classListContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
});
