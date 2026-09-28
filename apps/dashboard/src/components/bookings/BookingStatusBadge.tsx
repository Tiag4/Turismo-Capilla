import React from 'react';
import type { BookingStatus } from '../../types/booking.types.ts';

export interface BookingStatusBadgeProps {
  status: BookingStatus;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  // Anti-vibecoded Rule 27: Badges MUST have 100% solid, opaque backgrounds and high contrast text.
  // Strictly prohibited: pastel or semi-transparent backgrounds like bg-amber-100.
  const config = {
    PENDING: {
      label: 'Pendiente',
      className: 'bg-amber-600 text-white',
    },
    CONFIRMED: {
      label: 'Confirmada',
      className: 'bg-[#005530] text-white',
    },
    CANCELLED: {
      label: 'Cancelada',
      className: 'bg-rose-700 text-white',
    },
    COMPLETED: {
      label: 'Completada',
      className: 'bg-zinc-800 text-white',
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${config.className}`}
    >
      {config.label}
    </span>
  );
};
