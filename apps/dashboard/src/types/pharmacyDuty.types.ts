export interface PharmacyDutyRecord {
  id: string;
  name: string;
  address: string;
  phone: string;
  whatsapp?: string;
  dutyHours: string; // ej: "Guardia 24 Horas" o "08:30 a 13:00 y 16:30 a 21:00 hs"
  validFrom?: string; // YYYY-MM-DD
  validTo?: string; // YYYY-MM-DD
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

export type CreateOrUpdatePharmacyDto = Omit<PharmacyDutyRecord, 'id'> & {
  id?: string;
};
