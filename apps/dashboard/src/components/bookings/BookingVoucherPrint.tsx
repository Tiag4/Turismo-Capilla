import React, { useRef } from 'react';
import { Printer, ShieldCheck } from 'lucide-react';
import type { Booking } from '../../types/booking.types.ts';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';

export interface BookingVoucherPrintProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingVoucherPrint: React.FC<BookingVoucherPrintProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const statusLabel =
    booking.status === 'CONFIRMED'
      ? 'CONFIRMADA'
      : booking.status === 'PENDING'
      ? 'PENDIENTE DE CONFIRMACIÓN'
      : booking.status === 'COMPLETED'
      ? 'ESTADÍA COMPLETADA'
      : 'CANCELADA';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voucher Oficial de Recepción"
      subtitle="Comprobante de ingreso para recepción de llaves y registro del huésped"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Printable Paper Card */}
        <div
          ref={printRef}
          id="voucher-printable-area"
          className="bg-white p-6 sm:p-8 rounded-2xl border border-[var(--color-sand-200)] shadow-xs text-[var(--color-sand-900)] space-y-6 print:m-0 print:p-6 print:border-none print:shadow-none"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-5 border-b-2 border-[var(--color-sand-800)]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-terracotta-500)] text-white font-extrabold flex items-center justify-center text-sm font-['Outfit']">
                  CM
                </div>
                <h3 className="font-extrabold text-base tracking-tight font-['Outfit'] uppercase text-[var(--color-sand-900)]">
                  Turismo Capilla del Monte
                </h3>
              </div>
              <p className="text-xs text-[var(--color-sand-800)] font-medium">
                Secretaría y Comisión de Turismo — OTA Oficial Municipal
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-emerald-portal-600)] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Alojamiento Registrado y Habilitado</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">
                Código de Reserva
              </span>
              <span className="text-xl font-black font-['Outfit'] text-[var(--color-terracotta-600)] tracking-tight block">
                {booking.bookingCode}
              </span>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-[var(--color-sand-100)] text-[var(--color-sand-800)] border border-[var(--color-sand-200)]">
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Grid Information: Accommodation & Guest */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Accommodation Details */}
            <div className="p-3.5 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] space-y-1.5">
              <span className="font-bold text-[10px] uppercase text-[var(--color-sand-400)] tracking-wider block">
                Establecimiento
              </span>
              <p className="font-extrabold text-sm text-[var(--color-sand-900)]">
                {booking.accommodation?.name || 'Cabaña de Montaña'}
              </p>
              <p className="text-[var(--color-sand-800)]">
                {booking.accommodation?.locality || 'Capilla del Monte, Córdoba'}
              </p>
            </div>

            {/* Guest Details */}
            <div className="p-3.5 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] space-y-1.5">
              <span className="font-bold text-[10px] uppercase text-[var(--color-sand-400)] tracking-wider block">
                Huésped Titular
              </span>
              <p className="font-extrabold text-sm text-[var(--color-sand-900)]">
                {booking.guestName}
              </p>
              <p className="text-[var(--color-sand-800)]">
                {booking.guestEmail} · {booking.guestPhone}
              </p>
              <p className="text-[11px] text-[var(--color-sand-400)]">
                Cantidad de Huéspedes: <strong className="text-[var(--color-sand-900)]">{booking.guestCount}</strong>
              </p>
            </div>
          </div>

          {/* Stay Dates and Financial Breakdown */}
          <div className="rounded-xl border border-[var(--color-sand-200)] overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[var(--color-sand-100)] text-[var(--color-sand-800)] font-bold">
                <tr>
                  <th className="py-2.5 px-4">Concepto</th>
                  <th className="py-2.5 px-4 text-center">Fechas / Cantidad</th>
                  <th className="py-2.5 px-4 text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-sand-200)]">
                <tr>
                  <td className="py-2.5 px-4 font-semibold">
                    Estadía ({booking.totalNights} noches)
                    <span className="block text-[11px] font-normal text-[var(--color-sand-400)]">
                      Tarifa base pactada por noche: ${(Number(booking.pricePerNight) || 0).toLocaleString('es-AR')}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-center text-[var(--color-sand-800)]">
                    {booking.checkIn} al {booking.checkOut}
                  </td>
                  <td className="py-2.5 px-4 text-right font-extrabold text-sm text-[var(--color-sand-900)]">
                    ${(Number(booking.totalAmount) || 0).toLocaleString('es-AR')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)]">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right font-black uppercase text-xs text-[var(--color-sand-800)]">
                    Total de la Estadía:
                  </td>
                  <td className="py-3 px-4 text-right font-black text-base text-[var(--color-terracotta-600)] font-['Outfit']">
                    ${(Number(booking.totalAmount) || 0).toLocaleString('es-AR')} ARS
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Observations */}
          {booking.notes && (
            <div className="p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] text-xs">
              <span className="font-bold text-[10px] uppercase text-[var(--color-sand-400)] block mb-1">
                Observaciones del Huésped:
              </span>
              <p className="italic text-[var(--color-sand-800)]">"{booking.notes}"</p>
            </div>
          )}

          {/* Check-in rules and sign areas */}
          <div className="pt-4 border-t border-[var(--color-sand-200)] space-y-6">
            <p className="text-[10px] text-[var(--color-sand-400)] leading-relaxed text-center">
              Horario habitual: Check-In 14:00 hs — Check-Out 10:00 hs. Capilla del Monte promueve el cuidado del agua serrana y la separación de residuos en origen. Queda prohibido hacer fuego en áreas no habilitadas.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="border-t border-dashed border-[var(--color-sand-400)] pt-2 text-center text-[11px] text-[var(--color-sand-800)]">
                <span className="font-bold block">Firma de Recepción (Prestador)</span>
                <span className="text-[10px] text-[var(--color-sand-400)]">Entrega de llaves y reglamento</span>
              </div>
              <div className="border-t border-dashed border-[var(--color-sand-400)] pt-2 text-center text-[11px] text-[var(--color-sand-800)]">
                <span className="font-bold block">Firma Huésped Titular</span>
                <span className="text-[10px] text-[var(--color-sand-400)]">Conformidad de ingreso</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-sand-200)]">
          <Button
            type="button"
            variant="terracotta"
            size="sm"
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Voucher / Guardar PDF</span>
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
