import type { Accommodation } from './accommodation.types.ts';

export interface ProviderUser {
  id: string;
  email: string;
  name: string;
  lastName: string;
  phone?: string;
  role: 'HOST';
  isActive: boolean;
  accommodationsCount?: number;
  accommodations?: Accommodation[];
  createdAt: string;
  updatedAt?: string;
}
