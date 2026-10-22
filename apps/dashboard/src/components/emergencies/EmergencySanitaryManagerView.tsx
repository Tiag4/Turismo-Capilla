import React, { useMemo } from 'react';
import { Building2, Clock, CheckCircle2, PhoneCall } from 'lucide-react';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { useEmergencySanitary } from '../../hooks/useEmergencySanitary.ts';
import { PharmacyDutyListCard } from './PharmacyDutyListCard.tsx';
import { HealthGuardNoticeCard } from './HealthGuardNoticeCard.tsx';
import { PharmacyDutyEditorModal } from './PharmacyDutyEditorModal.tsx';

export const EmergencySanitaryManagerView: React.FC = () => {
  const {
    config,
    activeDutyPharmacy,
    isSaving,
    isEditorOpen,
    editingPharmacy,
    openCreatePharmacy,
    openEditPharmacy,
    closeEditor,
    handleSetOnDuty,
    handleSavePharmacy,
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

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[var(--color-sand-200)] text-xs font-bold text-[var(--color-sand-700)] shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#005530] animate-pulse" />
          <span>Sincronización en Tiempo Real</span>
        </div>
      </div>

      {/* KPI Stats — Unified Stat Strip */}
      <InlineStatStrip stats={statItems} />

      {/* Active Duty Pharmacy Notice Callout */}
      {activeDutyPharmacy && (
        <div className="bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#005530] text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-md tracking-wider shadow-xs">
                Publicado en el portal (/emergencias)
              </span>
            </div>
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
              {activeDutyPharmacy.name} — {activeDutyPharmacy.address}
            </h3>
            <p className="text-xs text-[var(--color-sand-600)]">
              Teléfono de urgencia: <strong className="text-[var(--color-sand-900)]">{activeDutyPharmacy.phone}</strong>
              {activeDutyPharmacy.whatsapp && ` · WhatsApp: ${activeDutyPharmacy.whatsapp}`}
              {activeDutyPharmacy.notes && ` · "${activeDutyPharmacy.notes}"`}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#005530] shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#005530]" />
            <span>Visible para turistas</span>
          </div>
        </div>
      )}

      {/* Hospital Municipal Guard Notice Card */}
      <HealthGuardNoticeCard
        healthGuard={config.healthGuard}
        onUpdateNotice={handleUpdateHealthGuard}
        isSaving={isSaving}
      />

      {/* Pharmacy Directory & Duty Management Card */}
      <PharmacyDutyListCard
        pharmacies={config.pharmacies}
        onSetOnDuty={(id) => handleSetOnDuty(id)}
        onEdit={openEditPharmacy}
        onDelete={handleDeletePharmacy}
        onAddNew={openCreatePharmacy}
        isSaving={isSaving}
      />

      {/* Create / Edit Pharmacy Modal */}
      <PharmacyDutyEditorModal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        onSave={handleSavePharmacy}
        pharmacy={editingPharmacy}
        isSaving={isSaving}
      />
    </div>
  );
};
