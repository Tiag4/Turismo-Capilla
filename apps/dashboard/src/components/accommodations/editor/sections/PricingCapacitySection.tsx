import React from 'react';
import { DollarSign } from 'lucide-react';
import { Input } from '../../../ui/Input.tsx';
import { CustomTimePicker } from '../../../ui/CustomTimePicker.tsx';

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
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-5 shadow-xs">
      {/* Header without pastel container */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <DollarSign className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
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
            label="Tarifa base por noche (ARS)"
            type="number"
            min="0"
            step="1000"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            placeholder="85000"
            required
          />
          {numericPrice > 0 && (
            <span className="text-[11px] text-[var(--color-sand-500)] font-medium block mt-1">
              Equivale a <strong className="text-[var(--color-sand-900)]">${numericPrice.toLocaleString('es-AR')}</strong> por noche
            </span>
          )}
        </div>

        <div>
          <Input
            label="Capacidad máxima (huéspedes)"
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
          <CustomTimePicker
            label="Horario de Check-in"
            value={checkIn || '14:00 hs'}
            onChange={(val) => setCheckIn(val)}
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Horario de ingreso al complejo.
          </span>
        </div>

        <div>
          <CustomTimePicker
            label="Horario de Check-out"
            value={checkOut || '10:00 hs'}
            onChange={(val) => setCheckOut(val)}
          />
          <span className="text-[11px] text-[var(--color-sand-400)] block mt-1">
            Horario límite de salida.
          </span>
        </div>
      </div>
    </div>
  );
};
