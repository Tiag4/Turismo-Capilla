import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare } from 'lucide-react';
import { CustomDatePicker } from '../../../ui/CustomDatePicker';
import { AccommodationGuestsPicker } from './AccommodationGuestsPicker';
import type { AccommodationDetailData } from '../types';
import type { UseAccommodationBookingReturn } from '../hooks/useAccommodationBooking';

interface AccommodationStickyWidgetProps {
  data: AccommodationDetailData;
  booking: UseAccommodationBookingReturn;
}

export const AccommodationStickyWidget: React.FC<AccommodationStickyWidgetProps> = ({
  data,
  booking,
}) => {
  const {
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guestsSelection,
    setGuestsSelection,
    selectedRoomsList,
    totalSelectedRooms,
    totalSelectedCapacity,
    totalRequestedGuests,
    isCapacitySufficient,
    effectiveNightlyRate,
    wizardUrl,
    nightsCount,
    totalPrice,
    depositRequired,
    whatsappUrl,
  } = booking;

  const todayStr = new Date().toISOString().split('T')[0];
  const price = effectiveNightlyRate ?? data.pricePerNight ?? 0;
  const displayNights = nightsCount && nightsCount > 0 ? nightsCount : 1;
  const displayTotal = totalPrice ?? price * displayNights;

  return (
    <aside className="md:sticky md:top-24 w-full bg-white rounded-2xl border border-stone-200 shadow-md p-6 space-y-4">
      {/* Tarifa / Precio por noche acumulado */}
      <div className="space-y-0.5">
        <span className="text-xs font-medium text-stone-500 block">
          {totalSelectedRooms > 1
            ? `Tarifa por noche (${totalSelectedRooms} unidades)`
            : 'Precio por noche'}
        </span>
        <div className="font-display font-extrabold text-3xl text-stone-900 tracking-tight">
          ${price.toLocaleString('es-AR')} ARS
        </div>
      </div>

      {/* Selectores de Fechas y Ocupación */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-2 gap-2.5 items-stretch">
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

        {/* Selector avanzado de Ocupación */}
        <AccommodationGuestsPicker
          value={guestsSelection}
          onChange={setGuestsSelection}
        />
      </div>

      {/* Desglose de Inventario y Tarifas en Tiempo Real */}
      <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
        {selectedRoomsList && selectedRoomsList.length > 0 ? (
          <div className="space-y-1 pb-1.5 border-b border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
              Inventario seleccionado
            </span>
            {selectedRoomsList.map(({ room, quantity }) => (
              <div key={room.id} className="flex justify-between text-stone-700">
                <span className="truncate pr-2">
                  {quantity}× {room.name}
                </span>
                <span className="font-bold text-stone-900 shrink-0">
                  ${(room.pricePerNight * quantity).toLocaleString('es-AR')}/noche
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-amber-700 font-bold py-1">
            Seleccioná al menos 1 unidad en el listado inferior.
          </div>
        )}

        <div className="flex justify-between text-stone-600 pt-1">
          <span>
            ${price.toLocaleString('es-AR')} × {displayNights}{' '}
            {displayNights === 1 ? 'noche' : 'noches'}
          </span>
          <span className="font-bold text-stone-900">
            ${displayTotal.toLocaleString('es-AR')}
          </span>
        </div>

        {depositRequired && (
          <div className="flex justify-between text-stone-600">
            <span>Seña ({data.depositPercent}%)</span>
            <span className="font-bold text-terracotta-700">
              ${depositRequired.toLocaleString('es-AR')}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-100">
          <span>Total estimado</span>
          <span className="text-base text-terracotta-700">
            ${displayTotal.toLocaleString('es-AR')} ARS
          </span>
        </div>
      </div>

      {/* Validación de Capacidad Previa al Checkout */}
      {!isCapacitySufficient && (
        <div className="p-2.5 rounded-xl bg-sand-100 border border-sand-300 text-[11px] text-stone-800 font-semibold flex items-center justify-between gap-2">
          <span>
            Capacidad cubierta: {totalSelectedCapacity}/{totalRequestedGuests} huéspedes.
          </span>
          <a
            href="#inventario-habitaciones"
            className="text-terracotta-700 font-extrabold underline shrink-0"
          >
            Sumar unidad
          </a>
        </div>
      )}

      {/* Botón Solicitar reserva directo al Wizard */}
      <div className="space-y-2 pt-1">
        {totalSelectedRooms > 0 && isCapacitySufficient ? (
          <Link
            to={wizardUrl}
            style={{ backgroundColor: '#C95627', color: '#ffffff' }}
            className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-base shadow-sm hover:brightness-95 active:brightness-90 transition-all cursor-pointer select-none text-center block"
          >
            Solicitar reserva
          </Link>
        ) : (
          <a
            href="#inventario-habitaciones"
            className="w-full py-3.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-display font-bold text-sm transition-colors cursor-pointer select-none text-center block"
          >
            Ajustar habitaciones para {totalRequestedGuests} huéspedes
          </a>
        )}

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
    </aside>
  );
};

