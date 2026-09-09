import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { BookingStatusBadge } from './BookingStatusBadge.tsx';
import { GuestContactActions } from './GuestContactActions.tsx';
import { BookingVoucherPrint } from './BookingVoucherPrint.tsx';

export interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);

  if (!booking) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reserva ${booking.bookingCode}`}
      subtitle={`Establecimiento: ${booking.accommodation?.name || 'Alojamiento'}`}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-6">
        {/* Status and Total header */}
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--color-sand-200)]">
          <div>
            <span className="block text-xs uppercase font-bold text-[var(--color-sand-400)] mb-1">
              Estado Actual
            </span>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="text-right">
            <span className="block text-xs uppercase font-bold text-[var(--color-sand-400)] mb-1">
              Total Estadía ({booking.totalNights} noches)
            </span>
            <span className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
              ${(booking.totalAmount ?? 0).toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex flex-col gap-3 text-sm">
          <span className="text-xs uppercase font-bold text-[var(--color-sand-400)] tracking-wider">
            Datos del Huésped Titular
          </span>
          <div className="flex items-center gap-2.5 text-[var(--color-sand-900)]">
            <User className="w-4 h-4 text-[var(--color-sand-400)]" />
            <span className="font-semibold">{booking.guestName}</span>
            <span className="text-xs text-[var(--color-sand-400)]">({booking.guestCount} personas)</span>
          </div>
          <div className="flex items-center gap-2.5 text-[var(--color-sand-800)]">
            <Mail className="w-4 h-4 text-[var(--color-sand-400)]" />
            <span>{booking.guestEmail}</span>
          </div>
          <div className="flex items-center gap-2.5 text-[var(--color-sand-800)]">
            <Phone className="w-4 h-4 text-[var(--color-sand-400)]" />
            <span>{booking.guestPhone}</span>
          </div>
          {booking.guestOrigin && (
            <div className="flex items-center gap-2.5 text-[var(--color-sand-800)]">
              <MapPin className="w-4 h-4 text-[var(--color-sand-400)]" />
              <span>Procedencia: {booking.guestOrigin}</span>
            </div>
          )}
        </div>

        {/* Quick Contact and Reception Actions (WhatsApp & Voucher) */}
        <GuestContactActions
          booking={booking}
          onOpenVoucher={() => setIsVoucherOpen(true)}
        />

        {/* Dates Breakdown */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-white rounded-2xl border border-[var(--color-sand-200)] text-sm">
          <div>
            <span className="block text-xs uppercase font-bold text-[var(--color-sand-400)] mb-1">
              Check-In (Ingreso)
            </span>
            <div className="flex items-center gap-2 font-semibold text-[var(--color-sand-900)]">
              <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)]" />
              <span>{booking.checkIn}</span>
            </div>
          </div>
          <div>
            <span className="block text-xs uppercase font-bold text-[var(--color-sand-400)] mb-1">
              Check-Out (Salida)
            </span>
            <div className="flex items-center gap-2 font-semibold text-[var(--color-sand-900)]">
              <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)]" />
              <span>{booking.checkOut}</span>
            </div>
          </div>
        </div>

        {/* Guest Notes if any */}
        {booking.notes && (
          <div className="p-4 bg-[var(--color-sand-100)] rounded-2xl border border-[var(--color-sand-200)] text-xs text-[var(--color-sand-800)]">
            <span className="block font-bold text-[var(--color-sand-900)] mb-1 uppercase tracking-wider">
              Observaciones / Solicitud del Turista:
            </span>
            <p className="italic">{booking.notes}</p>
          </div>
        )}

        {/* Actions for Host */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-sand-200)]">
          {booking.status === 'PENDING' && (
            <>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onUpdateStatus(booking.id, 'CANCELLED');
                  onClose();
                }}
              >
                <XCircle className="w-4 h-4" />
                <span>Rechazar Reserva</span>
              </Button>
              <Button
                variant="emerald"
                size="sm"
                onClick={() => {
                  onUpdateStatus(booking.id, 'CONFIRMED');
                  onClose();
                }}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirmar Reserva</span>
              </Button>
            </>
          )}
          {booking.status === 'CONFIRMED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onUpdateStatus(booking.id, 'COMPLETED');
                onClose();
              }}
            >
              <span>Marcar Estadía Finalizada</span>
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>

      {/* Printable Voucher Modal */}
      <BookingVoucherPrint
        booking={booking}
        isOpen={isVoucherOpen}
        onClose={() => setIsVoucherOpen(false)}
      />
    </Modal>
  );
};
