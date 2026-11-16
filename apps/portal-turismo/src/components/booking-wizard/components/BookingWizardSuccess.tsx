import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, ArrowLeft, Download, ShieldCheck, Copy, Check } from 'lucide-react';
import type { AccommodationDetailData } from '../../accommodations/detail/types';
import type { UseBookingWizardReturn } from '../hooks/useBookingWizard';

interface BookingWizardSuccessProps {
  data: AccommodationDetailData;
  wizard: UseBookingWizardReturn;
}

export const BookingWizardSuccess: React.FC<BookingWizardSuccessProps> = ({ data, wizard }) => {
  const { bookingCode, form, finalPrice, nightsCount, whatsappUrl } = wizard;
  const [copied, setCopied] = useState<'cbu' | 'alias' | null>(null);

  const handleCopy = (text: string, field: 'cbu' | 'alias') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

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
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Estadía</span>
            <span className="font-extrabold text-stone-900">${finalPrice.toLocaleString('es-AR')} ARS</span>
          </div>
        </div>
        <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="text-amber-800 block text-[10px] uppercase font-bold">Seña Requerida ({wizard.downPaymentPercentage}%)</span>
            <span className="font-black text-amber-900 text-sm">${wizard.downPaymentAmount.toLocaleString('es-AR')} ARS</span>
          </div>
          <div className="text-right">
            <span className="text-stone-400 block text-[10px] uppercase font-bold">Saldo al ingresar</span>
            <span className="font-semibold text-stone-700 text-xs">${wizard.remainingBalance.toLocaleString('es-AR')} ARS</span>
          </div>
        </div>
        <div className="text-[11px] text-stone-500 pt-1">
          Titular: <strong>{form.firstName} {form.lastName}</strong> • Tel: {form.phone}
        </div>
      </div>

      {/* Datos Bancarios para la Seña */}
      <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3.5">
        <div className="border-b border-amber-200/60 pb-2">
          <h4 className="font-display font-bold text-sm text-amber-950 flex items-center justify-between">
            <span>Datos para la Transferencia Bancaria</span>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
              Seña: ${wizard.downPaymentAmount.toLocaleString('es-AR')}
            </span>
          </h4>
          <p className="text-[11px] text-amber-800/90 mt-0.5">
            Transferí el importe de la seña ({wizard.downPaymentPercentage}%) para confirmar tu reserva.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Titular de la cuenta</span>
            <span className="font-semibold text-stone-900">{data.bankAccountHolder || 'Administración Cabañas Capilla'}</span>
          </div>
          <div>
            <span className="text-stone-500 text-[10px] uppercase font-bold block">Entidad Bancaria</span>
            <span className="font-semibold text-stone-900">{data.bankName || 'Banco de la Nación Argentina'}</span>
          </div>

          {/* CBU con botón copiar */}
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">CBU / CVU</span>
              <span className="font-mono text-xs font-bold text-stone-800 truncate block select-all">
                {data.bankCbu || '0110485530048500123456'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(data.bankCbu || '0110485530048500123456', 'cbu')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              {copied === 'cbu' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {/* Alias con botón copiar */}
          <div className="bg-white p-2.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">Alias Bancario</span>
              <span className="font-mono text-xs font-bold text-stone-800 truncate block select-all">
                {data.bankAlias || 'CAPILLA.RESERVA.OFICIAL'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(data.bankAlias || 'CAPILLA.RESERVA.OFICIAL', 'alias')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
            >
              {copied === 'alias' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
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

        <Link
          to={`/reservas/consulta?code=${bookingCode}&email=${encodeURIComponent(form.email)}`}
          className="w-full py-3 px-4 rounded-xl bg-sand-900 hover:bg-sand-800 text-white font-display font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 select-none shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Ver o descargar voucher oficial</span>
        </Link>

        <Link
          to="/alojamientos"
          className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 select-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al catálogo de alojamientos</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-1 text-[11px] text-stone-400 pt-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Turismo Capilla del Monte • Portal Oficial</span>
      </div>
    </div>
  );
};
