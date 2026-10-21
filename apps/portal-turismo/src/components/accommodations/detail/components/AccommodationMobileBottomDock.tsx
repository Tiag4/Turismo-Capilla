import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Users, Calendar, AlertTriangle } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationMobileBottomDockProps {
  data: AccommodationDetailData;
  nightsCount: number | null;
  totalPrice: number | null;
  wizardUrl: string;
  isVisible?: boolean;
  totalSelectedRooms?: number;
  totalSelectedCapacity?: number;
  totalRequestedGuests?: number;
  isCapacitySufficient?: boolean;
}

export const AccommodationMobileBottomDock: React.FC<AccommodationMobileBottomDockProps> = ({
  data,
  nightsCount,
  totalPrice,
  wizardUrl,
  isVisible = true,
  totalSelectedRooms = 1,
  totalSelectedCapacity = 4,
  totalRequestedGuests = 2,
  isCapacitySufficient = true,
}) => {
  const price = data.pricePerNight ?? 0;
  const displayNights = nightsCount && nightsCount > 0 ? nightsCount : 1;
  const displayTotal = totalPrice ?? price * displayNights;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 sm:px-8 py-3 shadow-2xl transition-all duration-300 transform ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Resumen de Selección en Tiempo Real */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl text-stone-900">
                ${displayTotal.toLocaleString('es-AR')} ARS
              </span>
              <span className="text-[11px] font-semibold text-stone-500">
                total ({displayNights} {displayNights === 1 ? 'noche' : 'noches'})
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-stone-600 mt-0.5">
              <span className="inline-flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5 text-terracotta-600" />
                {totalSelectedRooms} {totalSelectedRooms === 1 ? 'habitación' : 'habitaciones'}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-terracotta-600" />
                {totalRequestedGuests} huéspedes (cap. máx. {totalSelectedCapacity})
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-uritorco-600">
                <Calendar className="w-3.5 h-3.5" />
                Reserva directa sin comisiones
              </span>
            </div>
          </div>
        </div>

        {/* Acción / Validación previa al Checkout */}
        <div className="flex items-center gap-3 ml-auto">
          {!isCapacitySufficient && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-extrabold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Capacidad insuficiente ({totalSelectedCapacity}/{totalRequestedGuests})</span>
            </span>
          )}

          {totalSelectedRooms > 0 && isCapacitySufficient ? (
            <Link
              to={wizardUrl}
              className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none block text-center"
            >
              Continuar con la Reserva
            </Link>
          ) : (
            <a
              href="#inventario-habitaciones"
              className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer select-none block text-center"
            >
              Seleccionar habitaciones
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

