import type { Booking, BookingCreateDTO, BookingUpdateDTO } from '@/DATA_TYPES/booking';
import { useFetch, useMutate } from '@/src/hooks/useFetch';
import { queryClient } from '@/src/lib/query-client';
import { bookingsApi } from '../api/bookings.api';

export function useBookings() {
  return useFetch<Booking[]>(
    ['bookings', 'all'],
    () => bookingsApi.getBookings(),
    {
      staleTime: 30 * 1000,
    }
  );
}

export function useBooking(bookingId: string | null | undefined) {
  return useFetch<Booking>(
    ['bookings', bookingId],
    () => bookingsApi.getBookingById(String(bookingId)),
    {
      enabled: Boolean(bookingId),
    }
  );
}

export function useCreateBooking() {
  return useMutate<Booking, Error, BookingCreateDTO>(
    (payload) => bookingsApi.createBooking(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      },
    }
  );
}

export function useUpdateBooking() {
  return useMutate<Booking, Error, { bookingId: string; payload: BookingUpdateDTO }>(
    ({ bookingId, payload }) => bookingsApi.updateBooking(bookingId, payload),
    {
      onSuccess: (_, { bookingId }) => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
      },
    }
  );
}

export function useDeleteBooking() {
  return useMutate<{ success?: boolean }, Error, { bookingId: string }>(
    ({ bookingId }) => bookingsApi.deleteBooking(bookingId),
    {
      onSuccess: (_, { bookingId }) => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
        queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
      },
    }
  );
}
