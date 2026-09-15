export type HikerPace = 'relaxed' | 'moderate' | 'sport';

export interface TrailPoint {
  distanceKm: number;
  elevationMsnm: number;
}

export interface Checkpoint {
  id: string;
  title: string;
  elevationMsnm: number;
  distanceKm: number;
  description: string;
  keyAdvice: string;
  features: string[];
  imageUrl: string;
  cutoffTimeNotice?: string;
  gradientPct: number;
}

export interface TrekkingTelemetry {
  currentKm: number;
  elevationMsnm: number;
  elevationGainM: number;
  estimatedTempC: number;
  ascentTimeHours: number;
  ascentTimeMinutes: number;
  activeCheckpoint: Checkpoint;
  isCutoffZone: boolean;
}
