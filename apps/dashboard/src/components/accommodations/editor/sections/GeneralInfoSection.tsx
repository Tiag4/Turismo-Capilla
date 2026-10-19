import React from 'react';
import { Home } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import type { AccommodationType } from '../../../../types/accommodation.types.ts';

export interface GeneralInfoSectionProps {
  name: string;
  setName: (val: string) => void;
  type: AccommodationType;
  setType: (val: AccommodationType) => void;
  description: string;
  setDescription: (val: string) => void;
}

const ACCOMMODATION_TYPE_OPTIONS = [
  { value: 'CABIN', label: 'Cabaña' },
  { value: 'HOTEL', label: 'Hotel / Posada' },
  { value: 'APARTMENT', label: 'Departamento' },
  { value: 'HOSTEL', label: 'Hostel' },
  { value: 'CAMPING', label: 'Camping & Glamping' },
];

export const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({
  name,
  setName,
  type,
  setType,
  description,
  setDescription,
}) => {
  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      {/* Header without pastel container on icon */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <Home className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
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
            label="Nombre del establecimiento"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ej. Cabañas Pircas del Uritorco"
            required
          />
        </div>
        <div>
          <CustomSelect
            label="Tipo de establecimiento"
            value={type}
            onChange={(val) => setType(val as AccommodationType)}
            options={ACCOMMODATION_TYPE_OPTIONS}
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-[var(--color-sand-800)] block mb-1.5">
          Descripción del establecimiento
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
          <span className="font-mono">{description.length} caracteres</span>
        </div>
      </div>
    </div>
  );
};
