import React from 'react';
import { Calendar, Users, ShieldCheck } from 'lucide-react';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { CustomSelect } from '../../../ui/CustomSelect';
import { GUEST_OPTIONS } from './AccommodationStickyWidget';
import type { AccommodationDetailData } from '../types';

interface AccommodationBookingFormProps {
  data: AccommodationDetailData;
  checkIn: string;
  onCheckInChange: (v: string) => void;
  checkOut: string;
  onCheckOutChange: (v: string) => void;
  guests: string;
  onGuestsChange: (v: string) => void;
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
  onCheckInChange,
  checkOut,
  onCheckOutChange,
  guests,
  onGuestsChange,
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
  const todayStr = new Date().toISOString().split('T')[0];
  const price = data.pricePerNight ?? 0;

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Selector de Fechas, Huéspedes y Resumen de Tarifas */}
      <div className="space-y-3 p-4 bg-[#FAF8F5] rounded-2xl border border-stone-200/80">
        <div className="flex justify-between items-center pb-2 border-b border-stone-200">
          <span className="text-xs font-semibold text-stone-600">Tarifa por noche:</span>
          <span className="font-display font-extrabold text-base text-stone-900">${price.toLocaleString('es-AR')} ARS</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <CustomDatePicker
            label="Llegada"
            value={checkIn}
            onChange={(d) => {
              onCheckInChange(d);
              if (checkOut && d >= checkOut) onCheckOutChange('');
            }}
            minDate={todayStr}
            placeholder="Llegada"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
          <CustomDatePicker
            label="Salida"
            value={checkOut}
            onChange={onCheckOutChange}
            minDate={checkIn || todayStr}
            placeholder="Salida"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
        </div>

        <CustomSelect
          label="Huéspedes"
          value={guests}
          onChange={onGuestsChange}
          options={GUEST_OPTIONS}
          icon={<Users className="w-3.5 h-3.5 text-stone-400" />}
        />

        {nightsCount && totalPrice ? (
          <div className="pt-2 border-t border-stone-200 text-xs space-y-1">
            <div className="flex justify-between text-stone-600">
              <span>${price.toLocaleString('es-AR')} × {nightsCount} noches</span>
              <span className="font-bold text-stone-900">${totalPrice.toLocaleString('es-AR')}</span>
            </div>
            {depositRequired && (
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>Seña ({data.depositPercent}%)</span>
                <span className="font-bold text-terracotta-700">${depositRequired.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
              <span>Total estimado</span>
              <span className="text-terracotta-700">${totalPrice.toLocaleString('es-AR')} ARS</span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-stone-500 text-center pt-1">
            Seleccioná tus fechas de llegada y salida para calcular la tarifa total.
          </p>
        )}
      </div>

      {/* Campos de Contacto */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Nombre Completo *</label>
          <input type="text" required value={guestName} onChange={(e) => onGuestNameChange(e.target.value)} placeholder="Ej. Martín Gómez" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Teléfono / WhatsApp *</label>
          <input type="tel" required value={guestPhone} onChange={(e) => onGuestPhoneChange(e.target.value)} placeholder="Ej. +54 9 351 123 4567" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Email de Contacto</label>
          <input type="email" value={guestEmail} onChange={(e) => onGuestEmailChange(e.target.value)} placeholder="tucorreo@ejemplo.com" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ backgroundColor: '#C95627', color: '#ffffff' }}
          className="w-full py-3 px-4 rounded-xl font-display font-bold text-xs shadow-md hover:brightness-95 active:brightness-90 disabled:opacity-50 transition-all cursor-pointer select-none text-center"
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
