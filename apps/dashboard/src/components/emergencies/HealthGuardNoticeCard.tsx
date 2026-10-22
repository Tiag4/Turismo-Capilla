import React, { useState } from 'react';
import { Phone, MapPin, CheckCircle, Save, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { HealthGuardNotice } from '../../types/pharmacyDuty.types.ts';

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
    <div className="space-y-4 pt-4 border-t border-sand-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-sand-900 font-['Outfit']">
            {healthGuard.facilityName}
          </h2>
          <p className="text-xs text-sand-500 mt-0.5">
            Centro de referencia de emergencias médicas y guardia permanente 24 horas en Capilla del Monte.
          </p>
        </div>

        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="font-bold">
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            <span>Editar Aviso Oficial</span>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button variant="terracotta" size="sm" onClick={handleSave} disabled={isSaving} className="font-bold">
              <Save className="w-3.5 h-3.5 mr-1.5" />
              <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-sand-700 py-1">
        <div className="space-y-3">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sand-400 shrink-0" />
            <span className="font-semibold text-sand-900">Ubicación:</span>
            <span>{healthGuard.address} (a 4 cuadras del centro)</span>
          </p>
          <p className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="font-semibold text-sand-900">Líneas de Auxilio:</span>
            <span className="font-mono font-bold text-sand-900">107</span>
            <span>· Directo {healthGuard.directPhone}</span>
          </p>
          <div className="pt-1">
            <span className="font-bold text-sand-900 block mb-2">Servicios Activos Permanentes:</span>
            <ul className="space-y-1.5">
              {healthGuard.activeGuards.map((svc, i) => (
                <li key={i} className="flex items-center gap-2 text-sand-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <label className="block font-bold text-sand-900 mb-1.5">
              Aviso Especial de Guardia para el Portal:
            </label>
            {isEditing ? (
              <textarea
                value={specialNotice}
                onChange={(e) => setSpecialNotice(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs rounded-xl border border-sand-300 bg-white focus:outline-none focus:border-terracotta-500 shadow-xs"
                placeholder="Escribí aquí las novedades de guardia pediátrica, campañas o recomendaciones..."
              />
            ) : (
              <div className="border-l-2 border-terracotta-500 pl-3.5 py-1.5 text-xs text-sand-800 leading-relaxed italic bg-sand-100/30">
                "{healthGuard.specialNotice || 'Sin avisos extraordinarios para el día de la fecha.'}"
              </div>
            )}
          </div>
          <p className="text-[11px] text-sand-500">
            Última actualización registrada: {new Date(healthGuard.updatedAt).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
};
