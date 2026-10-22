import { apiClient } from './api.client.ts';
import type { Alert, CreateOrUpdateAlertDto } from '../types/alert.types.ts';

const MOCK_ALERTS: Alert[] = [
  {
    id: 'mock-alert-1',
    title: 'Alerta Meteorológica: Riesgo Extremo de Incendios Forestales',
    message: 'Rige índice extremo por vientos intensos y baja humedad relativa. Prohibido hacer fuego en todo el ejido municipal y zonas agrestes de Capilla del Monte.',
    severity: 'DANGER',
    linkUrl: 'https://capilladelmonte.gov.ar/defensa-civil',
    linkText: 'Protocolo de Prevención y Teléfonos de Emergencia',
    isActive: true,
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
];

export const alertsService = {
  async getAll(): Promise<Alert[]> {
    try {
      return await apiClient.get<Alert[]>('/alerts');
    } catch (err) {
      console.warn('Backend unavailable, using mock alerts:', err);
      return MOCK_ALERTS;
    }
  },

  async getById(id: string): Promise<Alert | null> {
    try {
      return await apiClient.get<Alert>(`/alerts/${id}`);
    } catch {
      const all = await this.getAll();
      return all.find((a) => a.id === id) || null;
    }
  },

  async getActive(): Promise<Alert | null> {
    try {
      return await apiClient.get<Alert>('/alerts/active');
    } catch {
      return MOCK_ALERTS.find((a) => a.isActive) || null;
    }
  },

  async create(dto: CreateOrUpdateAlertDto): Promise<Alert> {
    try {
      return await apiClient.post<Alert>('/alerts', dto);
    } catch (err) {
      console.warn('Backend unavailable, creating in mock alerts:', err);
      const newAlert: Alert = {
        id: `mock-alert-${Date.now()}`,
        title: dto.title,
        message: dto.message,
        severity: dto.severity,
        linkUrl: dto.linkUrl,
        linkText: dto.linkText,
        isActive: dto.isActive ?? true,
        expiresAt: dto.expiresAt,
        createdAt: new Date().toISOString(),
      };
      if (newAlert.isActive) {
        MOCK_ALERTS.forEach((a) => (a.isActive = false));
      }
      MOCK_ALERTS.unshift(newAlert);
      return newAlert;
    }
  },

  async update(id: string, dto: CreateOrUpdateAlertDto): Promise<Alert> {
    try {
      return await apiClient.put<Alert>(`/alerts/${id}`, dto);
    } catch (err) {
      console.warn('Backend unavailable, updating mock alert:', err);
      const idx = MOCK_ALERTS.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (dto.isActive) {
          MOCK_ALERTS.forEach((a) => (a.isActive = false));
        }
        MOCK_ALERTS[idx] = {
          ...MOCK_ALERTS[idx],
          ...dto,
          isActive: dto.isActive ?? MOCK_ALERTS[idx].isActive,
        };
        return MOCK_ALERTS[idx];
      }
      throw err;
    }
  },

  async toggleStatus(id: string, isActive: boolean): Promise<Alert> {
    try {
      return await apiClient.patch<Alert>(`/alerts/${id}/status?isActive=${isActive}`, {});
    } catch (err) {
      console.warn('Backend unavailable, toggling mock alert status:', err);
      const idx = MOCK_ALERTS.findIndex((a) => a.id === id);
      if (idx !== -1) {
        if (isActive) {
          MOCK_ALERTS.forEach((a) => (a.isActive = false));
        }
        MOCK_ALERTS[idx].isActive = isActive;
        return MOCK_ALERTS[idx];
      }
      throw err;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/alerts/${id}`);
    } catch (err) {
      console.warn('Backend unavailable, deleting mock alert:', err);
      const idx = MOCK_ALERTS.findIndex((a) => a.id === id);
      if (idx !== -1) {
        MOCK_ALERTS.splice(idx, 1);
      }
    }
  },
};
