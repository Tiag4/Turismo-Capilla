import React from 'react';
import { Eye, Check, X } from 'lucide-react';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';
import { BookingStatusBadge } from './BookingStatusBadge.tsx';
import { Button } from '../ui/Button.tsx';

export interface BookingRowProps {
  booking: Booking;
  onViewDetail: (booking: Booking) => void;
  onQuickStatusChange: (id: string, status: BookingStatus) => void;
}

export const BookingRow: React.FC<BookingRowProps> = ({
  booking,
  onViewDetail,
  onQuickStatusChange,
}) => {
  return (
    <tr className="border-b border-[var(--color-sand-200)] hover:bg-[var(--color-sand-50)] transition-colors">
      <td className="py-3.5 px-4">
        <span className="font-mono text-xs font-bold text-[var(--color-sand-900)] block">
          {booking.bookingCode}
        </span>
        <span className="text-[11px] text-[var(--color-sand-400)] block">
          {booking.accommodation?.name || 'Alojamiento'}
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm">
        <span className="font-semibold text-[var(--color-sand-900)] block">
          {booking.guestName}
        </span>
        <span className="text-[11px] text-[var(--color-sand-400)] block">
          {booking.guestPhone}
        </span>
      </td>
      <td className="py-3.5 px-4 text-xs text-[var(--color-sand-800)]">
        <div>
          <span className="font-medium text-[var(--color-sand-900)]">{booking.checkIn}</span> al{' '}
          <span className="font-medium text-[var(--color-sand-900)]">{booking.checkOut}</span>
        </div>
        <span className="text-[11px] text-[var(--color-sand-400)]">
          {booking.totalNights} {booking.totalNights === 1 ? 'noche' : 'noches'} · {booking.guestCount} pers.
        </span>
      </td>
      <td className="py-3.5 px-4 text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
        ${(booking.totalAmount ?? 0).toLocaleString('es-AR')}
      </td>
      <td className="py-3.5 px-4">
        <BookingStatusBadge status={booking.status} />
      </td>
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail(booking)}
            title="Ver ficha completa"
            className="p-1.5"
          >
            <Eye className="w-4 h-4 text-[var(--color-sand-800)]" />
          </Button>

          {booking.status === 'PENDING' && (
            <>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => onQuickStatusChange(booking.id, 'CONFIRMED')}
                title="Confirmar reserva"
                className="p-1.5"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onQuickStatusChange(booking.id, 'CANCELLED')}
                title="Rechazar reserva"
                className="p-1.5"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};
