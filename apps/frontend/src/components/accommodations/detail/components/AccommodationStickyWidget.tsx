import React from 'react';
import { Calendar, Users, MessageSquare, ShieldCheck } from 'lucide-react';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { CustomSelect, type Option } from '../../../ui/CustomSelect';
import type { AccommodationDetailData } from '../types';
import type { UseAccommodationBookingReturn } from '../hooks/useAccommodationBooking';

interface AccommodationStickyWidgetProps {
  data: AccommodationDetailData;
  booking: UseAccommodationBookingReturn;
}

const GUEST_OPTIONS: Option[] = [
  { value: '1', label: '1 persona' },
  { value: '2', label: '2 personas' },
  { value: '3', label: '3 personas' },
  { value: '4', label: '4 personas' },
  { value: '5', label: '5+ personas' },
];

export const AccommodationStickyWidget: React.FC<AccommodationStickyWidgetProps> = ({
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
    openBookingModal,
    whatsappUrl,
  } = booking;

  const todayStr = new Date().toISOString().split('T')[0];
  const price = data.pricePerNight ?? 0;

  return (
    <aside className="sticky top-24 w-full bg-white rounded-2xl border border-stone-200 shadow-md p-6 space-y-4">
      {/* Tarifa / Price per night */}
      <div className="space-y-0.5">
        <span className="text-xs font-medium text-stone-500 block">
          Price per night
        </span>
        <div className="font-display font-extrabold text-3xl text-stone-900 tracking-tight">
          ${price.toLocaleString('es-AR')} ARS
        </div>
      </div>

      {/* Selectores de Fechas: Arrival Date & Departure Date */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-2.5">
          <CustomDatePicker
            label="Arrival Date"
            value={checkIn}
            onChange={(d) => {
              setCheckIn(d);
              if (checkOut && d >= checkOut) setCheckOut('');
            }}
            minDate={todayStr}
            placeholder="Arrival"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
          <CustomDatePicker
            label="Departure Date"
            value={checkOut}
            onChange={setCheckOut}
            minDate={checkIn || todayStr}
            placeholder="Departure"
            icon={<Calendar className="w-3.5 h-3.5 text-stone-400" />}
          />
        </div>

        {/* Guest Count */}
        <CustomSelect
          label="Guest Count"
          value={guests}
          onChange={setGuests}
          options={GUEST_OPTIONS}
          icon={<Users className="w-3.5 h-3.5 text-stone-400" />}
        />
      </div>

      {/* Desglose de Precios cuando hay fechas seleccionadas */}
      {nightsCount && totalPrice ? (
        <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>${price.toLocaleString('es-AR')} × {nightsCount} nights</span>
            <span className="font-bold text-stone-900">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
          {depositRequired && (
            <div className="flex justify-between text-stone-600">
              <span>Deposit ({data.depositPercent}%)</span>
              <span className="font-bold text-terracotta-700">${depositRequired.toLocaleString('es-AR')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-100">
            <span>Total</span>
            <span className="text-base text-terracotta-700">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
        </div>
      ) : null}

      {/* Botón Reserve Now fiel a la captura */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={openBookingModal}
          className="w-full py-3.5 px-4 rounded-xl bg-[#C95627] hover:bg-[#b54a1e] active:bg-[#9e3e18] text-white font-display font-bold text-base shadow-sm hover:shadow transition-all cursor-pointer select-none text-center"
        >
          Reserve Now
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 select-none"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>

      {/* Microcopy de Confianza */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400 text-center select-none pt-1">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Official Direct Booking • No hidden fees</span>
      </div>
    </aside>
  );
};
