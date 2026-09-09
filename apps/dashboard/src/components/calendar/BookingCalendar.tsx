import React, { useState } from 'react';
import { useHostCalendar, WEEKDAYS_ES } from '../../hooks/useHostCalendar.ts';
import { CalendarHeader } from './CalendarHeader.tsx';
import { CalendarDayCell } from './CalendarDayCell.tsx';
import { BookingDetailModal } from '../bookings/BookingDetailModal.tsx';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';

export const BookingCalendar: React.FC = () => {
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
    isLoading,
    updateBookingStatus,
  } = useHostCalendar();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    await updateBookingStatus(id, status);
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header with Navigation and Filters */}
      <CalendarHeader
        monthLabel={monthLabel}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
        onGoToToday={goToToday}
        selectedAccommodationId={selectedAccommodationId}
        onSelectAccommodation={setSelectedAccommodationId}
        accommodations={accommodations}
        monthStats={monthStats}
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
              />
            ))}
          </div>
        )}

        {/* Legend / Status Guide Footer */}
        <div className="bg-[var(--color-sand-50)] p-4 border-t border-[var(--color-sand-200)] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-[var(--color-sand-800)]">Referencias:</span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-[#005530]" />
              <span className="text-[var(--color-sand-800)] font-medium">Reserva Confirmada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-amber-600" />
              <span className="text-[var(--color-sand-800)] font-medium">Reserva Pendiente</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-xs bg-zinc-700" />
              <span className="text-[var(--color-sand-400)] font-medium">Bloqueo Administrativo (TDR-10)</span>
            </div>
          </div>
          <p className="text-[11px] text-[var(--color-sand-400)] italic">
            Hacé click en cualquier tarjeta de reserva para ver los detalles del pasajero.
          </p>
        </div>
      </div>

      {/* Booking Detail Modal for Passenger Information and Quick Action */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
