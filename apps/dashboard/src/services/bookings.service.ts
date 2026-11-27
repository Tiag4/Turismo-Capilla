import { apiClient } from './api.client.ts';
import type { Booking, BookingStatus } from '../types/booking.types.ts';

export const bookingsService = {
  async getMyBookings(): Promise<Booking[]> {
    return apiClient.get<Booking[]>('/bookings/my-bookings');
  },

  async resendVoucher(id: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>(`/bookings/${id}/resend-voucher`, {});
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    return apiClient.patch<Booking>(`/bookings/${id}/status`, { status });
  },
};
