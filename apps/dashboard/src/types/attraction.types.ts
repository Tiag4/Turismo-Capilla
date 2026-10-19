export type AttractionCategory = 'HILL' | 'RIVER_BEACH' | 'CULTURAL' | 'NIGHT' | 'NATURE_TRAIL';

export type AttractionDifficulty = 'BAJA' | 'MEDIA' | 'ALTA';

export type AttractionStatus = 'OPEN' | 'WEATHER_RESTRICTED' | 'CLOSED';

export interface AttractionImage {
  id?: string;
  url: string;
  publicId?: string;
  createdAt?: string;
}

export interface Attraction {
  id: string;
  name: string;
  description?: string;
  category: AttractionCategory;
  difficulty?: string;
  estimatedDuration?: string;
  howToGet?: string;
  requiresGuide?: boolean;
  admissionFee?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  images: AttractionImage[];
  status?: AttractionStatus;
  statusNotice?: string | null;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttractionDto {
  name: string;
  description?: string;
  category: AttractionCategory;
  difficulty?: string;
  estimatedDuration?: string;
  howToGet?: string;
  requiresGuide?: boolean;
  admissionFee?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  images?: Array<string | { url: string; publicId?: string }>;
  status?: AttractionStatus;
  statusNotice?: string | null;
  isFeatured?: boolean;
}
