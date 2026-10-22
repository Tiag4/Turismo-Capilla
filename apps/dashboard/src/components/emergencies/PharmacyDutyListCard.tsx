import React from 'react';
import { Plus, Phone, MapPin, Clock, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { PharmacyDutyRecord } from '../../types/pharmacyDuty.types.ts';

interface PharmacyDutyListCardProps {
  pharmacies: PharmacyDutyRecord[];
  onSetOnDuty: (id: string) => void;
  onEdit: (pharmacy: PharmacyDutyRecord) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isSaving: boolean;
}

export const PharmacyDutyListCard: React.FC<PharmacyDutyListCardProps> = ({
  pharmacies,
  onSetOnDuty,
  onEdit,
  onDelete,
  onAddNew,
  isSaving,
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-[var(--color-sand-200)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Farmacias Registradas en Capilla del Monte
          </h2>
          <p className="text-xs text-[var(--color-sand-500)] mt-0.5">
            Designá cuál se encuentra de turno activo hoy para reflejarlo en tiempo real en el portal.
          </p>
        </div>
        <Button variant="terracotta" size="sm" onClick={onAddNew} disabled={isSaving}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Registrar Farmacia</span>
        </Button>
      </div>

      {/* Flattened Structured List (Flat on canvas, zero floating card) */}
      <div className="border-y border-[var(--color-sand-300)] divide-y divide-[var(--color-sand-200)]">
        {pharmacies.map((pharmacy) => {
          const isOnDuty = pharmacy.isOnDutyToday;
          return (
            <div
              key={pharmacy.id}
              className={`py-4 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors rounded-lg ${
                isOnDuty ? 'bg-emerald-50/50' : 'hover:bg-[var(--color-sand-100)]/60'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm sm:text-base text-[var(--color-sand-900)] font-['Outfit']">
                    {pharmacy.name}
                  </span>
                  {isOnDuty ? (
                    <span className="inline-flex items-center gap-1 bg-[#005530] text-white font-extrabold uppercase px-2 py-0.5 rounded-md text-[10px] tracking-wider shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DE TURNO HOY</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetOnDuty(pharmacy.id)}
                      disabled={isSaving}
                      className="text-xs font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] cursor-pointer"
                    >
                      Poner de Turno
                    </button>
                  )}
                </div>

                <div className="text-xs text-[var(--color-sand-600)] flex flex-wrap gap-x-4 gap-y-1">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-sand-400)] shrink-0" />
                    <span>{pharmacy.address}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[var(--color-sand-400)] shrink-0" />
                    <span>{pharmacy.phone}</span>
                    {pharmacy.whatsapp && <span className="text-[var(--color-sand-400)]">· WA: {pharmacy.whatsapp}</span>}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--color-sand-400)] shrink-0" />
                    <span>{pharmacy.dutyHours}</span>
                  </p>
                </div>

                {pharmacy.notes && (
                  <p className="text-[11px] text-[var(--color-sand-500)] italic">
                    "{pharmacy.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-sand-100)] text-xs">
                <span className="text-[11px] text-[var(--color-sand-500)]">
                  {pharmacy.validFrom && pharmacy.validTo
                    ? `${pharmacy.validFrom} al ${pharmacy.validTo}`
                    : 'Turno semanal rotativo'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(pharmacy)}
                    disabled={isSaving}
                    aria-label={`Editar ${pharmacy.name}`}
                    className="p-1.5 rounded-lg text-[var(--color-sand-500)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  {!isOnDuty && pharmacies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onDelete(pharmacy.id)}
                      disabled={isSaving}
                      aria-label={`Eliminar ${pharmacy.name}`}
                      className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
