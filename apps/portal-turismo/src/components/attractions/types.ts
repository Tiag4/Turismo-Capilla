export type AttractionCategory =
  | 'todos'
  | 'trekking'
  | 'balneario'
  | 'rocas'
  | 'mirador'
  | 'cultura';

export type AttractionDifficulty = 'Baja' | 'Media' | 'Alta';

export interface AttractionTrailSpecs {
  elevationGainMeters?: number;
  maxElevationMsnm?: number;
  distanceKm?: number;
  trailType?: 'Ida y vuelta' | 'Circuito cerrado' | 'Paseo urbano';
  estimatedDuration: string;
  terrainType?: string;
  guideRequired?: boolean;
}

export interface AttractionPracticalInfo {
  openingHours: string;
  cutoffTime?: string;
  admissionFee: string;
  parking: string;
  accessHowTo: string;
  hydrationRequirement: string;
  recommendedGear: string[];
  safetyWarnings: string[];
}

export interface AttractionItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: AttractionCategory;
  categoryLabel: string;
  difficulty: AttractionDifficulty;
  rating: number;
  reviewCount: number;
  coverImage: string;
  galleryImages: string[];
  distanceFromCenter: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  overview: string;
  highlights: string[];
  trailSpecs: AttractionTrailSpecs;
  practicalInfo: AttractionPracticalInfo;
  isTrekking: boolean;
  ctaUrl: string;
}

export interface AttractionFilterState {
  search: string;
  category: AttractionCategory;
  difficulty: 'todos' | AttractionDifficulty;
  sortBy: 'popular' | 'cercania' | 'dificultad';
}
