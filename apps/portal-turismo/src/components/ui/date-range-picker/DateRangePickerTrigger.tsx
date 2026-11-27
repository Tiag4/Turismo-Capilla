import React from 'react';
import { Calendar } from 'lucide-react';
import type { FocusedRangeInput } from './types';
import { formatShortDate } from './dateUtils';

interface DateRangePickerTriggerProps {
  checkIn: string;
  checkOut: string;
  isOpen: boolean;
  focusedInput: FocusedRangeInput;
  onOpen: (focus: FocusedRangeInput) => void;
  checkInLabel?: string;
  checkOutLabel?: string;
  className?: string;
}

export const DateRangePickerTrigger = React.forwardRef<HTMLDivElement, DateRangePickerTriggerProps>(
  (
    {
      checkIn,
      checkOut,
      isOpen,
      focusedInput,
      onOpen,
      checkInLabel = 'Llegada',
      checkOutLabel = 'Salida',
      className = '',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`w-full grid grid-cols-2 bg-[#FAF8F5] border rounded-2xl overflow-hidden transition-all select-none shadow-xs ${
          isOpen ? 'border-terracotta-500 ring-2 ring-terracotta-500/20 shadow-md' : 'border-stone-300 hover:border-stone-400'
        } ${className}`}
      >
        {/* Segmento Check-in */}
        <button
          type="button"
          onClick={() => onOpen('checkIn')}
          className={`flex flex-col justify-between p-3 sm:p-3.5 text-left transition-colors cursor-pointer border-r border-stone-200/90 ${
            isOpen && focusedInput === 'checkIn'
              ? 'bg-white shadow-xs'
              : 'hover:bg-stone-100/60'
          }`}
          aria-label={`Seleccionar fecha de ${checkInLabel}`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-terracotta-700 tracking-wider uppercase mb-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span className="truncate">{checkInLabel}</span>
          </div>
          <div className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
            {checkIn ? formatShortDate(checkIn) : 'Ingreso'}
          </div>
        </button>

        {/* Segmento Check-out */}
        <button
          type="button"
          onClick={() => onOpen('checkOut')}
          className={`flex flex-col justify-between p-3 sm:p-3.5 text-left transition-colors cursor-pointer ${
            isOpen && focusedInput === 'checkOut'
              ? 'bg-white shadow-xs'
              : 'hover:bg-stone-100/60'
          }`}
          aria-label={`Seleccionar fecha de ${checkOutLabel}`}
        >
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-terracotta-700 tracking-wider uppercase mb-1">
            <Calendar className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            <span className="truncate">{checkOutLabel}</span>
          </div>
          <div className="font-display font-bold text-sm sm:text-base text-stone-900 truncate">
            {checkOut ? formatShortDate(checkOut) : 'Salida'}
          </div>
        </button>
      </div>
    );
  }
);

DateRangePickerTrigger.displayName = 'DateRangePickerTrigger';
