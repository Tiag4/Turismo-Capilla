import React from 'react';
import { DollarSign, Bed } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomTimePicker } from '../../../ui/CustomTimePicker.tsx';
import { CustomSelect } from '../../../ui/CustomSelect.tsx';
import { BedroomsDistributionBuilder } from './BedroomsDistributionBuilder.tsx';
import { StayPoliciesSubsection } from './StayPoliciesSubsection.tsx';

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
  preparationDays?: number;
  setPreparationDays?: (val: number) => void;
  minNights?: number;
  setMinNights?: (val: number) => void;
  hasBreakfast: boolean;
  setHasBreakfast: (val: boolean) => void;
  breakfastType: string;
  setBreakfastType: (val: string) => void;
}
const MIN_NIGHTS_OPTIONS = [
  { value: '1', label: '1 noche (Estadía libre / Recambio diario)', description: 'Permite reservas de una sola noche en cualquier momento.' },
  { value: '2', label: '2 noches (Mínimo estándar fin de semana)', description: 'El turista deberá seleccionar al menos 2 noches consecutivas.' },
  { value: '3', label: '3 noches (Fines de semana largos / Descanso)', description: 'Ideal para cabañas con costos operativos de recambio.' },
  { value: '4', label: '4 noches (Estadía mínima de temporada)', description: 'Recomendado para alta demanda o semanas especiales.' },
  { value: '5', label: '5 noches', description: 'Estadía extendida de 5 noches como mínimo.' },
  { value: '7', label: '7 noches (Estadía semanal completa)', description: 'Exclusivo para alquileres por semana completa.' },
];
const PREPARATION_OPTIONS = [
  { value: '0', label: '0 días (Mismo día con ventana horaria estándar)', description: 'El nuevo huésped puede ingresar el mismo día tras el horario de salida.' },
  { value: '1', label: '1 día de descanso (Bloqueo de 24 hs para desinfección)', description: 'Bloquea automáticamente el día posterior al check-out para limpieza.' },
  { value: '2', label: '2 días de descanso (Bloqueo de 48 hs para acondicionamiento)', description: 'Recomendado para estancias prolongadas o limpieza profunda.' },
];
export const PricingCapacitySection: React.FC<PricingCapacitySectionProps> = ({
  pricePerNight, setPricePerNight, maxGuests, setMaxGuests,
  checkIn, setCheckIn, checkOut, setCheckOut,
  preparationDays = 0, setPreparationDays, minNights = 1, setMinNights,
  hasBreakfast, setHasBreakfast, breakfastType, setBreakfastType,
  unitTitle, setUnitTitle, surfaceSqm, setSurfaceSqm,
  bedroomsSummary, setBedroomsSummary, phone, setPhone,
  petPolicy, setPetPolicy, cancellationPolicy, setCancellationPolicy,
}) => {
  const numericPrice = Number(pricePerNight) || 0;
  const effectiveMinNights = Math.max(1, minNights || 1);

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <DollarSign className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" aria-hidden="true" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">Tarifas, Capacidad y Horarios</h3>
          <p className="text-xs text-[var(--color-sand-500)]">Condiciones comerciales para reservas turísticas directas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <Input
          label="Tarifa base por noche (ARS)"
          type="number" min="0" step="1000" value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          placeholder="85000" required
          tooltip="Precio base en pesos argentinos por noche para temporada regular."
          helperText={numericPrice > 0 ? `Equivale a $${numericPrice.toLocaleString('es-AR')} por noche` : undefined}
        />
        <Input
          label="Capacidad máxima (huéspedes)"
          type="number" min="1" max="30" value={maxGuests}
          onChange={(e) => setMaxGuests(e.target.value)}
          placeholder="4" required
          tooltip="Cantidad total máxima de personas adultas y menores que pueden alojarse."
          helperText="Total de plazas y camas habilitadas."
        />
        <CustomTimePicker label="Horario de Ingreso" value={checkIn || '14:00 hs'} onChange={setCheckIn} tooltip="Hora de check-in." helperText="Horario de ingreso al complejo." />
        <CustomTimePicker label="Horario de Egreso" value={checkOut || '10:00 hs'} onChange={setCheckOut} tooltip="Hora de check-out." helperText="Horario límite de egreso." />
      </div>

      <div className="pt-4 border-t border-[var(--color-sand-200)] grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <CustomSelect
          label="Estadía mínima requerida (Mínimo de noches)"
          value={String(effectiveMinNights)}
          onChange={(val) => setMinNights?.(Math.max(1, Number(val) || 1))}
          options={MIN_NIGHTS_OPTIONS}
          tooltip="Cantidad mínima de noches consecutivas que el huésped debe seleccionar para poder reservar."
          helperText={`Mínimo por reserva: $${(numericPrice * effectiveMinNights).toLocaleString('es-AR')} ARS (${effectiveMinNights} ${effectiveMinNights === 1 ? 'noche' : 'noches'})`}
        />
        <CustomSelect
          label="Tiempo de preparación entre estadías (Colchón de limpieza)"
          value={String(preparationDays)}
          onChange={(val) => setPreparationDays?.(Number(val) || 0)}
          options={PREPARATION_OPTIONS}
          tooltip="Días protegidos automáticamente tras cada check-out para limpieza y desinfección."
          helperText="Define el intervalo que el motor de reservas protegerá automáticamente entre estadías."
        />
      </div>

      <div className="pt-4 border-t border-[var(--color-sand-200)] space-y-4">
        <div className="flex items-center gap-2">
          <Bed className="w-4 h-4 text-[var(--color-terracotta-500)]" aria-hidden="true" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-900)]">
            Detalles de la Unidad y Dormitorios (Ficha del Portal)
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <Input
            label="Tipo / Título de Unidad" type="text" value={unitTitle || ''}
            onChange={(e) => setUnitTitle?.(e.target.value)}
            placeholder="Ej. Chalet de montaña 2 dormitorios"
            tooltip="Nombre descriptivo de la cabaña, loft o departamento visible en la ficha pública."
            helperText="Ej. Cabaña completa, Suite con vista, Loft"
          />
          <Input
            label="Superficie cubierta (m²)" type="number" min="1" max="1000" value={surfaceSqm || ''}
            onChange={(e) => setSurfaceSqm?.(e.target.value)}
            placeholder="Ej. 45"
            tooltip="Metros cuadrados totales de construcción cerrada y techada."
            helperText="Metros cuadrados construidos."
          />
        </div>
        <BedroomsDistributionBuilder value={bedroomsSummary || ''} onChange={(val) => setBedroomsSummary?.(val)} />
      </div>

      <StayPoliciesSubsection
        phone={phone} setPhone={setPhone} petPolicy={petPolicy} setPetPolicy={setPetPolicy}
        cancellationPolicy={cancellationPolicy} setCancellationPolicy={setCancellationPolicy}
        hasBreakfast={hasBreakfast} setHasBreakfast={setHasBreakfast}
        breakfastType={breakfastType} setBreakfastType={setBreakfastType}
      />
    </div>
  );
};
