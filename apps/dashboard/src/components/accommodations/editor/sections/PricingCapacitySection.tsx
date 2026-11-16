import React from 'react';
import { DollarSign, Coffee, Bed, Phone } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomTimePicker } from '../../../ui/CustomTimePicker.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';

export interface PricingCapacitySectionProps {
  pricePerNight: string;
  setPricePerNight: (val: string) => void;
  maxGuests: string;
  setMaxGuests: (val: string) => void;
  unitTitle?: string;
  setUnitTitle?: (val: string) => void;
  surfaceSqm?: string;
  setSurfaceSqm?: (val: string) => void;
  bedroomsSummary?: string;
  setBedroomsSummary?: (val: string) => void;
  phone?: string;
  setPhone?: (val: string) => void;
  petPolicy?: string;
  setPetPolicy?: (val: string) => void;
  cancellationPolicy?: string;
  setCancellationPolicy?: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  hasBreakfast: boolean;
  setHasBreakfast: (val: boolean) => void;
  breakfastType: string;
  setBreakfastType: (val: string) => void;
}

const BREAKFAST_OPTIONS = [
  'Desayuno serrano casero',
  'Desayuno continental',
  'Desayuno seco en cabaña',
  'Desayuno buffet completo',
  'Opciones sin TACC / Vegano',
];

export const PricingCapacitySection: React.FC<PricingCapacitySectionProps> = ({
  pricePerNight, setPricePerNight,
  maxGuests, setMaxGuests,
  checkIn, setCheckIn,
  checkOut, setCheckOut,
  hasBreakfast, setHasBreakfast,
  breakfastType, setBreakfastType,
  unitTitle, setUnitTitle,
  surfaceSqm, setSurfaceSqm,
  bedroomsSummary, setBedroomsSummary,
  phone, setPhone,
  petPolicy, setPetPolicy,
  cancellationPolicy, setCancellationPolicy,
}) => {
  const numericPrice = Number(pricePerNight) || 0;

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <DollarSign className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">Tarifas, Capacidad y Horarios</h3>
          <p className="text-xs text-[var(--color-sand-500)]">Condiciones comerciales para reservas turísticas directas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <Input
          label="Tarifa base por noche (ARS)"
          type="number"
          min="0"
          step="1000"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          placeholder="85000"
          required
          helperText={numericPrice > 0 ? `Equivale a $${numericPrice.toLocaleString('es-AR')} por noche` : undefined}
        />
        <Input
          label="Capacidad máxima (huéspedes)"
          type="number"
          min="1"
          max="30"
          value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          placeholder="4"
          required
          helperText="Total de plazas y camas habilitadas."
        />
        <CustomTimePicker
          label="Horario de Ingreso"
          value={checkIn || '14:00 hs'}
          onChange={(val) => setCheckIn(val)}
          helperText="Horario de ingreso al complejo."
        />
        <CustomTimePicker
          label="Horario de Egreso"
          value={checkOut || '10:00 hs'}
          onChange={(val) => setCheckOut(val)}
          helperText="Horario límite de egreso."
        />
      </div>

      {/* Distribución y Configuración de Unidad (Ficha de Hospedaje) */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] space-y-3">
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-[var(--color-terracotta-500)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-900)]">
            Detalles de la Unidad y Dormitorios (Ficha del Portal)
          </h4>
        </div>
        <p className="text-[11px] text-[var(--color-sand-500)]">
          Configurá la información visual que verán los turistas en la tarjeta "Tipo de Alojamiento" y distribución de camas.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
          <Input
            label="Tipo / Título de Unidad"
            type="text"
            value={unitTitle || ''}
            onChange={(e) => setUnitTitle?.(e.target.value)}
            placeholder="Ej. Chalet de montaña 2 dormitorios"
            helperText="Ej. Cabaña completa, Suite con vista, Loft"
          />
          <Input
            label="Superficie cubierta (m²)"
            type="number"
            min="1"
            max="1000"
            value={surfaceSqm || ''}
            onChange={(e) => setSurfaceSqm?.(e.target.value)}
            placeholder="Ej. 45"
            helperText="Metros cuadrados construidos."
          />
          <Input
            label="Distribución de camas (separar con |)"
            type="text"
            value={bedroomsSummary || ''}
            onChange={(e) => setBedroomsSummary?.(e.target.value)}
            placeholder="Dormitorio 1: 1 cama doble | Dormitorio 2: 2 camas individuales"
            helperText="Usa '|' para separar dormitorios."
          />
        </div>
      </div>

      {/* Contacto Directo WhatsApp y Políticas de Convivencia */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] space-y-3">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
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
            helperText="Número con código de área para botón de WhatsApp."
          />
          <Input
            label="Política de Mascotas"
            type="text"
            value={petPolicy || ''}
            onChange={(e) => setPetPolicy?.(e.target.value)}
            placeholder="Ej. Mascotas bienvenidas con previo aviso"
            helperText="Condiciones sobre admisión de mascotas."
          />
          <Input
            label="Política de Cancelación"
            type="text"
            value={cancellationPolicy || ''}
            onChange={(e) => setCancellationPolicy?.(e.target.value)}
            placeholder="Ej. Cancelación flexible hasta 7 días antes"
            helperText="Plazo y condiciones de cancelación o reembolso."
          />
        </div>
      </div>

      {/* Servicio de Desayuno (HU-28) */}
      <div className="pt-4 border-t border-[var(--color-sand-200)] flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Coffee className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-[var(--color-sand-900)] block">Servicio de Desayuno Incluido</span>
              <span className="text-[11px] text-[var(--color-sand-500)] block">Indica si la tarifa contempla desayuno para los huéspedes</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHasBreakfast(!hasBreakfast)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border select-none ${
              hasBreakfast
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                : 'bg-white text-[var(--color-sand-700)] border-[var(--color-sand-300)] hover:bg-[var(--color-sand-50)]'
            }`}
          >
            {hasBreakfast ? '✓ Desayuno Incluido' : 'Sin Desayuno'}
          </button>
        </div>

        {hasBreakfast && (
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-950">Modalidad de Desayuno</label>
            <CustomSelect
              value={breakfastType}
              onChange={(val) => setBreakfastType(val)}
              options={BREAKFAST_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
            />
            <p className="text-[11px] text-amber-900 font-medium">
              ℹ️ Se mostrará el badge "Tarifa con Desayuno Incluido" en la tarjeta del portal y responderá al filtro rápido de Desayuno.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
