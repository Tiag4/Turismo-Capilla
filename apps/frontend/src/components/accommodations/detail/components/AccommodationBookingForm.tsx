import React from 'react';
import { ShieldCheck } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationBookingFormProps {
  data: AccommodationDetailData;
  checkIn: string;
  checkOut: string;
  guests: string;
  nightsCount: number | null;
  totalPrice: number | null;
  depositRequired: number | null;
  guestName: string;
  onGuestNameChange: (v: string) => void;
  guestEmail: string;
  onGuestEmailChange: (v: string) => void;
  guestPhone: string;
  onGuestPhoneChange: (v: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const AccommodationBookingForm: React.FC<AccommodationBookingFormProps> = ({
  data,
  checkIn,
  checkOut,
  guests,
  nightsCount,
  totalPrice,
  depositRequired,
  guestName,
  onGuestNameChange,
  guestEmail,
  onGuestEmailChange,
  guestPhone,
  onGuestPhoneChange,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Resumen de Tarifas */}
      <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
        <div className="flex justify-between font-bold text-stone-800">
          <span>Fechas:</span>
          <span>{checkIn ? `${checkIn} → ${checkOut}` : 'Sin especificar'} ({nightsCount ?? 0} noches)</span>
        </div>
        <div className="flex justify-between text-stone-600">
          <span>Huéspedes:</span>
          <span>{guests} personas</span>
        </div>
        {totalPrice && (
          <div className="flex justify-between font-extrabold text-stone-900 pt-1 border-t border-stone-200">
            <span>Total estimado:</span>
            <span className="text-terracotta-700">${totalPrice.toLocaleString('es-AR')} ARS</span>
          </div>
        )}
        {depositRequired && (
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>Seña ({data.depositPercent}%):</span>
            <span className="font-bold text-primary-700">${depositRequired.toLocaleString('es-AR')} ARS</span>
          </div>
        )}
      </div>

      {/* Campos de Contacto */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
            Nombre Completo *
          </label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => onGuestNameChange(e.target.value)}
            placeholder="Ej. Martín Gómez"
            className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
            Teléfono / WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={guestPhone}
            onChange={(e) => onGuestPhoneChange(e.target.value)}
            placeholder="Ej. +54 9 351 123 4567"
            className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">
            Email de Contacto
          </label>
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => onGuestEmailChange(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          {isSubmitting ? 'Enviando solicitud...' : 'Enviar Solicitud al Prestador'}
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Contacto directo sin cargos adicionales</span>
      </div>
    </form>
  );
};
