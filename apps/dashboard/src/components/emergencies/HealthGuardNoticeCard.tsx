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
    <div className="space-y-4 pt-4 border-t border-[var(--color-sand-200)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
            {healthGuard.facilityName}
          </h2>
          <p className="text-xs text-[var(--color-sand-500)] mt-0.5">
            Centro de referencia de emergencias médicas y guardia 24 horas en Capilla del Monte
          </p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[var(--color-sand-700)] py-2">
        <div className="space-y-2.5">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
            <span className="font-semibold text-[var(--color-sand-900)]">Ubicación:</span>
            <span>{healthGuard.address} (a 4 cuadras del centro)</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-[var(--color-emerald-portal-600)] shrink-0" />
            <span className="font-semibold text-[var(--color-sand-900)]">Líneas de Auxilio:</span>
            <span>Discado rápido 107 · Directo {healthGuard.directPhone}</span>
          </p>
          <div className="pt-1">
            <span className="font-bold text-[var(--color-sand-900)] block mb-1.5">Servicios Activos Permanentes:</span>
            <ul className="space-y-1.5">
              {healthGuard.activeGuards.map((svc, i) => (
                <li key={i} className="flex items-center gap-1.5 text-[var(--color-sand-600)]">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--color-emerald-portal-600)] shrink-0" />
                  <span>{svc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <label className="block font-bold text-[var(--color-sand-900)] mb-1.5">
              Aviso Especial de Guardia & Salud para el Portal:
            </label>
            {isEditing ? (
              <textarea
                value={specialNotice}
                onChange={(e) => setSpecialNotice(e.target.value)}
                rows={4}
                className="w-full p-2.5 text-xs rounded-xl border border-[var(--color-sand-300)] bg-white focus:border-[var(--color-terracotta-500)] outline-none"
                placeholder="Escribí aquí las novedades de guardia pediátrica, campañas o recomendaciones..."
              />
            ) : (
              <div className="p-3.5 rounded-xl border-l-2 border-[var(--color-terracotta-500)] bg-[var(--color-sand-100)]/60 text-[var(--color-sand-700)] text-xs leading-relaxed italic">
                "{healthGuard.specialNotice || 'Sin avisos extraordinarios para el día de la fecha.'}"
              </div>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-sand-400)]">
            Última actualización registrada: {new Date(healthGuard.updatedAt).toLocaleDateString('es-AR')}
          </p>
        </div>
      </div>
    </div>
  );
};
