import React from 'react';
import { Home, Star } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import { InfoTooltip } from '../../../ui/Tooltip.tsx';
import type { AccommodationType } from '../../../../types/accommodation.types.ts';

export interface GeneralInfoSectionProps {
  name: string;
  setName: (val: string) => void;
  type: AccommodationType;
  setType: (val: AccommodationType) => void;
  description: string;
  setDescription: (val: string) => void;
  licenseNumber?: string;
  setLicenseNumber?: (val: string) => void;
  responseTime?: string;
  setResponseTime?: (val: string) => void;
  isAdmin?: boolean;
  isFeatured?: boolean;
  setIsFeatured?: (val: boolean) => void;
  hostingSinceYear?: number | null;
  setHostingSinceYear?: (val: number | null) => void;
  isActive?: boolean;
  setIsActive?: (val: boolean) => void;
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
  licenseNumber = '',
  setLicenseNumber,
  responseTime = '',
  setResponseTime,
  isAdmin = false,
  isFeatured = false,
  setIsFeatured,
  hostingSinceYear,
  setHostingSinceYear,
  isActive = true,
  setIsActive,
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
            tooltip="Nombre oficial o de fantasía con el que los turistas reconocen tu alojamiento."
            required
          />
        </div>
        <div>
          <CustomSelect
            label="Tipo de establecimiento"
            value={type}
            onChange={(val) => setType(val as AccommodationType)}
            options={ACCOMMODATION_TYPE_OPTIONS}
            tooltip="Categoría municipal oficial del complejo o propiedad."
          />
        </div>
      </div>

      <div>
        <label htmlFor="accommodation-description" className="text-xs font-semibold text-[var(--color-sand-800)] block mb-1.5">
          Descripción del establecimiento
        </label>
        <textarea
          id="accommodation-description"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describí los atributos principales del lugar, entorno serrano, tranquilidad, comodidades para el descanso y atención personalizada (podés presionar Enter para separar párrafos)..."
          className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] placeholder:text-[var(--color-sand-400)] focus:outline-none focus:border-[var(--color-terracotta-500)] transition-colors"
          required
        />
        <div className="flex justify-between items-center mt-1 text-[11px] text-[var(--color-sand-600)]">
          <span>Podés presionar Enter para separar párrafos (se reflejarán en la página de detalle).</span>
          <span className="font-['Outfit'] font-bold tabular-nums text-[var(--color-sand-800)]">{description.length} caracteres</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[var(--color-sand-100)]">
        <div>
          <Input
            label="N° de Habilitación / Matrícula Municipal"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber?.(e.target.value)}
            placeholder="ej. H-4829 / Res. 104-2023"
            tooltip="Número de registro otorgado por el Municipio de Capilla del Monte que certifica la habilitación oficial."
            helperText="Aparecerá en el portal con el sello oficial de prestador habilitado."
          />
        </div>
        <div>
          <Input
            label="Año de inicio de actividad"
            type="number"
            min={1950}
            max={new Date().getFullYear()}
            value={hostingSinceYear ? String(hostingSinceYear) : ''}
            onChange={(e) => {
              const val = e.target.value ? parseInt(e.target.value, 10) : null;
              setHostingSinceYear?.(val && !isNaN(val) ? val : null);
            }}
            placeholder="ej. 2014"
            tooltip="Año en que el establecimiento o prestador inició formalmente su actividad habilitada en Capilla del Monte."
            helperText="Define la antigüedad que verán los turistas en la ficha oficial."
          />
        </div>
        <div>
          <Input
            label="Tiempo habitual de respuesta"
            value={responseTime}
            onChange={(e) => setResponseTime?.(e.target.value)}
            placeholder="ej. Responde habitualmente en el día"
            tooltip="Estimación del tiempo que te toma confirmar consultas o solicitudes a los turistas."
            helperText="Informa al turista la rapidez de atención para consultas y reservas."
          />
        </div>
      </div>
      {isAdmin && setIsFeatured && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-600 fill-current" />
            </div>
            <div>
              <span className="text-xs font-bold text-sand-900 block font-['Outfit']">
                Alojamiento Destacado en Portada (Cámara de Turismo)
              </span>
              <p className="text-[11px] text-sand-600">
                Al marcarse, este establecimiento figurará prioritariamente en la sección &quot;Cabañas y Posadas del Valle&quot; del inicio.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={Boolean(isFeatured)}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>
      )}

      {/* Control de Disponibilidad y Publicación */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[var(--color-sand-900)] block font-['Outfit']">
              Disponibilidad y Publicación en el Portal
            </span>
            <InfoTooltip content="Permite pausar temporalmente todo el establecimiento del catálogo oficial sin perder las reservas previas." />
          </div>
          <span className="text-xs text-[var(--color-sand-600)] block mt-0.5">
            {isActive
              ? 'El alojamiento está activo y visible públicamente para recibir reservas en el portal.'
              : 'El alojamiento está pausado. No aparecerá en los resultados del portal ni admitirá solicitudes de reserva.'}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          aria-label="Disponibilidad y Publicación en el Portal"
          onClick={() => setIsActive?.(!isActive)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)] focus:ring-offset-2 ${
            isActive ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-sand-300)]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
