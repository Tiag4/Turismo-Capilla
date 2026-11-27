export interface AstroKeyFact {
  id: string;
  label: string;
  value: string;
  detail: string;
}

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
  visualState: {
    milkyWayOpacity: number;
    starVisibility: number;
    venusVisible: boolean;
    southernCrossHighlight: boolean;
    orionVisible: boolean;
    summitBeaconVisible: boolean;
    horizonGlowSide: 'west' | 'center' | 'east';
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
  idealFor: string;
  description: string;
  features: string[];
}

export interface AstroPreparationTip {
  id: string;
  title: string;
  description: string;
  iconKey: 'jacket' | 'flashlight' | 'moon' | 'compass';
}
