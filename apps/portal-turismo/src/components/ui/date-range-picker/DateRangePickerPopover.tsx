import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FloatingCoords } from '../useSmartFloating';
import type { FocusedRangeInput } from './types';
import { DateRangePickerHeader } from './DateRangePickerHeader';
import { DateRangeMonthCalendar } from './DateRangeMonthCalendar';

interface DateRangePickerPopoverProps {
  isOpen: boolean;
  isVisible: boolean;
  coords: FloatingCoords | null;
  checkIn: string;
  checkOut: string;
  focusedInput: FocusedRangeInput;
  hoverDate: string | null;
  setHoverDate: (date: string | null) => void;
  viewYear: number;
  viewMonth: number;
  secondMonthYear: number;
  secondMonth: number;
  canGoPrev: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  isDateDisabled: (dateStr: string) => boolean;
  onSelectDate: (dateStr: string) => void;
  onClearDates: () => void;
  nightsCount: number | null;
  minNights?: number;
  onClose: () => void;
}

export const DateRangePickerPopover = React.forwardRef<HTMLDivElement, DateRangePickerPopoverProps>(
  (
    {
      isOpen,
      isVisible,
      coords,
      checkIn,
      checkOut,
      focusedInput,
      hoverDate,
      setHoverDate,
      viewYear,
      viewMonth,
      secondMonthYear,
      secondMonth,
      canGoPrev,
      onPrevMonth,
      onNextMonth,
      isDateDisabled,
      onSelectDate,
      onClearDates,
      nightsCount,
      minNights = 1,
      onClose,
    },
    ref
  ) => {
    // ESC close listener
    useEffect(() => {
      if (!isOpen) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!coords) return null;

    const isModal = coords.isModal;

    const popoverContent = (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Selector de fechas de estadía"
        className={`bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-4 sm:p-5 transition-all duration-200 ease-out flex flex-col ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        } ${isModal ? 'w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto' : 'w-[640px] max-w-[95vw] max-h-[calc(100vh-2rem)] overflow-y-auto'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera informativa */}
        <DateRangePickerHeader
          checkIn={checkIn}
          checkOut={checkOut}
          onClearDates={onClearDates}
          nightsCount={nightsCount}
          minNights={minNights}
        />

        {/* Contenedor de Calendarios con Flechas de Navegación */}
        <div className="relative pt-4 sm:pt-6">
          {/* Botón Mes Anterior */}
          <button
            type="button"
            disabled={!canGoPrev}
            onClick={onPrevMonth}
            className={`absolute top-4 sm:top-6 left-0 z-10 p-2 rounded-full border border-stone-200 bg-white transition-all ${
              canGoPrev
                ? 'text-stone-700 hover:bg-stone-100 hover:border-stone-400 cursor-pointer shadow-xs'
                : 'text-stone-300 border-stone-100 cursor-not-allowed opacity-40'
            }`}
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Botón Mes Siguiente */}
          <button
            type="button"
            onClick={onNextMonth}
            className="absolute top-4 sm:top-6 right-0 z-10 p-2 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 hover:border-stone-400 transition-all cursor-pointer shadow-xs"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Grillas de Meses: 2 columnas en desktop / 1 en mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 px-2">
            <DateRangeMonthCalendar
              year={viewYear}
              monthIndex={viewMonth}
              checkIn={checkIn}
              checkOut={checkOut}
              hoverDate={hoverDate}
              focusedInput={focusedInput}
              isDateDisabled={isDateDisabled}
              onSelectDate={onSelectDate}
              onHoverDate={setHoverDate}
            />

            <div className="hidden sm:block">
              <DateRangeMonthCalendar
                year={secondMonthYear}
                monthIndex={secondMonth}
                checkIn={checkIn}
                checkOut={checkOut}
                hoverDate={hoverDate}
                focusedInput={focusedInput}
                isDateDisabled={isDateDisabled}
                onSelectDate={onSelectDate}
                onHoverDate={setHoverDate}
              />
            </div>
          </div>
        </div>

        {/* Pie de Acciones */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClearDates}
            disabled={!checkIn && !checkOut}
            className="text-xs font-bold text-stone-700 hover:text-stone-950 underline underline-offset-4 disabled:opacity-30 disabled:no-underline cursor-pointer transition-colors"
          >
            Borrar fechas
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer select-none"
          >
            Cerrar
          </button>
        </div>
      </div>
    );

    // If mobile modal, render backdrop
    if (isModal) {
      return (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-3 transition-opacity duration-200 ${
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs" aria-hidden="true" />
          {popoverContent}
        </div>
      );
    }

    // Desktop floating popover
    return (
      <div
        style={{
          position: 'fixed',
          top: coords.top !== undefined ? `${coords.top}px` : 'auto',
          bottom: coords.bottom !== undefined ? `${coords.bottom}px` : 'auto',
          left: `${coords.left}px`,
          zIndex: 50,
        }}
      >
        {popoverContent}
      </div>
    );
  }
);

DateRangePickerPopover.displayName = 'DateRangePickerPopover';
