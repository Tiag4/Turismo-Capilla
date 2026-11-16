import React from 'react';
import {
  ShieldCheck,
  Ban,
  KeyRound,
  UserCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import type { AuditEvent, AuditActionType } from '../../types/audit.types.ts';

export interface ActivityLogItemProps {
  event: AuditEvent;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({ event }) => {
  const config: Record<
    AuditActionType,
    { label: string; bgBadge: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    ACCOMMODATION_AUDITED: {
      label: 'Auditoría Aprobada',
      bgBadge: 'bg-[#005530] text-white',
      icon: ShieldCheck,
    },
    TOKEN_REVOKED: {
      label: 'Token Revocado',
      bgBadge: 'bg-rose-700 text-white',
      icon: Ban,
    },
    TOKEN_GENERATED: {
      label: 'Token Emitido',
      bgBadge: 'bg-amber-600 text-white',
      icon: KeyRound,
    },
    HOST_APPROVED: {
      label: 'Prestador Habilitado',
      bgBadge: 'bg-[var(--color-emerald-portal-600)] text-white',
      icon: UserCheck,
    },
    CALENDAR_UPDATED: {
      label: 'Temporada Modificada',
      bgBadge: 'bg-[var(--color-terracotta-500)] text-white',
      icon: Calendar,
    },
    ACCOMMODATION_SUSPENDED: {
      label: 'Alojamiento Pausado',
      bgBadge: 'bg-zinc-700 text-white',
      icon: AlertTriangle,
    },
  };

  const current = config[event.actionType] || {
    label: event.actionType,
    bgBadge: 'bg-zinc-700 text-white',
    icon: ShieldCheck,
  };
  const Icon = current.icon;

  const formattedDate = new Date(event.timestamp).toLocaleString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="py-3.5 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-sand-100/60 transition-colors">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-sand-200/60 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-sand-800" />
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${current.bgBadge}`}>
              {current.label}
            </span>
            <span className="text-xs font-bold text-sand-900 font-['Outfit']">
              {event.targetEntity}
            </span>
          </div>

          <p className="text-xs text-sand-700 leading-relaxed">
            {event.description}
          </p>

          {event.details && (
            <div className="mt-1 text-[11px] font-medium text-sand-600 border-l-2 border-sand-400 pl-2">
              {event.details}
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-sand-200 w-full sm:w-auto">
        <span className="text-xs font-semibold text-sand-900 block">
          {event.operatorName}
        </span>
        <span className="text-[11px] text-sand-500">
          {formattedDate}
        </span>
      </div>
    </div>
  );
};
