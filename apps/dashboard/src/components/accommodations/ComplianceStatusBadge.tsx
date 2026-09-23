import React from 'react';
import { ShieldCheck, AlertTriangle, XCircle, Clock } from 'lucide-react';
import type { ComplianceStatus } from '../../types/accommodation.types.ts';

export interface ComplianceStatusBadgeProps {
  status?: ComplianceStatus;
}

export const ComplianceStatusBadge: React.FC<ComplianceStatusBadgeProps> = ({ status }) => {
  // Anti-vibecoded Rule 27: Badges MUST have 100% solid, opaque backgrounds and high contrast text.
  // WCAG 2.1 AA compliant.
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
