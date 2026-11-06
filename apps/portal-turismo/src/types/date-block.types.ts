export interface DateBlockRange {
  id: string;
  accommodationId: string;
  startDate: string;
  endDate: string;
  reason?: 'MAINTENANCE' | 'PERSONAL_USE' | 'SEASON_CLOSED';
  notes?: string | null;
}
