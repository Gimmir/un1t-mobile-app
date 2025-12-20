import type { Booking, BookingCreateDTO, BookingUpdateDTO } from '@/DATA_TYPES/booking';
import { api } from '@/src/lib/axios';

function unwrapData<T>(response: unknown): T {
  if (response && typeof response === 'object' && 'data' in response) {
    const data = (response as Record<string, unknown>).data;
    if (data && typeof data === 'object' && 'data' in data) {
      return (data as Record<string, unknown>).data as T;
    }
    return data as T;
  }
  return response as T;
}

export const bookingsApi = {
  createBooking: async (payload: BookingCreateDTO) => {
    const response = await api.post<unknown, BookingCreateDTO>('/bookings', payload);
    return unwrapData<Booking>(response);
  },

  getBookings: async () => {
    const response = await api.get<unknown>('/bookings');
    return unwrapData<Booking[]>(response) ?? [];
  },

  getBookingById: async (bookingId: string) => {
    const response = await api.get<unknown>(`/bookings/${bookingId}`);
    return unwrapData<Booking>(response);
  },

  updateBooking: async (bookingId: string, payload: BookingUpdateDTO) => {
    const response = await api.put<unknown, BookingUpdateDTO>(`/bookings/${bookingId}`, payload);
    return unwrapData<Booking>(response);
  },

  deleteBooking: async (bookingId: string) => {
    const response = await api.delete<unknown>(`/bookings/${bookingId}`);
    return unwrapData<{ success?: boolean }>(response);
  },
};

