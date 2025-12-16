import { DateInfo } from './types';

export const generateWeekDates = (baseDate = new Date()): DateInfo[] => {
  const dates: DateInfo[] = [];
  const today = new Date(baseDate);

  let dayOfWeek = today.getDay();
  if (dayOfWeek === 0) dayOfWeek = 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek - 1));

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);

    const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

    dates.push({
      day: dayName,
      date: currentDate.getDate(),
      fullDate: currentDate,
    });
  }

  return dates;
};

export const getMonthYear = (date = new Date()): string => {
  const month = date.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const year = date.getFullYear();
  return `${month}, ${year}`;
};

export const generateMonthCalendar = (date: Date): (number | null)[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startDay = firstDay.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const calendar: (number | null)[][] = [];
  let week: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);

    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);
  }

  return calendar;
};

export const isCurrentWeek = (currentWeekDate: Date, today: Date): boolean => {
  const todayWeekStart = new Date(today);
  let dayOfWeek = todayWeekStart.getDay();
  if (dayOfWeek === 0) dayOfWeek = 7;
  todayWeekStart.setDate(today.getDate() - (dayOfWeek - 1));
  todayWeekStart.setHours(0, 0, 0, 0);

  const currentWeekStart = new Date(currentWeekDate);
  dayOfWeek = currentWeekStart.getDay();
  if (dayOfWeek === 0) dayOfWeek = 7;
  currentWeekStart.setDate(currentWeekDate.getDate() - (dayOfWeek - 1));
  currentWeekStart.setHours(0, 0, 0, 0);

  return todayWeekStart.getTime() === currentWeekStart.getTime();
};
