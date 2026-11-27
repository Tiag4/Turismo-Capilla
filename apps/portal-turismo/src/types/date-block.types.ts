export interface DateBlockRange {
  id: string;
  accommodationId: string;
  startDate: string;
  endDate: string;
  reason?: 'MAINTENANCE' | 'PERSONAL_USE' | 'SEASON_CLOSED' | 'BOOKED' | 'PREPARATION' | string;
  type?: 'BOOKING' | 'DATE_BLOCK' | 'PREPARATION' | string;
  roomTypeId?: string | null;
  notes?: string | null;
}
