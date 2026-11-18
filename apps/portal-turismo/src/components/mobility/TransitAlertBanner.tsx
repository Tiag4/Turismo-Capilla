import React from 'react';
import { AlertTriangle, Info, AlertOctagon, Clock } from 'lucide-react';
import type { TransitAlertConfig } from './types/mobility.types';

export interface TransitAlertBannerProps {
  alert: TransitAlertConfig;
}

export const TransitAlertBanner: React.FC<TransitAlertBannerProps> = ({ alert }) => {
  if (!alert.active) return null;

  const severityStyles = {
    info: {
      container: 'bg-sky-50/90 border-sky-300 text-sky-950',
      badge: 'bg-sky-100 text-sky-800 border-sky-300',
      icon: Info,
      iconColor: 'text-sky-600',
      badgeText: 'Información de Tránsito',
    },
    warning: {
      container: 'bg-amber-50/90 border-amber-300 text-amber-950',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      badgeText: 'Precaución en Rutas',
    },
    danger: {
      container: 'bg-rose-50/90 border-rose-300 text-rose-950',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: AlertOctagon,
      iconColor: 'text-rose-600',
      badgeText: 'Alerta / Restricción Vial',
    },
  }[alert.severity || 'info'];

  const IconComponent = severityStyles.icon;

  const formattedDate = alert.updatedAt
    ? new Date(alert.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div
      role="alert"
      className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4 transition-all animate-in fade-in duration-300 ${severityStyles.container}`}
    >
      <div className={`p-2.5 rounded-xl bg-white/80 shrink-0 ${severityStyles.iconColor} shadow-2xs`}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide border ${severityStyles.badge}`}>
            {severityStyles.badgeText}
          </span>
          <h3 className="text-sm sm:text-base font-bold font-display">{alert.title}</h3>
        </div>
        <p className="text-xs sm:text-sm leading-relaxed opacity-90 font-medium">
          {alert.message}
        </p>
      </div>

      {formattedDate && (
        <div className="flex items-center gap-1 text-[11px] opacity-75 shrink-0 self-start sm:self-center font-semibold">
          <Clock className="w-3.5 h-3.5" />
          <span>Actualizado {formattedDate} hs</span>
        </div>
      )}
    </div>
  );
};
