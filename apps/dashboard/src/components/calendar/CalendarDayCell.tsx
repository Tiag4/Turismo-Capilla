import React from 'react';
import { Lock } from 'lucide-react';
import type { CalendarDay } from '../../hooks/useHostCalendar.ts';
import type { Booking } from '../../types/booking.types.ts';
import type { DateBlock } from '../../types/date-block.types.ts';
import { DATE_BLOCK_REASON_LABELS } from '../../types/date-block.types.ts';

export interface CalendarDayCellProps {
  day: CalendarDay;
  onSelectBooking: (booking: Booking) => void;
  onSelectDateBlock?: (block: DateBlock) => void;
}

export const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  day,
  onSelectBooking,
  onSelectDateBlock,
}) => {
  return (
    <div
      className={`min-h-[110px] p-2 flex flex-col justify-between border-b border-r border-[var(--color-sand-200)] transition-colors ${
        day.isCurrentMonth ? 'bg-white' : 'bg-[var(--color-sand-50)]/70 text-[var(--color-sand-400)]'
      } ${day.isWeekend && day.isCurrentMonth ? 'bg-[var(--color-sand-50)]/30' : ''}`}
    >
      {/* Day header: number and today indicator */}
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg transition-transform ${
            day.isToday
              ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs scale-105'
              : day.isCurrentMonth
              ? 'text-[var(--color-sand-800)]'
              : 'text-[var(--color-sand-400)]'
          }`}
        >
          {day.dayNumber}
        </span>
        {day.bookings.length > 0 && (
          <span className="text-[10px] font-bold text-[var(--color-sand-400)]">
            {day.bookings.length} {day.bookings.length === 1 ? 'res.' : 'res.'}
          </span>
        )}
      </div>

      {/* Bookings pills */}
      <div className="flex flex-col gap-1 overflow-y-auto max-h-[85px] scrollbar-thin">
        {day.bookings.map((booking) => {
          const isConfirmed = booking.status === 'CONFIRMED';
          const isCheckInDay = booking.checkIn.startsWith(day.dateKey);

          return (
            <button
              key={booking.id}
              onClick={() => onSelectBooking(booking)}
              className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-bold leading-tight transition-all cursor-pointer truncate shadow-xs ${
                isConfirmed
                  ? 'bg-[#005530] text-white hover:brightness-110 active:scale-98'
                  : 'bg-amber-600 text-white hover:brightness-110 active:scale-98'
              }`}
              title={`${booking.guestName} — ${booking.accommodation?.name || 'Cabaña'} (${booking.bookingCode})`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate">{booking.guestName}</span>
                {isCheckInDay && (
                  <span className="text-[9px] uppercase px-1 rounded-xs bg-white/25 shrink-0 font-extrabold">
                    Entrada
                  </span>
                )}
              </div>
              <span className="text-[10px] opacity-80 block truncate font-medium">
                {booking.accommodation?.name || 'Cabaña'}
              </span>
            </button>
          );
        })}

        {/* Date Blocks pills */}
        {day.dateBlocks.map((block) => (
          <button
            key={block.id}
            onClick={() => onSelectDateBlock && onSelectDateBlock(block)}
            className="w-full text-left px-2 py-1 rounded-md text-[11px] font-bold leading-tight transition-all cursor-pointer truncate shadow-xs bg-zinc-700 text-white hover:bg-zinc-800 active:scale-98"
            title={`Bloqueo: ${DATE_BLOCK_REASON_LABELS[block.reason]} — ${block.accommodationName}`}
          >
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{DATE_BLOCK_REASON_LABELS[block.reason]}</span>
            </div>
            <span className="text-[10px] opacity-75 block truncate font-medium">
              {block.accommodationName}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
