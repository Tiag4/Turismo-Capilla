import React from 'react';
import { Building2, Plus, Phone, MapPin, Clock, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { PharmacyDutyRecord } from '../../types/pharmacyDuty.types';

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
    <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-sand-900 font-display flex items-center gap-2">
            <Building2 className="w-5 h-5 text-terracotta-600" />
            <span>Farmacias Registradas en Capilla del Monte</span>
          </h2>
          <p className="text-xs text-sand-500">
            Designá cuál se encuentra de turno activo hoy para reflejarlo en tiempo real en el portal.
          </p>
        </div>
        <Button variant="terracotta" size="sm" onClick={onAddNew} disabled={isSaving}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Registrar Farmacia</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pharmacies.map((pharmacy) => {
          const isOnDuty = pharmacy.isOnDutyToday;
          return (
            <div
              key={pharmacy.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isOnDuty
                  ? 'border-emerald-700 bg-emerald-50/30 ring-1 ring-emerald-700 shadow-sm'
                  : 'border-sand-200 bg-white hover:border-sand-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-base text-sand-900 font-display">{pharmacy.name}</span>
                  {isOnDuty ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-extrabold uppercase px-2.5 py-0.5 rounded-full text-[10px] tracking-wider shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DE TURNO HOY</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetOnDuty(pharmacy.id)}
                      disabled={isSaving}
                      className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 hover:underline cursor-pointer"
                    >
                      Poner de Turno
                    </button>
                  )}
                </div>

                <div className="text-xs text-sand-600 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span>{pharmacy.address}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span>{pharmacy.phone}</span>
                    {pharmacy.whatsapp && <span className="text-sand-400">· WA: {pharmacy.whatsapp}</span>}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                    <span>{pharmacy.dutyHours}</span>
                  </p>
                  {pharmacy.notes && <p className="text-[11px] text-sand-500 italic pt-0.5">"{pharmacy.notes}"</p>}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-sand-100 text-xs">
                <span className="text-[11px] text-sand-400">
                  {pharmacy.validFrom && pharmacy.validTo
                    ? `Vigencia: ${pharmacy.validFrom} al ${pharmacy.validTo}`
                    : 'Turno semanal rotativo'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(pharmacy)}
                    disabled={isSaving}
                    aria-label={`Editar ${pharmacy.name}`}
                    className="p-1.5 rounded-lg text-sand-500 hover:text-sand-800 hover:bg-sand-100 transition-colors cursor-pointer"
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
