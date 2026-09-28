export interface AccommodationPricingScheme {
  accommodationId: string;
  basePricePerNight: number;
  highSeasonPricePerNight: number;
  longWeekendPricePerNight: number;
  minNightsBase: number;
  minNightsHighSeason: number;
  minNightsLongWeekend: number;
  highSeasonStartMonth: number; // 1-12
  highSeasonEndMonth: number; // 1-12
  updatedAt: string;
}

export type PricingSeasonType = 'BASE' | 'HIGH_SEASON' | 'LONG_WEEKEND';
