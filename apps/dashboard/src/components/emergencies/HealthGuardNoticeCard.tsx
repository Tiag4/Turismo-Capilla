import React, { useState } from 'react';
import { ShieldAlert, Phone, MapPin, CheckCircle, Save, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';
import type { HealthGuardNotice } from '../../types/pharmacyDuty.types';

interface HealthGuardNoticeCardProps {
  healthGuard: HealthGuardNotice;
  onUpdateNotice: (notice: Partial<HealthGuardNotice>) => Promise<void>;
  isSaving: boolean;
}

export const HealthGuardNoticeCard: React.FC<HealthGuardNoticeCardProps> = ({
  healthGuard,
  onUpdateNotice,
  isSaving,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [specialNotice, setSpecialNotice] = useState(healthGuard.specialNotice ?? '');

  const handleSave = async () => {
    await onUpdateNotice({ specialNotice: specialNotice.trim() });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-sand-200 p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sand-900 font-display">
              {healthGuard.facilityName}
            </h2>
            <p className="text-xs text-sand-500">
              Centro de referencia de emergencias médicas y guardia 24 horas en Capilla del Monte
            </p>
          </div>
        </div>

        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            <span>Editar Aviso Oficial</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button variant="terracotta" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-sand-700">
        <div className="space-y-2">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sand-400 shrink-0" />
            <span className="font-semibold text-sand-800">Ubicación:</span>
            <span>{healthGuard.address} (a 4 cuadras del centro)</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-sand-800">Líneas de Auxilio:</span>
            <span>Discado rápido 107 · Directo {healthGuard.directPhone}</span>
          </p>
          <div className="pt-2">
            <span className="font-bold text-sand-900 block mb-1">Servicios Activos Permanentes:</span>
            <ul className="space-y-1">
              {healthGuard.activeGuards.map((svc, i) => (
                <li key={i} className="flex items-center gap-1.5 text-sand-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <label className="block font-bold text-sand-900 mb-1">
              Aviso Especial de Guardia & Salud para el Portal:
            </label>
            {isEditing ? (
              <textarea
                value={specialNotice}
                onChange={(e) => setSpecialNotice(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs rounded-xl border border-sand-300 focus:border-terracotta-500 outline-none"
                placeholder="Escribí aquí las novedades de guardia pediátrica, campañas o recomendaciones..."
              />
            ) : (
              <div className="p-3 rounded-2xl bg-sand-50 border border-sand-200 text-sand-700 text-xs leading-relaxed italic">
                "{healthGuard.specialNotice || 'Sin avisos extraordinarios para el día de la fecha.'}"
              </div>
            )}
          </div>
          <p className="text-[11px] text-sand-400">
            Última actualización registrada: {new Date(healthGuard.updatedAt).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
};
