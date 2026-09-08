import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { CustomSelect } from '../../../ui/CustomSelect';
import { GUEST_OPTIONS } from './AccommodationStickyWidget';
import type { AccommodationDetailData } from '../types';
import type { UseAccommodationBookingReturn } from '../hooks/useAccommodationBooking';

interface AccommodationBookingFormFieldsProps {
  data: AccommodationDetailData;
  booking: UseAccommodationBookingReturn;
}

export const AccommodationBookingFormFields: React.FC<AccommodationBookingFormFieldsProps> = ({
  data,
  booking,
}) => {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    nightsCount,
    totalPrice,
    depositRequired,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
  } = booking;

  const todayStr = new Date().toISOString().split('T')[0];
  const price = data.pricePerNight ?? 0;

  return (
    <div className="space-y-4">
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
              setCheckIn(d);
              if (checkOut && d >= checkOut) setCheckOut('');
            }}
            minDate={todayStr}
            placeholder="Llegada"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
          <CustomDatePicker
            label="Salida"
            value={checkOut}
            onChange={setCheckOut}
            minDate={checkIn || todayStr}
            placeholder="Salida"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
        </div>

        <CustomSelect
          label="Huéspedes"
          value={guests}
          onChange={setGuests}
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
          <input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Ej. Martín Gómez" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Teléfono / WhatsApp *</label>
          <input type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="Ej. +54 9 351 123 4567" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-1">Email de Contacto</label>
          <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" className="w-full bg-[#fbf9f5] border border-stone-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
      </div>
    </div>
  );
};

export const AccommodationBookingForm = AccommodationBookingFormFields;
