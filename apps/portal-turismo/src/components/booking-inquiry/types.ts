export type BookingVoucherStatus =
  | 'CONFIRMED'
  | 'PENDING_CONFIRMATION'
  | 'CANCELLED';

export interface BookingVoucherRecord {
  code: string;
  accommodationId: string;
  accommodationTitle: string;
  accommodationZone: string;
  accommodationAddress: string;
  accommodationImage: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nightsCount: number;
  adults: number;
  children: number;
  childAges?: (number | null)[];
  rooms: number;
  finalPrice: number;
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  remainingBalance?: number;
  bankAccountHolder?: string;
  bankCbu?: string;
  bankAlias?: string;
  bankName?: string;
  status: BookingVoucherStatus;
  createdAt: string;
  hostPhone?: string;
}
