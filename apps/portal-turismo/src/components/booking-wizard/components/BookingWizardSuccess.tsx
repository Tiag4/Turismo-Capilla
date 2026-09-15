import React from 'react';
import { CheckCircle, MessageSquare, ArrowLeft, Download, ShieldCheck } from 'lucide-react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import type { UseBookingWizardReturn } from '../hooks/useBookingWizard';

interface BookingWizardSuccessProps {
  data: AccommodationDetailData;
  wizard: UseBookingWizardReturn;
}

export const BookingWizardSuccess: React.FC<BookingWizardSuccessProps> = ({ data, wizard }) => {
  const { bookingCode, form, finalPrice, nightsCount, whatsappUrl } = wizard;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-lg text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Solicitud Registrada con Éxito
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stone-900">
          ¡Gracias, {form.firstName}!
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Hemos enviado los datos de tu reserva a <strong className="text-stone-900">{data.title}</strong>. El anfitrión se comunicará con vos para coordinar los detalles.
        </p>
      </div>

      {/* Voucher Code Box */}
      <div className="bg-[#FAF8F5] border border-stone-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
        <div className="flex justify-between items-baseline border-b border-stone-200 pb-2">
          <span className="text-xs text-stone-500 font-semibold">Código de Reserva:</span>
          <span className="font-mono font-bold text-base text-stone-900 tracking-wider">{bookingCode}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Estadía</span>
            <span className="font-semibold text-stone-800">{nightsCount} {nightsCount === 1 ? 'noche' : 'noches'}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Importe Total</span>
            <span className="font-extrabold text-terracotta-700">${finalPrice.toLocaleString('es-AR')} ARS</span>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 pt-1">
          Titular: <strong>{form.firstName} {form.lastName}</strong> • Tel: {form.phone}
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="space-y-3 max-w-md mx-auto pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#25D366' }}
          className="w-full py-3.5 px-4 rounded-xl text-white font-display font-bold text-sm shadow-md hover:brightness-95 active:brightness-90 transition-all flex items-center justify-center gap-2 select-none"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Avisar al anfitrión por WhatsApp</span>
        </a>

        <a
          href={`/reservas/consulta?code=${bookingCode}&email=${encodeURIComponent(form.email)}`}
          className="w-full py-3 px-4 rounded-xl bg-sand-900 hover:bg-sand-800 text-white font-display font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 select-none shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Ver o descargar voucher oficial</span>
        </a>

        <a
          href="/alojamientos"
          className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al catálogo de alojamientos</span>
        </a>
      </div>

      <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Turismo Capilla del Monte • Portal Oficial</span>
      </div>
    </div>
  );
};
