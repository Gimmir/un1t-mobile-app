import * as Calendar from 'expo-calendar';

type AddToCalendarArgs = {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  notes?: string;
};

export async function addToSystemCalendar({ title, startDate, endDate, location, notes }: AddToCalendarArgs) {
  const isAvailable = await Calendar.isAvailableAsync();
  if (!isAvailable) {
    throw new Error('Calendar is not available on this device');
  }

  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Calendar permission not granted');
  }

  // Use OS-provided UI so the user can choose which calendar to save into (iOS) and confirm details.
  // On Android, action is always "done" and id is always null.
  return Calendar.createEventInCalendarAsync({
    title,
    startDate,
    endDate,
    location,
    notes,
  });
}
