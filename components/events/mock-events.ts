import type { Event } from '@/DATA_TYPES/event';
import { set } from 'date-fns';

function isoAt(date: Date, hours: number, minutes: number) {
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 }).toISOString();
}

export function makeMockEventsForDate(date: Date): Event[] {
  const start1 = isoAt(date, 7, 0);
  const end1 = isoAt(date, 7, 45);
  const start2 = isoAt(date, 12, 30);
  const end2 = isoAt(date, 13, 30);
  const start3 = isoAt(date, 17, 30);
  const end3 = isoAt(date, 18, 20);
  const start4 = isoAt(date, 19, 30);
  const end4 = isoAt(date, 20, 15);

  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  const dateKey = date.toISOString().slice(0, 10);

  return [
    {
      _id: `evt_${dateKey}_0700`,
      createdAt,
      updatedAt,
      name: 'TROOPER',
      start_time: start1,
      end_time: end1,
      duration: 45,
      instructor: { _id: 'i1', firstName: 'Sarah', lastName: 'Connor' } as any,
      location: { _id: 'l1', title: 'London Bridge' } as any,
      tags: ['CARDIO'],
      status: 'active',
      credit_cost: 1,
    } as Event,
    {
      _id: `evt_${dateKey}_1230`,
      createdAt,
      updatedAt,
      name: 'PYRAMID',
      start_time: start2,
      end_time: end2,
      duration: 60,
      instructor: { _id: 'i2', firstName: 'John', lastName: 'Wick' } as any,
      location: { _id: 'l1', title: 'London Bridge' } as any,
      tags: ['STRENGTH'],
      status: 'cancelled',
      credit_cost: 1,
    } as Event,
    {
      _id: `evt_${dateKey}_1730`,
      createdAt,
      updatedAt,
      name: 'ENGINE',
      start_time: start3,
      end_time: end3,
      duration: 50,
      instructor: { _id: 'i3', firstName: 'Ellen', lastName: 'Ripley' } as any,
      location: { _id: 'l1', title: 'London Bridge' } as any,
      tags: ['HYBRID'],
      status: 'finished',
      credit_cost: 1,
    } as Event,
    {
      _id: `evt_${dateKey}_1930`,
      createdAt,
      updatedAt,
      name: 'AFTERBURN',
      start_time: start4,
      end_time: end4,
      duration: 45,
      instructor: { _id: 'i4', firstName: 'Neo', lastName: 'Anderson' } as any,
      location: { _id: 'l1', title: 'London Bridge' } as any,
      tags: ['CARDIO'],
      status: 'full',
      credit_cost: 1,
    } as Event,
  ];
}
