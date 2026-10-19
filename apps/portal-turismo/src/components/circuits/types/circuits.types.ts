export type CircuitId = 'mistico' | 'sabores' | 'aventura';

export interface CircuitSpot {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  energyAttribute?: string;
  recommendations: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  badge: string;
  bestTime?: string;
}

export interface GastronomicVenue {
  id: string;
  name: string;
  category: 'chacinados' | 'reposteria' | 'trucha' | 'cabrito' | 'miel' | 'cerveceria';
  categoryLabel: string;
  specialty: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export interface AdventureActivity {
  id: string;
  title: string;
  modality: 'parapente' | 'rappel' | 'espeleologia' | 'astroturismo';
  modalityLabel: string;
  location: string;
  difficulty: 'Baja' | 'Media' | 'Alta';
  duration: string;
  description: string;
  suggestedGear: string[];
  safetyRequirements: string[];
  certifiedProviders: {
    name: string;
    contact: string;
    certificationBadge: string;
  }[];
  coordinates: {
    lat: number;
    lng: number;
  };
}
