import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, Mail, MessageCircle, Printer } from 'lucide-react';
import type { Booking } from '../../types/booking.types.ts';
import { bookingsService } from '../../services/bookings.service.ts';
import { Button } from '../ui/Button.tsx';

export interface GuestContactActionsProps {
  booking: Booking;
  onOpenVoucher: () => void;
}

function cleanPhoneForWhatsApp(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('549')) {
    return cleaned;
  }
  if (cleaned.startsWith('54')) {
    // Inserta 9 después del 54 para celular argentino
    return `549${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith('0')) {
    // Si empieza con 03548..., saca el 0
    cleaned = cleaned.slice(1);
  }
  // Asume celular argentino
  return `549${cleaned}`;
}

export const GuestContactActions: React.FC<GuestContactActionsProps> = ({
  booking,
  onOpenVoucher,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  const handleResendVoucher = async () => {
    setIsResending(true);
    setResendMessage('');
    setResendError('');

    try {
      const response = await bookingsService.resendVoucher(booking.id);
      setResendMessage(response.message || 'Voucher reenviado por email correctamente.');
    } catch (error) {
      setResendError(
        error instanceof Error ? error.message : 'No se pudo reenviar el voucher por email.',
      );
    } finally {
      setIsResending(false);
    }
  };

  const whatsappUrl = useMemo(() => {
    const phone = cleanPhoneForWhatsApp(booking.guestPhone);
    const accName = booking.accommodation?.name || 'nuestro alojamiento';
    const message = `¡Hola ${booking.guestName}! Te contacto desde ${accName} por tu reserva oficial ${booking.bookingCode} en Capilla del Monte (Ingreso: ${booking.checkIn} | Egreso: ${booking.checkOut}). ¿Cómo estás? Te escribo para coordinar los detalles de tu llegada.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [
    booking.guestPhone,
    booking.guestName,
    booking.accommodation?.name,
    booking.bookingCode,
    booking.checkIn,
    booking.checkOut,
  ]);

  return (
    <div className="p-4 bg-[var(--color-sand-50)] rounded-2xl border border-[var(--color-sand-200)] space-y-2.5">
      <span className="block text-[10px] uppercase font-bold text-[var(--color-sand-400)] tracking-wider">
        Atención Rápida y Recepción
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] active:scale-98 transition-all shadow-xs cursor-pointer"
          title="Abrir chat de WhatsApp con mensaje pre-armado"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Contactar por WhatsApp</span>
        </a>

        {/* Print Voucher Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenVoucher}
          className="flex items-center gap-2 text-xs font-bold text-[var(--color-sand-800)] bg-white hover:bg-[var(--color-sand-100)]"
          title="Ver o imprimir voucher de recepción oficial"
        >
          <Printer className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
          <span>Voucher de Recepción</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResendVoucher}
          disabled={isResending}
          className="flex items-center gap-2 text-xs font-bold text-[var(--color-sand-800)] bg-white hover:bg-[var(--color-sand-100)]"
          title="Reenviar el voucher oficial al email del huésped"
        >
          {isResending ? (
            <Loader2 className="w-4 h-4 animate-spin text-[var(--color-terracotta-500)] shrink-0" />
          ) : (
            <Mail className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
          )}
          <span>{isResending ? 'Reenviando...' : 'Reenviar Voucher'}</span>
        </Button>
      </div>

      {resendMessage && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-900">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{resendMessage}</span>
        </div>
      )}

      {resendError && (
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-900">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{resendError}</span>
        </div>
      )}
    </div>
  );
};
