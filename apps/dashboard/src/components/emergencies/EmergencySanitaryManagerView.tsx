import React from 'react';
import { ShieldAlert, Building2, Clock, CheckCircle2, PhoneCall } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { useEmergencySanitary } from '../../hooks/useEmergencySanitary';
import { PharmacyDutyListCard } from './PharmacyDutyListCard';
import { HealthGuardNoticeCard } from './HealthGuardNoticeCard';
import { PharmacyDutyEditorModal } from './PharmacyDutyEditorModal';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-sand-900 tracking-tight font-display">
              Guardias Sanitarias & Farmacias de Turno
            </h1>
            <p className="text-xs sm:text-sm text-sand-500">
              Control oficial y publicación de farmacias de guardia y avisos del Hospital Municipal en el portal público.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-sand-200 text-xs font-bold text-sand-700 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-pulse" />
          <span>Sincronización en Tiempo Real</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Farmacia de Turno Hoy"
          value={activeDutyPharmacy?.name ?? 'Sin asignar'}
          helperText={activeDutyPharmacy?.address ?? 'Seleccionar del listado'}
          icon={Building2}
          iconColor="text-emerald-700"
        />
        <StatCard
          label="Horario / Modalidad"
          value={activeDutyPharmacy?.dutyHours ?? '24 Horas'}
          helperText="Vigencia activa para turistas y vecinos"
          icon={Clock}
          iconColor="text-terracotta-600"
        />
        <StatCard
          label="Guardia Médica 107"
          value="Hospital Municipal Luqui"
          helperText="Shock Room y suero antiofídico activo"
          icon={PhoneCall}
          iconColor="text-emerald-700"
        />
      </div>

      {/* Active Duty Pharmacy Summary Banner */}
      {activeDutyPharmacy && (
        <div className="bg-white rounded-3xl border border-sand-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-xs">
                PUBLICADO EN EL PORTAL
              </span>
              <span className="text-xs text-sand-400">· /emergencias</span>
            </div>
            <h3 className="text-lg font-bold text-sand-900 font-display">
              {activeDutyPharmacy.name} — {activeDutyPharmacy.address}
            </h3>
            <p className="text-xs text-sand-600">
              Teléfono de urgencia: <span className="font-bold text-sand-800">{activeDutyPharmacy.phone}</span>
              {activeDutyPharmacy.whatsapp && ` · WhatsApp: ${activeDutyPharmacy.whatsapp}`}
              {activeDutyPharmacy.notes && ` · "${activeDutyPharmacy.notes}"`}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Visible para turistas</span>
            </span>
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
