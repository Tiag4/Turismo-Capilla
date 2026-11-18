import React from 'react';
import { formatHumanRange } from './dateUtils';

interface DateRangePickerHeaderProps {
  checkIn: string;
  checkOut: string;
  onClearDates: () => void;
  nightsCount: number | null;
  minNights?: number;
}

export const DateRangePickerHeader: React.FC<DateRangePickerHeaderProps> = ({
  checkIn,
  checkOut,
  onClearDates,
  nightsCount,
  minNights = 1,
}) => {
  const effectiveMinNights = Math.max(1, minNights || 1);
  const title = nightsCount
    ? `${nightsCount} ${nightsCount === 1 ? 'noche' : 'noches'}`
    : checkIn
      ? 'Seleccioná la fecha de salida'
      : 'Seleccioná las fechas';

  const baseSubtitle = formatHumanRange(checkIn, checkOut);
  const subtitle =
    effectiveMinNights > 1 && !checkOut
      ? checkIn
        ? `${baseSubtitle} · Estadía mínima: ${effectiveMinNights} noches`
        : `Estadía mínima: ${effectiveMinNights} noches · ${baseSubtitle}`
      : baseSubtitle;

  return (
    <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-stone-100">
      {/* Título de Noches y Subtítulo */}
      <div className="space-y-0.5">
        <h3 className="font-display font-extrabold text-lg sm:text-2xl text-stone-900 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Botón rápido para limpiar fechas si ya hay selección */}
      {(checkIn || checkOut) && (
        <button
          type="button"
          onClick={onClearDates}
          className="text-xs font-bold text-stone-500 hover:text-stone-900 underline underline-offset-2 transition-colors cursor-pointer shrink-0"
        >
          Borrar fechas
        </button>
      )}
    </div>
  );
};
