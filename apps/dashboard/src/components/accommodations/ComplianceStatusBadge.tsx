import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Clock, PauseCircle } from 'lucide-react';
import type { ComplianceStatus } from '../../types/accommodation.types.ts';

export interface ComplianceStatusBadgeProps {
  status?: ComplianceStatus;
  isActive?: boolean;
}

export const ComplianceStatusBadge: React.FC<ComplianceStatusBadgeProps> = ({ status, isActive = true }) => {
  // Coherent status resolution: Prevents contradictory badges (e.g. Active + In Review)
  if (status === 'APPROVED' && !isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-800 text-white">
        <PauseCircle className="w-3 h-3 shrink-0" />
        <span>Pausado</span>
      </span>
    );
  }

  const config = {
    APPROVED: {
      label: 'Habilitado Oficial',
      className: 'bg-[#005530] text-white',
      icon: ShieldCheck,
    },
    IN_REVIEW: {
      label: 'En Revisión Técnica',
      className: 'bg-amber-600 text-white',
      icon: Clock,
    },
    REJECTED: {
      label: 'No Habilitado',
      className: 'bg-rose-700 text-white',
      icon: XCircle,
    },
  }[status || 'IN_REVIEW'] || {
    label: 'Pendiente Auditoría',
    className: 'bg-zinc-700 text-white',
    icon: AlertTriangle,
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
