import React, { useState, useMemo } from 'react';
import { Search, Calendar, CheckCircle2, Clock, DollarSign, Eye, Check, X } from 'lucide-react';
import { useHostBookings } from '../../hooks/useHostBookings.ts';
import { BookingRow } from './BookingRow.tsx';
import { BookingStatusBadge } from './BookingStatusBadge.tsx';
import { BookingDetailModal } from './BookingDetailModal.tsx';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { Button } from '../ui/Button.tsx';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';

export const BookingList: React.FC = () => {
  const {
    bookings,
    stats,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    updateBookingStatus,
  } = useHostBookings();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    booking: Booking;
    status: BookingStatus;
  } | null>(null);

  const statusFilterButtons = [
    { id: 'ALL', label: 'Todas' },
    { id: 'PENDING', label: 'Pendientes' },
    { id: 'CONFIRMED', label: 'Confirmadas' },
    { id: 'COMPLETED', label: 'Finalizadas' },
  ];

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Total Reservas',
      value: stats.total,
      icon: Calendar,
      iconColor: 'text-[var(--color-sand-600)]',
      helperText: 'Histórico de solicitudes',
    },
    {
      label: 'Pendientes de Respuesta',
      value: stats.pending,
      icon: Clock,
      iconColor: 'text-amber-600',
      helperText: 'Requieren confirmación',
    },
    {
      label: 'Reservas Confirmadas',
      value: stats.confirmed,
      icon: CheckCircle2,
      iconColor: 'text-[var(--color-emerald-portal-600)]',
      helperText: 'Estadías activas/próximas',
    },
    {
      label: 'Ingresos Proyectados',
      value: `$${stats.totalRevenue.toLocaleString('es-AR')}`,
      icon: DollarSign,
      iconColor: 'text-[var(--color-terracotta-500)]',
      helperText: 'Confirmadas y completadas',
    },
  ], [stats]);

  return (
    <div className="flex flex-col gap-6">
      {/* High-density metrics strip (Flat, zero floating card) */}
      <InlineStatStrip stats={statItems} />

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800"
        >
          {error}
        </div>
      )}

      {/* Filter and Search Controls (Direct on canvas) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {statusFilterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === btn.id
                  ? 'bg-[var(--color-sand-900)] text-white shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--color-sand-400)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código, huésped o cabaña..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[var(--color-sand-300)] bg-white text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-terracotta-500)]"
          />
        </div>
      </div>

      {/* Mobile View: Stacked Card Rows (Zero Tables on Mobile, Strict interface-design Rule) */}
      <div className="block md:hidden divide-y divide-[var(--color-sand-200)] border-y border-[var(--color-sand-300)]">
        {isLoading ? (
          <div className="py-8 text-center text-xs text-[var(--color-sand-400)]">
            Cargando reservas del sistema...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--color-sand-400)]">
            No se encontraron reservas con los filtros seleccionados.
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="py-3.5 px-3 flex flex-col gap-2.5 bg-white hover:bg-[var(--color-sand-50)] transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-['Outfit'] font-bold tabular-nums tracking-wide text-xs text-[var(--color-sand-900)] block">
                    {booking.bookingCode}
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--color-sand-600)] block mt-0.5">
                    {booking.accommodationName || booking.accommodation?.name || 'Alojamiento'}
                  </span>
                </div>
                <BookingStatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-[var(--color-sand-100)]">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] tracking-wider block">
                    Huésped
                  </span>
                  <span className="font-semibold text-[var(--color-sand-800)] block truncate">
                    {booking.guestName}
                  </span>
                  {booking.guestPhone && (
                    <span className="text-[11px] text-[var(--color-sand-500)] block truncate">
                      {booking.guestPhone}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] tracking-wider block">
                    Fechas y Ocupación
                  </span>
                  <span className="font-medium text-[var(--color-sand-800)] block text-[11px]">
                    {booking.checkIn} al {booking.checkOut}
                  </span>
                  <span className="text-[10px] text-[var(--color-sand-500)] tabular-nums">
                    {booking.totalNights} {booking.totalNights === 1 ? 'noche' : 'noches'} · {booking.guestCount} pers.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] tracking-wider block">
                    Total
                  </span>
                  <span className="text-sm font-black text-[var(--color-sand-900)] font-['Outfit'] tabular-nums">
                    ${(booking.totalAmount ?? 0).toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedBooking(booking)}
                    className="px-2.5 py-1 text-xs font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--color-sand-700)]" />
                    <span>Ficha</span>
                  </Button>
                  {booking.status === 'PENDING' && (
                    <>
                      <Button
                        variant="emerald"
                        size="sm"
                        onClick={() => setPendingStatusChange({ booking, status: 'CONFIRMED' })}
                        className="px-2.5 py-1 text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirmar</span>
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setPendingStatusChange({ booking, status: 'CANCELLED' })}
                        className="px-2 py-1 text-xs font-bold"
                        title="Rechazar reserva"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Traditional Data Table */}
      <div className="hidden md:block overflow-x-auto border-y border-[var(--color-sand-300)]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-sand-300)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-500)]">
              <th className="py-3 px-3 sm:px-4">Código / Cabaña</th>
              <th className="py-3 px-3 sm:px-4">Huésped</th>
              <th className="py-3 px-3 sm:px-4">Fechas y Ocupación</th>
              <th className="py-3 px-3 sm:px-4">Total</th>
              <th className="py-3 px-3 sm:px-4">Estado</th>
              <th className="py-3 px-3 sm:px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-sand-200)]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--color-sand-400)]">
                  Cargando reservas del sistema...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-[var(--color-sand-400)]">
                  No se encontraron reservas con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onViewDetail={(b) => setSelectedBooking(b)}
                  onQuickStatusChange={(b, s) => setPendingStatusChange({ booking: b, status: s })}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Quick Status Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(pendingStatusChange)}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={async () => {
          if (pendingStatusChange) {
            const target = pendingStatusChange;
            setPendingStatusChange(null);
            await updateBookingStatus(target.booking.id, target.status);
          }
        }}
        variant={pendingStatusChange?.status === 'CONFIRMED' ? 'emerald' : 'danger'}
        title={
          pendingStatusChange?.status === 'CONFIRMED'
            ? 'Confirmar Reserva'
            : 'Rechazar Reserva'
        }
        description={
          pendingStatusChange?.status === 'CONFIRMED'
            ? `¿Estás seguro de que deseas confirmar la reserva ${pendingStatusChange.booking.bookingCode} de ${pendingStatusChange.booking.guestName}? Se reservará el período del ${pendingStatusChange.booking.checkIn} al ${pendingStatusChange.booking.checkOut}.`
            : `¿Estás seguro de que deseas rechazar la reserva ${pendingStatusChange?.booking.bookingCode} de ${pendingStatusChange?.booking.guestName}? Esta acción liberará las fechas en el calendario.`
        }
        confirmLabel={
          pendingStatusChange?.status === 'CONFIRMED'
            ? 'Confirmar Reserva'
            : 'Rechazar Reserva'
        }
      />

      {/* Detail Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        onUpdateStatus={updateBookingStatus}
      />
    </div>
  );
};
