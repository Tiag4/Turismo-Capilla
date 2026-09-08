import React from 'react';
import type { AccommodationDetailData } from '../types';

interface AccommodationMobileBottomDockProps {
  data: AccommodationDetailData;
  nightsCount: number | null;
  totalPrice: number | null;
  onOpenBookingModal: () => void;
}

export const AccommodationMobileBottomDock: React.FC<AccommodationMobileBottomDockProps> = ({
  data,
  nightsCount,
  totalPrice,
  onOpenBookingModal,
}) => {
  const price = data.pricePerNight ?? 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-5 py-3 shadow-2xl flex items-center justify-between">
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-display font-black text-lg text-stone-900">
            ${(totalPrice ?? price).toLocaleString('es-AR')}
          </span>
          <span className="text-[11px] font-semibold text-stone-500">
            {nightsCount ? `por ${nightsCount} noches` : '/ noche'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 block">
          Sin intermediarios
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenBookingModal}
        className="px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-display font-bold text-xs shadow-md transition-all cursor-pointer select-none"
      >
        Reservar
      </button>
    </div>
  );
};
