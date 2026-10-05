import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';

export interface PricingCapacitySectionProps {
  pricePerNight: string;
  setPricePerNight: (val: string) => void;
  maxGuests: string;
  setMaxGuests: (val: string) => void;
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
}

export const PricingCapacitySection: React.FC<PricingCapacitySectionProps> = ({
  pricePerNight,
  setPricePerNight,
  maxGuests,
  setMaxGuests,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  const numericPrice = Number(pricePerNight) || 0;

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <div className="p-2 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)]">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Tarifas, Capacidad y Horarios de Estadía
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Establecé las condiciones comerciales para las reservas turísticas directas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Input
            label="Tarifa Base por Noche (ARS)"
            type="number"
            min="0"
            step="1000"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            placeholder="85000"
            required
          />
          <span className="text-[11px] text-[var(--color-terracotta-600)] font-bold block mt-1">
            Visualización: ${numericPrice.toLocaleString('es-AR')} / noche
          </span>
        </div>

        <div>
          <Input
            label="Capacidad Máxima (Huéspedes)"
            type="number"
            min="1"
            max="30"
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            placeholder="4"
            required
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Total de plazas y camas habilitadas.
          </span>
        </div>

        <div>
          <Input
            label="Horario de Check-in"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            placeholder="14:00 hs"
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Horario a partir del cual puede ingresar.
          </span>
        </div>

        <div>
          <Input
            label="Horario de Check-out"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            placeholder="10:00 hs"
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Horario límite de salida del complejo.
          </span>
        </div>
      </div>
    </div>
  );
};
