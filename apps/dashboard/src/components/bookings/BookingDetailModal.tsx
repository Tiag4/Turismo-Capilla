import React, { useState } from 'react';
import { Calendar, User, Phone, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { Booking, BookingStatus } from '../../types/booking.types.ts';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
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
  const [confirmStatus, setConfirmStatus] = useState<BookingStatus | null>(null);

  // Preserve booking data while closing to avoid abrupt unmount during exit transition
  const [cachedBooking, setCachedBooking] = useState<Booking | null>(booking);

  React.useEffect(() => {
    if (booking) {
      setCachedBooking(booking);
    }
  }, [booking]);

  const activeBooking = booking || cachedBooking;
  if (!activeBooking) return null;

  const handleConfirmAction = () => {
    if (!confirmStatus) return;
    onUpdateStatus(activeBooking.id, confirmStatus);
    setConfirmStatus(null);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Reserva ${activeBooking.bookingCode}`}
        subtitle={`Establecimiento: ${activeBooking.accommodation?.name || 'Alojamiento'}`}
        maxWidth="lg"
      >
        <div className="flex flex-col gap-6">
          {/* Status and Total header */}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[var(--color-sand-200)]">
            <div>
              <span className="block text-xs uppercase font-bold text-[var(--color-sand-500)] mb-1">
                Estado Actual
              </span>
              <BookingStatusBadge status={activeBooking.status} />
            </div>
            <div className="text-right">
              <span className="block text-xs uppercase font-bold text-[var(--color-sand-500)] mb-1">
                Total Estadía ({activeBooking.totalNights} noches)
              </span>
              <span className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
                ${(activeBooking.totalAmount ?? 0).toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Guest Details */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex flex-col gap-3 text-sm">
            <span className="text-xs uppercase font-bold text-[var(--color-sand-500)] tracking-wider">
              Datos del Huésped Titular
            </span>
            <div className="flex items-center gap-2.5 text-[var(--color-sand-900)]">
              <User className="w-4 h-4 text-[var(--color-sand-500)]" />
              <span className="font-semibold">{activeBooking.guestName}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[var(--color-sand-700)]">
              <Phone className="w-4 h-4 text-[var(--color-sand-500)]" />
              <span>{activeBooking.guestPhone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[var(--color-sand-700)]">
              <Mail className="w-4 h-4 text-[var(--color-sand-500)]" />
              <span>{activeBooking.guestEmail}</span>
            </div>
            <div className="pt-2 border-t border-[var(--color-sand-200)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-sand-500)]">Acciones rápidas de contacto:</span>
              <GuestContactActions
                booking={activeBooking}
                onOpenVoucher={() => setIsVoucherOpen(true)}
              />
            </div>
          </div>

          {/* Booking dates and stay info */}
          <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex flex-col gap-3 text-sm">
            <span className="text-xs uppercase font-bold text-[var(--color-sand-500)] tracking-wider">
              Detalle de la Estadía
            </span>
            <div className="flex items-center gap-2.5 text-[var(--color-sand-900)]">
              <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)]" />
              <span>
                Ingreso: <strong>{activeBooking.checkIn}</strong> — Salida: <strong>{activeBooking.checkOut}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[var(--color-sand-700)]">
              <MapPin className="w-4 h-4 text-[var(--color-sand-500)]" />
              <span>{activeBooking.accommodation?.locality || 'Capilla del Monte, Córdoba'}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-sand-200)]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVoucherOpen(true)}
              className="text-xs"
            >
              Imprimir Voucher
            </Button>

            <div className="flex items-center gap-2">
              {activeBooking.status === 'PENDING' && (
                <>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setConfirmStatus('CANCELLED')}
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Rechazar Reserva</span>
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => setConfirmStatus('CONFIRMED')}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirmar Reserva</span>
                  </Button>
                </>
              )}
              {activeBooking.status === 'CONFIRMED' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmStatus('COMPLETED')}
                >
                  <span>Marcar Estadía Finalizada</span>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>

        {/* Printable Voucher Modal */}
        <BookingVoucherPrint
          booking={activeBooking}
          isOpen={isVoucherOpen}
          onClose={() => setIsVoucherOpen(false)}
        />
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(confirmStatus)}
        onClose={() => setConfirmStatus(null)}
        onConfirm={handleConfirmAction}
        variant={confirmStatus === 'CANCELLED' ? 'danger' : 'emerald'}
        title={
          confirmStatus === 'CANCELLED'
            ? `¿Rechazar reserva ${activeBooking.bookingCode}?`
            : confirmStatus === 'CONFIRMED'
            ? `¿Confirmar reserva ${activeBooking.bookingCode}?`
            : `¿Marcar reserva ${activeBooking.bookingCode} como finalizada?`
        }
        description={
          confirmStatus === 'CANCELLED'
            ? `Esta acción cancelará la reserva de ${activeBooking.guestName}. Las fechas quedarán disponibles en el calendario para otros turistas.`
            : confirmStatus === 'CONFIRMED'
            ? `Se confirmará la solicitud de ${activeBooking.guestName} (${activeBooking.checkIn} al ${activeBooking.checkOut}). El turista recibirá la confirmación oficial.`
            : `Se registrará que los huéspedes han completado su estadía en el establecimiento.`
        }
        confirmLabel={
          confirmStatus === 'CANCELLED'
            ? 'Rechazar Reserva'
            : confirmStatus === 'CONFIRMED'
            ? 'Confirmar Reserva'
            : 'Marcar Finalizada'
        }
        cancelLabel="Volver"
      />
    </>
  );
};
