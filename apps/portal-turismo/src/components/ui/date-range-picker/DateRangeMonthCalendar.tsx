import React from 'react';
import type { FocusedRangeInput } from './types';
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  toISODateString,
  getDaysInMonth,
  getFirstWeekdayIndex,
  getTodayISOString,
} from './dateUtils';

interface DateRangeMonthCalendarProps {
  year: number;
  monthIndex: number;
  checkIn: string;
  checkOut: string;
  hoverDate: string | null;
  focusedInput: FocusedRangeInput;
  isDateDisabled: (dateStr: string) => boolean;
  onSelectDate: (dateStr: string) => void;
  onHoverDate: (dateStr: string | null) => void;
}

export const DateRangeMonthCalendar: React.FC<DateRangeMonthCalendarProps> = ({
  year,
  monthIndex,
  checkIn,
  checkOut,
  hoverDate,
  focusedInput,
  isDateDisabled,
  onSelectDate,
  onHoverDate,
}) => {
  const monthName = MONTH_NAMES[monthIndex];
  const daysCount = getDaysInMonth(year, monthIndex);
  const firstDayOffset = getFirstWeekdayIndex(year, monthIndex);
  const todayStr = getTodayISOString();

  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayOffset }, (_, i) => i);

  return (
    <div className="w-full flex flex-col select-none">
      {/* Título de Mes y Año */}
      <div className="text-center font-display font-bold text-sm sm:text-base text-stone-900 pb-3">
        {monthName} de {year}
      </div>

      {/* Días de la Semana: L M X J V S D */}
      <div className="grid grid-cols-7 mb-1 text-center">
        {WEEKDAY_LABELS.map((w, idx) => (
          <span
            key={idx}
            className="text-[11px] font-bold text-stone-400 py-1"
          >
            {w}
          </span>
        ))}
      </div>

      {/* Grilla de Días */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {/* Espacios vacíos antes del día 1 */}
        {blanksArray.map((b) => (
          <div key={`blank-${b}`} className="h-8 sm:h-8.5" />
        ))}

        {/* Celdas de días del mes */}
        {daysArray.map((day) => {
          const dateStr = toISODateString(year, monthIndex, day);
          const disabled = isDateDisabled(dateStr);
          const isCheckIn = dateStr === checkIn;
          const isCheckOut = dateStr === checkOut;

          // Range calculation
          const isInRange = Boolean(
            checkIn && checkOut && dateStr > checkIn && dateStr < checkOut
          );

          // Hover preview when selecting checkout
          const isHoverRange = Boolean(
            focusedInput === 'checkOut' &&
              checkIn &&
              !checkOut &&
              hoverDate &&
              dateStr > checkIn &&
              dateStr <= hoverDate &&
              !disabled
          );

          const hasRangeRight =
            isCheckIn && (Boolean(checkOut) || (Boolean(hoverDate) && (hoverDate ?? '') > checkIn));
          const hasRangeLeft =
            (isCheckOut && Boolean(checkIn)) ||
            (focusedInput === 'checkOut' &&
              Boolean(hoverDate) &&
              dateStr === hoverDate &&
              Boolean(checkIn) &&
              (hoverDate ?? '') > checkIn);
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className={`relative h-8 sm:h-8.5 flex items-center justify-center p-0 ${
                isInRange || isHoverRange ? 'bg-stone-100' : ''
              } ${hasRangeRight ? 'rounded-l-full bg-gradient-to-r from-transparent to-stone-100' : ''} ${
                hasRangeLeft ? 'rounded-r-full bg-gradient-to-l from-transparent to-stone-100' : ''
              }`}
              onMouseEnter={() => !disabled && onHoverDate(dateStr)}
              onMouseLeave={() => onHoverDate(null)}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(dateStr)}
                className={`w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-xs font-semibold transition-all relative z-10 ${
                  disabled
                    ? 'text-stone-300 line-through cursor-not-allowed'
                    : isCheckIn || isCheckOut
                      ? 'bg-terracotta-600 text-white font-bold shadow-sm shadow-terracotta-600/30'
                      : isInRange || isHoverRange
                        ? 'text-stone-900 hover:bg-stone-200/80 cursor-pointer'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950 cursor-pointer'
                } ${isToday && !isCheckIn && !isCheckOut ? 'ring-1 ring-terracotta-500 font-extrabold text-terracotta-700' : ''}`}
                aria-label={`${day} de ${monthName} de ${year}${disabled ? ' (No disponible)' : ''}`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
