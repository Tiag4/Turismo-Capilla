export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingItem {
  id: string;
  roomTypeId: string;
  roomTypeName?: string;
  ratePlanId?: string;
  ratePlanName?: string;
  quantity: number;
  guests: number;
  pricePerNight: number;
  subtotal: number;
}

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
  accommodationName?: string;
  accommodation?: {
    id: string;
    name: string;
    locality?: string;
  };
  items?: BookingItem[];
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  remainingBalance?: number;
  bankAccountHolder?: string;
  bankCbu?: string;
  bankAlias?: string;
  bankName?: string;
  createdAt: string;
  updatedAt?: string;
}
