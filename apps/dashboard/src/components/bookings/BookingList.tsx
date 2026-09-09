import React, { useState } from 'react';
import { Search, Calendar, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { useHostBookings } from '../../hooks/useHostBookings.ts';
import { BookingRow } from './BookingRow.tsx';
import { BookingDetailModal } from './BookingDetailModal.tsx';
import { StatCard } from '../ui/StatCard.tsx';
import type { Booking } from '../../types/booking.types.ts';

export const BookingList: React.FC = () => {
  const {
    bookings,
    stats,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    isLoading,
    updateBookingStatus,
  } = useHostBookings();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const statusFilterButtons = [
    { id: 'ALL', label: 'Todas' },
    { id: 'PENDING', label: 'Pendientes' },
    { id: 'CONFIRMED', label: 'Confirmadas' },
    { id: 'COMPLETED', label: 'Finalizadas' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Summary Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Reservas"
          value={stats.total}
          icon={Calendar}
          iconColor="text-[var(--color-sand-800)]"
          helperText="Histórico de solicitudes"
        />
        <StatCard
          label="Pendientes de Respuesta"
          value={stats.pending}
          icon={Clock}
          iconColor="text-amber-600"
          helperText="Requieren confirmación"
        />
        <StatCard
          label="Reservas Confirmadas"
          value={stats.confirmed}
          icon={CheckCircle2}
          iconColor="text-[var(--color-emerald-portal-600)]"
          helperText="Estadías activas/próximas"
        />
        <StatCard
          label="Ingresos Proyectados"
          value={`$${stats.totalRevenue.toLocaleString('es-AR')}`}
          icon={DollarSign}
          iconColor="text-[var(--color-terracotta-500)]"
          helperText="Confirmadas y completadas"
        />
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Anti-vibecoded: Flat tabs without arbitrary card borders or decorative dots */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {statusFilterButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                filterStatus === btn.id
                  ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs'
                  : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
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

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-sand-200)] bg-[var(--color-sand-100)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                <th className="py-3 px-4">Código / Cabaña</th>
                <th className="py-3 px-4">Huésped</th>
                <th className="py-3 px-4">Fechas y Ocupación</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
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
                    onQuickStatusChange={updateBookingStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
