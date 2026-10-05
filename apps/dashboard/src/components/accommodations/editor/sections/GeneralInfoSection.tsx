import React from 'react';
import { Home } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { Select } from '../../../ui/Select.tsx';
import type { AccommodationType } from '../../../../types/accommodation.types.ts';

export interface GeneralInfoSectionProps {
  name: string;
  setName: (val: string) => void;
  type: AccommodationType;
  setType: (val: AccommodationType) => void;
  description: string;
  setDescription: (val: string) => void;
}

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  name,
  setName,
  type,
  setType,
  description,
  setDescription,
}) => {
  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <div className="p-2 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)]">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Información General e Identificación
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Datos principales que identificarán tu establecimiento en el portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Nombre del Establecimiento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Cabañas Pircas del Uritorco"
            required
          />
        </div>
        <div>
          <Select
            label="Tipo de Alojamiento"
            value={type}
            onChange={(e) => setType(e.target.value as AccommodationType)}
            options={[
              { value: 'CABIN', label: 'Cabaña' },
              { value: 'HOTEL', label: 'Hotel / Posada' },
              { value: 'APARTMENT', label: 'Departamento' },
              { value: 'HOSTEL', label: 'Hostel' },
              { value: 'CAMPING', label: 'Camping & Glamping' },
            ]}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-700)] block mb-1.5">
          Descripción del Establecimiento
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describí los atributos principales del lugar, entorno serrano, tranquilidad, comodidades para el descanso y atención personalizada..."
          className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] placeholder:text-[var(--color-sand-400)] focus:outline-none focus:border-[var(--color-terracotta-500)] transition-colors"
          required
        />
        <div className="flex justify-between items-center mt-1 text-[11px] text-[var(--color-sand-400)]">
          <span>Recomendación: mínimo 100 caracteres para un buen posicionamiento en búsquedas.</span>
          <span>{description.length} caracteres</span>
        </div>
      </div>
    </div>
  );
};
