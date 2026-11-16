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
  startDate: string; // ISO format: YYYY-MM-DD
  endDate?: string;   // ISO format: YYYY-MM-DD
  timeString: string; // e.g. "20:30 hs"
  location: string;  // e.g. "Predio Gabriel Suárez", "Calle Techada", "Cine Teatro Enrique Muiño"
  isFree: boolean;
  price?: number;
  imageUrl: string;
  isActive: boolean;
  isFeatured?: boolean;
}
