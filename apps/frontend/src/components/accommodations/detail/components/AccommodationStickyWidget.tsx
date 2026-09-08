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
    <aside className="sticky top-24 w-full bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 space-y-5">
      {/* Tarifa y Noche */}
      <div className="flex items-baseline justify-between border-b border-stone-100 pb-4">
        <div>
          <span className="font-display font-black text-2xl sm:text-3xl text-stone-900">
            ${price.toLocaleString('es-AR')}
          </span>
          <span className="text-xs font-semibold text-stone-500 ml-1.5">ARS / noche</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Tarifa Oficial
        </span>
      </div>

      {/* Selectores de Fechas y Huéspedes */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2">
          <CustomDatePicker
            label="Llegada"
            value={checkIn}
            onChange={(d) => {
              setCheckIn(d);
              if (checkOut && d >= checkOut) setCheckOut('');
            }}
            minDate={todayStr}
            placeholder="Check-in"
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
          <CustomDatePicker
            label="Salida"
            value={checkOut}
            onChange={setCheckOut}
            minDate={checkIn || todayStr}
            placeholder="Check-out"
            icon={<Calendar className="w-3.5 h-3.5" />}
          />
        </div>

        <CustomSelect
          label="Huéspedes"
          value={guests}
          onChange={setGuests}
          options={GUEST_OPTIONS}
          icon={<Users className="w-3.5 h-3.5" />}
        />
      </div>

      {/* Desglose de Precios Transparente (CRO) */}
      {nightsCount && totalPrice ? (
        <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>${price.toLocaleString('es-AR')} × {nightsCount} noches</span>
            <span className="font-bold text-stone-900">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
          {depositRequired && (
            <div className="flex justify-between text-stone-600">
              <span>Seña para congelar ({data.depositPercent}%)</span>
              <span className="font-bold text-primary-700">${depositRequired.toLocaleString('es-AR')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-100">
            <span>Total Estimado</span>
            <span className="text-base text-terracotta-700">${totalPrice.toLocaleString('es-AR')}</span>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-stone-400 text-center font-medium">
          Seleccioná fechas de estadía para calcular el total
        </p>
      )}

      {/* Botones de Acción Primaria y Secundaria */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={openBookingModal}
          className="w-full py-3.5 px-4 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-display font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer select-none text-center"
        >
          Solicitar Reserva Directa
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 select-none"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
          <span>Consultar por WhatsApp</span>
        </a>
      </div>

      {/* Garantía y Microcopy de Confianza */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center pt-1 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Sin comisiones añadidas • Trato directo</span>
      </div>
    </aside>
  );
};
