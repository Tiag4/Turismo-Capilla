import { apiClient } from './api.client';
import type {
  EmergencySanitaryConfig,
  PharmacyDutyRecord,
  HealthGuardNotice,
  CreateOrUpdatePharmacyDto,
} from '../types/pharmacyDuty.types';

export const EMERGENCY_SANITARY_STORAGE_KEY = 'turismo_capilla_emergency_sanitary';
export const EMERGENCY_SANITARY_EVENT = 'turismo_capilla_emergency_sanitary_updated';

export const DEFAULT_EMERGENCY_SANITARY_CONFIG: EmergencySanitaryConfig = {
  pharmacies: [
    {
      id: 'pharmacy-pasteur',
      name: 'Farmacia Pasteur',
      address: 'Diagonal Buenos Aires 45',
      phone: '+54 3548 48-1250',
      whatsapp: '+54 9 3548 481250',
      dutyHours: 'Guardia 24 Horas',
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      isOnDutyToday: true,
      notes: 'Atención nocturna por ventanilla permanente sobre Diagonal Buenos Aires.',
      googleMapsUrl: 'https://maps.google.com/?q=Diagonal+Buenos+Aires+45,+Capilla+del+Monte',
    },
    {
      id: 'pharmacy-capilla',
      name: 'Farmacia Capilla',
      address: 'Pueyrredón 210',
      phone: '+54 3548 48-2100',
      whatsapp: '+54 9 3548 482100',
      dutyHours: '08:30 a 13:00 y 16:30 a 21:00 hs',
      isOnDutyToday: false,
      notes: 'A 50 metros de Plaza San Martín y Calle Techada.',
      googleMapsUrl: 'https://maps.google.com/?q=Pueyrredon+210,+Capilla+del+Monte',
    },
    {
      id: 'pharmacy-del-valle',
      name: 'Farmacia del Valle',
      address: 'Deán Funes 320',
      phone: '+54 3548 48-1800',
      whatsapp: '+54 9 3548 481800',
      dutyHours: '08:30 a 13:00 y 17:00 a 21:30 hs',
      isOnDutyToday: false,
      notes: 'A 2 cuadras del Hospital Municipal Dr. Amancio Rodríguez.',
      googleMapsUrl: 'https://maps.google.com/?q=Dean+Funes+320,+Capilla+del+Monte',
    },
    {
      id: 'pharmacy-san-antonio',
      name: 'Farmacia San Antonio',
      address: 'Hipólito Yrigoyen 412',
      phone: '+54 3548 48-1555',
      dutyHours: '09:00 a 13:00 y 17:00 a 21:00 hs',
      isOnDutyToday: false,
      notes: 'Frente a la Terminal de Ómnibus de Capilla del Monte.',
      googleMapsUrl: 'https://maps.google.com/?q=Hipolito+Yrigoyen+412,+Capilla+del+Monte',
    },
  ],
  healthGuard: {
    id: 'hospital-amancio-rodriguez',
    facilityName: 'Hospital Municipal Dr. Amancio Rodríguez',
    emergencyPhone: '107',
    directPhone: '+54 3548 481232',
    address: 'Deán Funes 530',
    activeGuards: [
      'Guardia Médica Clínica Permanente (24 Horas)',
      'Shock Room de Traumatología y Urgencias',
      'Provisión Inmediata de Suero Antiofídico y Antiescorpiónico',
      'Guardia Pediátrica de Refuerzo',
    ],
    specialNotice:
      'Guardia médica activa las 24 horas todos los días del año. Ante mordeduras de ofidios o picaduras de alacrán, no realizar torniquetes y concurrir inmediatamente a la guardia.',
    updatedAt: new Date().toISOString(),
  },
  lastUpdated: new Date().toISOString(),
};

function readFallbackStorage(): EmergencySanitaryConfig {
  if (typeof window === 'undefined') return DEFAULT_EMERGENCY_SANITARY_CONFIG;
  try {
    const raw = localStorage.getItem(EMERGENCY_SANITARY_STORAGE_KEY);
    if (!raw) return DEFAULT_EMERGENCY_SANITARY_CONFIG;
    const parsed = JSON.parse(raw) as EmergencySanitaryConfig;
    if (!parsed?.pharmacies || !parsed?.healthGuard) {
      return DEFAULT_EMERGENCY_SANITARY_CONFIG;
    }
    return parsed;
  } catch {
    return DEFAULT_EMERGENCY_SANITARY_CONFIG;
  }
}

function syncCache(config: EmergencySanitaryConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EMERGENCY_SANITARY_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent(EMERGENCY_SANITARY_EVENT, { detail: config }));
  } catch {
    // Ignore storage sync errors
  }
}

export const pharmacyDutyService = {
  async getConfig(): Promise<EmergencySanitaryConfig> {
    try {
      const data = await apiClient.get<EmergencySanitaryConfig>('/emergency-sanitary');
      syncCache(data);
      return data;
    } catch (e) {
      console.warn('No se pudo conectar al endpoint /emergency-sanitary, usando caché:', e);
      return readFallbackStorage();
    }
  },

  async getPharmacyById(id: string): Promise<PharmacyDutyRecord | null> {
    const config = await this.getConfig();
    return config.pharmacies.find((p) => p.id === id) || null;
  },

  async setPharmacyOnDuty(
    pharmacyId: string,
    validFrom?: string,
    validTo?: string
  ): Promise<EmergencySanitaryConfig> {
    const data = await apiClient.put<EmergencySanitaryConfig>(
      `/emergency-sanitary/pharmacies/${pharmacyId}/on-duty`,
      { validFrom, validTo }
    );
    syncCache(data);
    return data;
  },

  async savePharmacy(dto: CreateOrUpdatePharmacyDto): Promise<EmergencySanitaryConfig> {
    const data = await apiClient.post<EmergencySanitaryConfig>(
      '/emergency-sanitary/pharmacies',
      dto
    );
    syncCache(data);
    return data;
  },

  async deletePharmacy(pharmacyId: string): Promise<EmergencySanitaryConfig> {
    const data = await apiClient.delete<EmergencySanitaryConfig>(
      `/emergency-sanitary/pharmacies/${pharmacyId}`
    );
    syncCache(data);
    return data;
  },

  async updateHealthGuardNotice(
    notice: Partial<HealthGuardNotice>
  ): Promise<EmergencySanitaryConfig> {
    const data = await apiClient.put<EmergencySanitaryConfig>(
      '/emergency-sanitary/health-guard',
      notice
    );
    syncCache(data);
    return data;
  },
};
