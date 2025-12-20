export interface ClassItem {
  id: string;
  time: string;
  name: string;
  trainer: string;
  status: 'AVAILABLE' | 'WAITLIST' | 'FULL' | 'BOOKED' | 'FINISHED' | 'CANCELLED';
  avatar: string;
}

export interface DateInfo {
  day: string;
  date: number;
  fullDate: Date;
}

export interface MockClassesData {
  [key: number]: ClassItem[];
}
