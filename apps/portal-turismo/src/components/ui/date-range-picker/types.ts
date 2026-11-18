export interface BlockedDateRange {
  startDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
}

export interface DateRangePickerProps {
  checkIn: string; // ISO YYYY-MM-DD
  checkOut: string; // ISO YYYY-MM-DD
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
  minDate?: string; // ISO YYYY-MM-DD (defaults to today)
  minNights?: number;
  blockedRanges?: BlockedDateRange[];
  className?: string;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  checkInLabel?: string;
  checkOutLabel?: string;
}

export type FocusedRangeInput = 'checkIn' | 'checkOut';
