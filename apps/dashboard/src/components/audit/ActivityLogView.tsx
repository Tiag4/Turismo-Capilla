import React from 'react';
import { ShieldCheck, Search, Filter } from 'lucide-react';
import { useAdminLogs } from '../../hooks/useAdminLogs.ts';
import { ActivityLogItem } from './ActivityLogItem.tsx';
import { Select } from '../ui/Select.tsx';
import type { AuditActionType } from '../../types/audit.types.ts';

export const ActivityLogView: React.FC = () => {
  const {
    logs,
    isLoading,
    actionType,
    setActionType,
    searchQuery,
    setSearchQuery,
  } = useAdminLogs();

  const actionOptions: { value: AuditActionType | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Todos los eventos' },
    { value: 'ACCOMMODATION_AUDITED', label: 'Auditorías de Habilitación' },
    { value: 'TOKEN_GENERATED', label: 'Emisión de Tokens' },
    { value: 'TOKEN_REVOKED', label: 'Revocación de Tokens' },
    { value: 'HOST_APPROVED', label: 'Altas de Prestadores' },
    { value: 'CALENDAR_UPDATED', label: 'Cambios de Temporada' },
    { value: 'ACCOMMODATION_SUSPENDED', label: 'Pausas / Suspensiones' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-sand-900 font-['Outfit']">
          Auditoría de Actividad y Registro de Cambios
        </h1>
        <p className="text-xs sm:text-sm text-sand-500 mt-0.5">
          Trazabilidad cronológica inmutable de acciones administrativas y dictámenes municipales.
        </p>
      </div>

      {/* Filters Toolbar — unboxed */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-sand-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por prestador, operador municipal o palabra clave..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-sand-300 bg-white focus:outline-none focus:border-emerald-600 shadow-xs transition-colors"
          />
        </div>

        {/* Action Type Filter */}
        <div className="w-full sm:w-64 shrink-0 flex items-center gap-2">
          <Filter className="w-4 h-4 text-sand-400 shrink-0 hidden sm:block" />
          <Select
            value={actionType}
            onChange={(e) => setActionType(e.target.value as AuditActionType | 'ALL')}
            options={actionOptions}
          />
        </div>
      </div>

      {/* Events Feed */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-sand-500">
          Cargando registros de auditoría municipal...
        </div>
      ) : logs.length === 0 ? (
        <div className="py-16 text-center border-y border-sand-200 flex flex-col items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-sand-400" />
          <p className="text-sm font-semibold text-sand-900">
            No se encontraron eventos para los filtros seleccionados.
          </p>
          <span className="text-xs text-sand-500">
            Probá ajustando el término de búsqueda o seleccionando otro tipo de acción.
          </span>
        </div>
      ) : (
        <div className="border-y border-sand-300 divide-y divide-sand-200">
          {logs.map((event) => (
            <ActivityLogItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
