export type EventCategory =
  | 'FESTIVAL'
  | 'THEATER'
  | 'MUSIC'
  | 'FAIR'
  | 'WORKSHOP'
  | 'COMMUNITY';

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  timeString: string; // e.g. "20:30 hs"
  location: string;
  isFree: boolean;
  price?: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
}

export interface CreateCulturalEventDTO {
  title: string;
  description: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  timeString: string;
  location: string;
  isFree: boolean;
  price?: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
}
