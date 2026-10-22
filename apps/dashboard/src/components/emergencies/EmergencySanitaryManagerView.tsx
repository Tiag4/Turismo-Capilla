import React, { useMemo } from 'react';
import { Building2, Clock, CheckCircle2, PhoneCall } from 'lucide-react';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { useEmergencySanitary } from '../../hooks/useEmergencySanitary.ts';
import { PharmacyDutyListCard } from './PharmacyDutyListCard.tsx';
import { HealthGuardNoticeCard } from './HealthGuardNoticeCard.tsx';

export interface EmergencySanitaryManagerViewProps {
  onNavigateCreate?: () => void;
  onNavigateEdit?: (id: string) => void;
}

export const EmergencySanitaryManagerView: React.FC<EmergencySanitaryManagerViewProps> = ({
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const {
    config,
    activeDutyPharmacy,
    isSaving,
    handleSetOnDuty,
    handleDeletePharmacy,
    handleUpdateHealthGuard,
  } = useEmergencySanitary();

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Farmacia de Turno Hoy',
      value: activeDutyPharmacy?.name ?? 'Sin asignar',
      helperText: activeDutyPharmacy?.address ?? 'Seleccionar del listado',
      icon: Building2,
      iconColor: 'text-[var(--color-emerald-portal-600)]',
    },
    {
      label: 'Horario / Modalidad',
      value: activeDutyPharmacy?.dutyHours ?? '24 Horas',
      helperText: 'Vigencia activa para turistas y vecinos',
      icon: Clock,
      iconColor: 'text-[var(--color-terracotta-500)]',
    },
    {
      label: 'Guardia Médica 107',
      value: 'Hospital Municipal',
      helperText: 'Shock Room y suero antiofídico activo',
      icon: PhoneCall,
      iconColor: 'text-[var(--color-emerald-portal-600)]',
    },
  ], [activeDutyPharmacy]);

  return (
    <div className="space-y-6">
      {/* Header — Clean title without embedded icon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] tracking-tight font-['Outfit']">
            Guardias Sanitarias & Farmacias de Turno
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Control oficial y publicación de farmacias de guardia y avisos del Hospital Municipal en el portal público.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-sand-700)]">
          <span className="w-2 h-2 rounded-full bg-[#005530] animate-pulse" />
          <span>Sincronización en Tiempo Real</span>
        </div>
      </div>

      {/* KPI Stats — Unified Stat Strip (Flat on canvas) */}
      <InlineStatStrip stats={statItems} />

      {/* Active Duty Pharmacy Notice — Focal element */}
      {activeDutyPharmacy && (
        <div className="border-l-4 border-emerald-700 bg-sand-100/40 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                Publicado en el portal oficial (/emergencias)
              </span>
            </div>
            <h2 className="text-base font-bold text-sand-900 font-['Outfit']">
              {activeDutyPharmacy.name} — {activeDutyPharmacy.address}
            </h2>
            <p className="text-xs text-sand-600">
              Teléfono de urgencia: <strong className="text-sand-900">{activeDutyPharmacy.phone}</strong>
              {activeDutyPharmacy.whatsapp && ` · WhatsApp: ${activeDutyPharmacy.whatsapp}`}
              {activeDutyPharmacy.notes && ` · "${activeDutyPharmacy.notes}"`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Visible para turistas</span>
          </div>
        </div>
      )}

      {/* Hospital Municipal Guard Notice */}
      <HealthGuardNoticeCard
        healthGuard={config.healthGuard}
        onUpdateNotice={handleUpdateHealthGuard}
        isSaving={isSaving}
      />

      {/* Pharmacy Directory & Duty Management */}
      <PharmacyDutyListCard
        pharmacies={config.pharmacies}
        onSetOnDuty={(id) => handleSetOnDuty(id)}
        onEdit={(pharmacy) => onNavigateEdit?.(pharmacy.id)}
        onDelete={handleDeletePharmacy}
        onAddNew={() => onNavigateCreate?.()}
        isSaving={isSaving}
      />
    </div>
  );
};
