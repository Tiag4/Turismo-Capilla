import { apiClient } from './api.client.ts';
import type { AuditEvent, AuditLogFilter } from '../types/audit.types.ts';

const MOCK_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'log-1',
    actionType: 'ACCOMMODATION_AUDITED',
    description: 'Inspección técnica municipal aprobada con constancia de matafuegos ABC y plano de evacuación al día.',
    operatorName: 'Juan Cruz Larcher',
    operatorEmail: 'admin@capilladelmonte.gov.ar',
    targetEntity: 'Cabañas Pircas del Uritorco',
    targetId: 'acc-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    details: 'Dictamen: Habilitado Oficial. Checklist de seguridad 5/5 verificado en predio.',
  },
  {
    id: 'log-2',
    actionType: 'TOKEN_REVOKED',
    description: 'Revocación preventiva de token de invitación antes de registro.',
    operatorName: 'Juan Cruz Larcher',
    operatorEmail: 'admin@capilladelmonte.gov.ar',
    targetEntity: 'complejo.irregular@yahoo.com.ar',
    targetId: 'inv-992',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    details: 'Motivo: Inmueble con expediente comercial clausurado por edificación en zona de riesgo hídrico.',
  },
  {
    id: 'log-3',
    actionType: 'TOKEN_GENERATED',
    description: 'Emisión de token de seguridad institucional para prestador adherido.',
    operatorName: 'Comisión Turismo',
    operatorEmail: 'turismo@capilladelmonte.gov.ar',
    targetEntity: 'complejo.lasgemelas@gmail.com',
    targetId: 'inv-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    details: 'Token CAP-INV-9921-X8F generado con vencimiento a 7 días.',
  },
  {
    id: 'log-4',
    actionType: 'HOST_APPROVED',
    description: 'Alta de prestador formal y verificación de titularidad dominial.',
    operatorName: 'Secretaría de Gobierno',
    operatorEmail: 'gobierno@capilladelmonte.gov.ar',
    targetEntity: 'Roberto Uritorco (Hostería San Esteban)',
    targetId: 'host-01',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: 'Padrón de prestadores turísticos Nº 2026-084.',
  },
  {
    id: 'log-5',
    actionType: 'CALENDAR_UPDATED',
    description: 'Parámetros de Temporada Alta y Encuentro Ovni actualizados en el calendario oficial.',
    operatorName: 'Juan Cruz Larcher',
    operatorEmail: 'admin@capilladelmonte.gov.ar',
    targetEntity: 'Calendario Oficial 2026/2027',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    details: 'Período 01/01/2027 al 28/02/2027 tipificado como Temporada Alta.',
  },
  {
    id: 'log-6',
    actionType: 'ACCOMMODATION_SUSPENDED',
    description: 'Pausa transitoria de publicación por remodelación de techos y ampliación de cocheras.',
    operatorName: 'Inspectoría Técnica',
    operatorEmail: 'inspectores@capilladelmonte.gov.ar',
    targetEntity: 'Refugio Los Alazanes',
    targetId: 'acc-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    details: 'Suspensión temporal solicitada por el titular hasta finalización de obra.',
  },
];

let localLogs = [...MOCK_AUDIT_LOGS];

export const auditService = {
  async getLogs(filter?: AuditLogFilter): Promise<AuditEvent[]> {
    try {
      const response = await apiClient.get<any>('/audit/logs');
      const items = Array.isArray(response) ? response : response.data || [];
      if (items.length > 0) return items;
      return filterLogs(localLogs, filter);
    } catch {
      return filterLogs(localLogs, filter);
    }
  },

  async appendLog(log: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const newLog: AuditEvent = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    localLogs = [newLog, ...localLogs];
    return newLog;
  },
};

function filterLogs(logs: AuditEvent[], filter?: AuditLogFilter): AuditEvent[] {
  let result = [...logs];
  if (filter?.actionType && filter.actionType !== 'ALL') {
    result = result.filter((l) => l.actionType === filter.actionType);
  }
  if (filter?.searchQuery && filter.searchQuery.trim()) {
    const query = filter.searchQuery.toLowerCase();
    result = result.filter(
      (l) =>
        l.description.toLowerCase().includes(query) ||
        l.targetEntity.toLowerCase().includes(query) ||
        l.operatorName.toLowerCase().includes(query)
    );
  }
  return result;
}
