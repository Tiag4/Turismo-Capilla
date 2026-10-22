export interface PharmacyDutyRecord {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  dutyHours: string;
  validFrom?: string;
  validTo?: string;
  isOnDutyToday: boolean;
  notes?: string;
  googleMapsUrl?: string;
}

export interface HealthGuardNotice {
  id: string;
  facilityName: string;
  emergencyPhone: string;
  directPhone: string;
  address: string;
  activeGuards: string[];
  specialNotice?: string;
  updatedAt: string;
}

export interface EmergencySanitaryConfig {
  pharmacies: PharmacyDutyRecord[];
  healthGuard: HealthGuardNotice;
  lastUpdated: string;
}
