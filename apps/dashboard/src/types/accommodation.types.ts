export type AccommodationType = 'CABIN' | 'HOTEL' | 'APARTMENT' | 'HOSTEL' | 'CAMPING';

export interface AccommodationImage {
  id: string;
  url: string;
  publicId?: string;
  isMain: boolean;
}

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  type: AccommodationType;
  address: string;
  locality: string;
  latitude?: number | null;
  longitude?: number | null;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  isActive: boolean;
  images: AccommodationImage[];
  hostId: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAccommodationDto {
  name: string;
  description: string;
  type: AccommodationType;
  address: string;
  locality?: string;
  latitude?: number | null;
  longitude?: number | null;
  pricePerNight: number;
  maxGuests: number;
  amenities: string[];
  images?: string[] | AccommodationImage[];
}

