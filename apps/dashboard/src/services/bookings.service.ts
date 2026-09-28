import { apiClient } from './api.client.ts';
import type { Booking, BookingStatus } from '../types/booking.types.ts';

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    bookingCode: 'CAP-2026-4819',
    checkIn: '2026-09-15',
    checkOut: '2026-09-18',
    totalNights: 3,
    guestCount: 3,
    pricePerNight: 85000,
    totalAmount: 255000,
    status: 'PENDING',
    guestName: 'Carolina Méndez',
    guestEmail: 'carolina.mendez@gmail.com',
    guestPhone: '+54 9 11 5543 2198',
    guestOrigin: 'Rosario, Santa Fe',
    notes: 'Llegamos a la terminal de Capilla del Monte cerca de las 14:00 hs.',
    accommodationId: 'acc-1',
    accommodation: {
      id: 'acc-1',
      name: 'Cabañas Pircas del Uritorco',
      locality: 'Capilla del Monte',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'book-2',
    bookingCode: 'CAP-2026-3902',
    checkIn: '2026-09-20',
    checkOut: '2026-09-24',
    totalNights: 4,
    guestCount: 2,
    pricePerNight: 120000,
    totalAmount: 480000,
    status: 'CONFIRMED',
    guestName: 'Esteban D’Agostino',
    guestEmail: 'esteban.dagostino@outlook.com',
    guestPhone: '+54 9 351 234 5678',
    guestOrigin: 'Córdoba Capital',
    notes: 'Venimos a hacer la cumbre nocturna del Cerro Uritorco.',
    accommodationId: 'acc-2',
    accommodation: {
      id: 'acc-2',
      name: 'Casona Histórica San Esteban',
      locality: 'Capilla del Monte',
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'book-3',
    bookingCode: 'CAP-2026-1205',
    checkIn: '2026-09-10',
    checkOut: '2026-09-12',
    totalNights: 2,
    guestCount: 2,
    pricePerNight: 65000,
    totalAmount: 130000,
    status: 'COMPLETED',
    guestName: 'Mariana Peralta',
    guestEmail: 'mariana.p@yahoo.com.ar',
    guestPhone: '+54 9 261 456 7890',
    guestOrigin: 'Mendoza',
    notes: 'Todo excelente durante la estadía.',
    accommodationId: 'acc-3',
    accommodation: {
      id: 'acc-3',
      name: 'Refugio Los Alazanes',
      locality: 'Capilla del Monte',
    },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
];

let localBookings = [...MOCK_BOOKINGS];

export const bookingsService = {
  async getMyBookings(): Promise<Booking[]> {
    try {
      const response = await apiClient.get<any>('/bookings/my-bookings');
      const items = Array.isArray(response) ? response : response.data || [];
      if (items.length > 0) return items;
      return localBookings;
    } catch {
      return localBookings;
    }
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}/status`, { status });
    } catch {
      const index = localBookings.findIndex((b) => b.id === id);
      if (index === -1) throw new Error('Reserva no encontrada');
      localBookings[index] = {
        ...localBookings[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      return localBookings[index];
    }
  },
};
