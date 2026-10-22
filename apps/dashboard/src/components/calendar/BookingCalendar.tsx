import React, { useState } from 'react';
import { useHostCalendar, WEEKDAYS_ES } from '../../hooks/useHostCalendar.ts';
import { CalendarHeader } from './CalendarHeader.tsx';
import { CalendarDayCell } from './CalendarDayCell.tsx';
import { BookingDetailModal } from '../bookings/BookingDetailModal.tsx';
import { DateBlockDetailModal } from './DateBlockDetailModal.tsx';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';
import type { DateBlock } from '../../types/date-block.types.ts';

export interface BookingCalendarProps {
  onNavigateCreateBlock?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onNavigateCreateBlock,
}) => {
  const {
    calendarDays,
    monthLabel,
    prevMonth,
    nextMonth,
    goToToday,
    selectedAccommodationId,
    setSelectedAccommodationId,
    accommodations,
    monthStats,
    deleteBlock,
    isLoading,
    updateBookingStatus,
  } = useHostCalendar();

  // Booking detail modal state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Date block detail modal state
  const [selectedBlock, setSelectedBlock] = useState<DateBlock | null>(null);
  const [isBlockDetailOpen, setIsBlockDetailOpen] = useState(false);

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
  };

  const handleSelectDateBlock = (block: DateBlock) => {
    setSelectedBlock(block);
    setIsBlockDetailOpen(true);
  };

  const handleDeleteBlock = (id: string) => {
    deleteBlock(id);
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation, Filters and Block Action */}
      <CalendarHeader
        monthLabel={monthLabel}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onGoToToday={goToToday}
        selectedAccommodationId={selectedAccommodationId}
        onSelectAccommodation={setSelectedAccommodationId}
        accommodations={accommodations}
        monthStats={monthStats}
        onOpenBlockModal={() => onNavigateCreateBlock?.()}
      />

      {/* Main Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] shadow-xs overflow-hidden">
        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 bg-[var(--color-sand-100)] border-b border-[var(--color-sand-200)] text-center py-2.5">
          {WEEKDAYS_ES.map((day, idx) => (
            <div
              key={day}
              className={`text-xs font-bold uppercase tracking-wider ${
                idx >= 5 ? 'text-[var(--color-terracotta-600)]' : 'text-[var(--color-sand-800)]'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days Matrix */}
        {isLoading ? (
          <div className="py-24 text-center">
            <div className="w-8 h-8 border-3 border-[var(--color-terracotta-500)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-[var(--color-sand-400)]">
              Cargando cuadrícula de ocupación...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => (
              <CalendarDayCell
                key={day.dateKey}
                day={day}
                onSelectBooking={handleSelectBooking}
                onSelectDateBlock={handleSelectDateBlock}
              />
            ))}
          </div>
        )}

        {/* Legend Footer */}
        <div className="bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--color-emerald-portal-600)]" />
              <span className="text-[var(--color-sand-800)] font-medium">Confirmada</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[var(--color-terracotta-500)]" />
              <span className="text-[var(--color-sand-800)] font-medium">Pendiente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-zinc-700" />
              <span className="text-[var(--color-sand-800)] font-medium">Bloqueo Administrativo (TDR-10)</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--color-sand-400)] italic">
            Hacé click en cualquier tarjeta o bloqueo para ver detalles o modificarlo.
          </p>
        </div>
      </div>

      {/* Booking Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Date Block Detail Modal (Ver/Eliminar Bloqueo) */}
      <DateBlockDetailModal
        block={selectedBlock}
        isOpen={isBlockDetailOpen}
        onClose={() => {
          setIsBlockDetailOpen(false);
          setSelectedBlock(null);
        }}
        onDeleteBlock={handleDeleteBlock}
      />
    </div>
  );
};
