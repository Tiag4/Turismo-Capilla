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

export type InventoryMode = 'SINGLE_UNIT' | 'MULTI_ROOM';

export interface RoomTypeInventoryItem {
  id: string;
  name: string;
  description: string;
  capacityAdults: number;
  capacityChildren: number;
  maxGuests: number;
  bedsSummary: string;
  sizeSqm: number;
  pricePerNight: number;
  totalStock: number;
  availableStock: number;
  breakfastIncluded: boolean;
  amenities: string[];
  imageUrl: string;
}

export interface AccommodationDetailData extends MapPlace {
  inventoryMode: InventoryMode;
  roomTypes: RoomTypeInventoryItem[];
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

