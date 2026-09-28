export type SeasonType = 'HIGH' | 'MEDIUM' | 'LOW' | 'SPECIAL_EVENT';

export interface TourismSeason {
  id: string;
  name: string;
  type: SeasonType;
  startDate: string;
  endDate: string;
  suggestedMultiplier: number;
  description?: string;
  isActive: boolean;
}

export interface CreateSeasonDto {
  name: string;
  type: SeasonType;
  startDate: string;
  endDate: string;
  suggestedMultiplier: number;
  description?: string;
}
