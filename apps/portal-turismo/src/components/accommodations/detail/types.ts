import type { MapPlace } from '../../../data/mock-places';

export interface BedroomInfo {
  name: string;
  beds: string;
  description: string;
}

export interface AmenityItem {
  label: string;
  iconName: 'wifi' | 'flame' | 'waves' | 'car' | 'coffee' | 'trees' | 'shield' | 'wind' | 'tv' | 'utensils';
}

export interface AmenityCategory {
  category: string;
  items: AmenityItem[];
}

export interface UnitDetails {
  title: string;
  capacityText: string;
  maxAdults: number;
  maxChildren: number;
  bedrooms: {
    roomName: string;
    bedDetails: string;
    isDouble?: boolean;
  }[];
  features: string[];
}

export interface AccommodationDetailData extends MapPlace {
  gallery: string[];
  fullDescription: string[];
  host: {
    name: string;
    avatarUrl: string;
    badgeText: string;
    responseTime: string;
    yearsHosting: number;
    verified: boolean;
  };
  bedrooms: BedroomInfo[];
  amenityCategories: AmenityCategory[];
  rules: {
    checkIn: string;
    checkOut: string;
    petPolicy: string;
    quietHours: string;
    cancellation: string;
  };
  depositPercent: number;
  unitDetails: UnitDetails;
}

export type ReviewAspect =
  | 'Limpieza impecable'
  | 'Atención del anfitrión'
  | 'Tranquilidad serrana'
  | 'Comodidades y equipamiento'
  | 'Ubicación y vistas'
  | 'Relación precio-calidad';

export interface ReviewItem {
  id: string;
  accommodationId: string;
  authorName: string;
  authorOrigin?: string;
  stayDate: string;
  rating: number;
  comment: string;
  aspects: ReviewAspect[];
  verifiedBooking: boolean;
  bookingCode?: string;
  createdAt: string;
}

