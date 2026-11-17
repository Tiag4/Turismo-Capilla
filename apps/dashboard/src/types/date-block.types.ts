export type DateBlockReason = 'MAINTENANCE' | 'PERSONAL_USE' | 'SEASON_CLOSED';

export const DATE_BLOCK_REASON_LABELS: Record<DateBlockReason, string> = {
  MAINTENANCE: 'Mantenimiento o Refacciones',
  PERSONAL_USE: 'Uso Propio / Familiar',
  SEASON_CLOSED: 'Cerrado por Temporada',
};

export interface DateBlock {
  id: string;
  accommodationId: string;
  accommodationName: string;
  roomTypeId?: string;
  roomTypeName?: string;
  unitsBlocked?: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: DateBlockReason;
  notes?: string;
  createdAt: string;
}

export interface CreateDateBlockDto {
  accommodationId: string;
  accommodationName: string;
  roomTypeId?: string;
  unitsBlocked?: number;
  startDate: string;
  endDate: string;
  reason: DateBlockReason;
  notes?: string;
}
