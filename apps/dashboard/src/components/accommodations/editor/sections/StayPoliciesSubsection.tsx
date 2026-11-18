import React from 'react';
import { Phone, Coffee } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';

const BREAKFAST_OPTIONS = [
  'Desayuno serrano casero',
  'Desayuno continental',
  'Desayuno seco en cabaña',
  'Desayuno buffet completo',
  'Opciones sin TACC / Vegano',
];

export interface StayPoliciesSubsectionProps {
  phone?: string;
  setPhone?: (val: string) => void;
  petPolicy?: string;
  setPetPolicy?: (val: string) => void;
  cancellationPolicy?: string;
  setCancellationPolicy?: (val: string) => void;
  hasBreakfast: boolean;
  setHasBreakfast: (val: boolean) => void;
  breakfastType: string;
  setBreakfastType: (val: string) => void;
}

export const StayPoliciesSubsection: React.FC<StayPoliciesSubsectionProps> = ({
  phone,
  setPhone,
  petPolicy,
  setPetPolicy,
  cancellationPolicy,
  setCancellationPolicy,
  hasBreakfast,
  setHasBreakfast,
  breakfastType,
  setBreakfastType,
}) => {
  return (
    <>
      {/* Contacto Directo WhatsApp y Políticas de Convivencia */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" aria-hidden="true" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-900)]">
            Contacto WhatsApp y Políticas de Estadía
          </h4>
        </div>
        <p className="text-[11px] text-[var(--color-sand-500)]">
          Configurá el teléfono al que llegarán las consultas por WhatsApp y las pautas para tus huéspedes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <Input
            label="Teléfono / WhatsApp de contacto"
            type="text"
            value={phone || ''}
            onChange={(e) => setPhone?.(e.target.value)}
            placeholder="Ej. +54 9 3548 481234"
            tooltip="Número telefónico completo con código de área para botón de contacto directo por WhatsApp."
            helperText="Número con código de área para botón de WhatsApp."
          />
          <Input
            label="Política de Mascotas"
            type="text"
            value={petPolicy || ''}
            onChange={(e) => setPetPolicy?.(e.target.value)}
            placeholder="Ej. Mascotas bienvenidas con previo aviso"
            tooltip="Condiciones y pautas sobre admisión de mascotas en el predio."
            helperText="Condiciones sobre admisión de mascotas."
          />
          <Input
            label="Política de Cancelación"
            type="text"
            value={cancellationPolicy || ''}
            onChange={(e) => setCancellationPolicy?.(e.target.value)}
            placeholder="Ej. Cancelación flexible hasta 7 días antes"
            tooltip="Plazos y penalizaciones en caso de cancelación o modificación de estadía."
            helperText="Plazo y condiciones de cancelación o reembolso."
          />
        </div>
      </div>

      {/* Servicio de Desayuno (HU-28) */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <div>
              <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                Servicio de Desayuno Incluido
              </span>
              <span className="text-[11px] text-[var(--color-sand-500)] block">
                Indica si la tarifa contempla desayuno para los huéspedes
              </span>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={hasBreakfast}
            aria-label="Servicio de Desayuno Incluido"
            onClick={() => setHasBreakfast(!hasBreakfast)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
              hasBreakfast
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                : 'bg-white text-[var(--color-sand-700)] border-[var(--color-sand-300)] hover:bg-[var(--color-sand-50)]'
            }`}
          >
            {hasBreakfast ? 'Desayuno Incluido' : 'Sin Desayuno'}
          </button>
        </div>

        {hasBreakfast && (
          <div className="p-3.5 bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] rounded-xl space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-900)]">
              Modalidad de Desayuno
            </label>
            <CustomSelect
              value={breakfastType}
              onChange={(val) => setBreakfastType(val)}
              options={BREAKFAST_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
            />
            <p className="text-[11px] text-[var(--color-sand-600)] font-medium">
              Se mostrará la insignia &quot;Tarifa con Desayuno Incluido&quot; en la tarjeta del portal y responderá al filtro rápido de Desayuno.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
