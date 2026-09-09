export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  bookingCode: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  guestCount: number;
  pricePerNight: number;
  totalAmount: number;
  status: BookingStatus;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestOrigin?: string | null;
  notes?: string | null;
  accommodationId: string;
  accommodation?: {
    id: string;
    name: string;
    locality?: string;
  };
  createdAt: string;
  updatedAt?: string;
}
