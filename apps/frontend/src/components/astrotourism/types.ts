export interface NightPhase {
  id: string;
  timeLabel: string;
  hour: number;
  title: string;
  subtitle: string;
  description: string;
  skyColors: {
    top: string;
    mid: string;
    horizon: string;
    glow: string;
  };
  visibleConstellation: string;
  celestialEvent: string;
  darknessLevel: string;
  recommendedActivity: string;
}

export interface StargazingSpot {
  id: string;
  title: string;
  altitudeMsnm: number;
  bortleClass: string;
  accessibility: string;
  description: string;
  features: string[];
}
