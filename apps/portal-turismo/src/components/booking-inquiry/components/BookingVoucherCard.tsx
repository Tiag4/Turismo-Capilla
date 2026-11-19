import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Eye, Loader2, Mail, Star, Copy, Check, MessageSquare, Printer } from 'lucide-react';
import { api } from '../../../services/api';
import type { BookingVoucherRecord } from '../types';
import { VoucherEmailPreviewModal } from './VoucherEmailPreviewModal';

interface BookingVoucherCardProps {
  voucher: BookingVoucherRecord;
  onPrint: () => void;
}

export const BookingVoucherCard: React.FC<BookingVoucherCardProps> = ({ voucher, onPrint }) => {
  const isConfirmed = voucher.status === 'CONFIRMED';
  const isCompleted = voucher.status === 'COMPLETED';
  const isCancelled = voucher.status === 'CANCELLED';
  const [copied, setCopied] = useState<'cbu' | 'alias' | null>(null);
  const [resendState, setResendState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  const checkoutTimestamp = voucher.checkOut
    ? new Date(`${voucher.checkOut}T23:59:59`).getTime()
    : NaN;
  const stayFinished =
    isCompleted || (!Number.isNaN(checkoutTimestamp) && checkoutTimestamp < Date.now());
  const canReview = stayFinished && !isCancelled;

  const statusLabel = isCompleted
    ? 'Estadía Completada'
    : isCancelled
      ? 'Reserva Cancelada'
      : isConfirmed
        ? 'Reserva Confirmada'
        : 'Pendiente de Confirmación';

  const statusClassName = isCompleted
    ? 'bg-sand-900 text-white'
    : isCancelled
      ? 'bg-rose-700 text-white'
      : isConfirmed
        ? 'bg-emerald-portal-500 text-white'
        : 'bg-amber-600 text-white';

  const downPaymentPercentage = voucher.downPaymentPercentage ?? 50;
  const downPaymentAmount =
    voucher.downPaymentAmount ??
    Math.round((voucher.finalPrice ?? 0) * (downPaymentPercentage / 100));
  const remainingBalance =
    voucher.remainingBalance ??
    Math.max(0, (voucher.finalPrice ?? 0) - downPaymentAmount);

  const handleCopy = (text: string, field: 'cbu' | 'alias') => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const cleanPhone = (voucher.hostPhone || '5493548401122').replace(/[^0-9]/g, '');
  const formattedWhatsappNumber = cleanPhone.startsWith('549')
    ? cleanPhone
    : cleanPhone.startsWith('54')
      ? `549${cleanPhone.slice(2)}`
      : cleanPhone.startsWith('0')
        ? `549${cleanPhone.slice(1)}`
        : `549${cleanPhone}`;

  const whatsappUrl = `https://wa.me/${formattedWhatsappNumber}?text=${encodeURIComponent(
    `Hola! Me comunico respecto a mi reserva oficial *${voucher.code}* en *${voucher.accommodationTitle}* a nombre de *${voucher.firstName} ${voucher.lastName}*.`,
  )}`;

  const handleResendVoucher = async () => {
    if (!voucher.email) {
      setResendState('error');
      setResendMessage('La reserva no tiene un correo asociado para el reenvío.');
      return;
    }

    setResendState('sending');
    setResendMessage('');

    try {
      const response = await api.resendVoucher(voucher.code, voucher.email);
      setResendState('success');
      setResendMessage(response.message || 'Voucher reenviado por email correctamente.');
    } catch (error) {
      setResendState('error');
      setResendMessage(
        error instanceof Error ? error.message : 'No pudimos reenviar el voucher. Intentá nuevamente.',
      );
    }
  };

  return (
    <article className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none print:p-0">
      {/* Cabecera del Voucher con Sello Institucional */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-6">
        <div className="flex items-center gap-3.5">
          <img
            src="/cropped-logo-capilla-del-monte-2024.png"
            alt="Logotipo de Capilla del Monte"
            className="h-11 w-auto object-contain"
          />
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-sand-900 leading-tight">
              Voucher Oficial de Reserva
            </h2>
            <p className="text-xs text-sand-500 font-mono">
              Cámara de Turismo de Capilla del Monte
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {voucher.isDemo && (
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-amber-600 text-white shadow-xs">
              Modo Demostración
            </span>
          )}
          <span
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black tracking-wider uppercase ${statusClassName}`}
          >
            {statusLabel}
          </span>
        </div>
      </header>

      {/* Ficha del Alojamiento & Localizador (Lienzo Único sin cajas anidadas) */}
      <section aria-label="Ficha del establecimiento y localizador" className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
          <img
            src={voucher.accommodationImage}
            alt={voucher.accommodationTitle}
            className="w-full sm:w-32 h-32 rounded-2xl object-cover border border-sand-200 shrink-0"
          />
          <div className="space-y-1.5 min-w-0">
            <span className="text-xs font-bold text-uritorco-700 uppercase tracking-wider block">
              {voucher.accommodationZone} · Prestador Habilitado
            </span>
            <h3 className="font-display font-extrabold text-2xl text-sand-900 leading-tight">
              {voucher.accommodationTitle}
            </h3>
            <p className="text-sm text-sand-600 leading-relaxed">
              📍 {voucher.accommodationAddress}
            </p>
            <p className="text-xs text-sand-700 pt-0.5">
              <span className="font-semibold text-sand-900">Contacto anfitrión:</span> {voucher.hostPhone || '+54 9 3548 40-1122'}
            </p>
          </div>
        </div>

        {/* Localizador Oficial - Diseño Tipográfico sin caja flotante */}
        <div className="lg:text-right lg:border-l lg:border-sand-200 lg:pl-6 space-y-1">
          <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
            Localizador Oficial
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-terracotta-600 block tracking-wider leading-none">
            {voucher.code}
          </span>
          <span className="text-xs text-sand-500 block pt-1">
            Emitido el {new Date(voucher.createdAt).toLocaleDateString('es-AR')}
          </span>
        </div>
      </section>

      {/* Tira Horizontal de Estadía y Pasajeros (Sin tarjetitas internas) */}
      <section aria-label="Datos de estadía y pasajeros" className="py-6 border-y border-sand-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
              Ingreso
            </span>
            <span className="font-display font-bold text-sand-900 text-base sm:text-lg block">
              {voucher.checkIn || 'A coordinar'}
            </span>
            <span className="text-xs text-sand-600 block">
              Desde las 14:00 hs
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
              Egreso
            </span>
            <span className="font-display font-bold text-sand-900 text-base sm:text-lg block">
              {voucher.checkOut || 'A coordinar'}
            </span>
            <span className="text-xs text-sand-600 block">
              Hasta las 10:00 hs
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
              Duración
            </span>
            <span className="font-display font-bold text-sand-900 text-base sm:text-lg block">
              {voucher.nightsCount} {voucher.nightsCount === 1 ? 'noche' : 'noches'}
            </span>
            <span className="text-xs text-sand-600 block">
              {voucher.rooms || 1} {voucher.rooms === 1 ? 'unidad' : 'unidades'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
              Titular
            </span>
            <span className="font-display font-bold text-sand-900 text-base sm:text-lg block truncate">
              {voucher.firstName} {voucher.lastName}
            </span>
            <span className="text-xs text-sand-600 block">
              {voucher.adults} adultos{voucher.children > 0 ? ` · ${voucher.children} niños` : ''}
            </span>
          </div>
        </div>
      </section>

      {/* Liquidación Financiera de la Estadía (Sin fondo amarillo lavado ni tarjetas sueltas) */}
      <section aria-label="Liquidación de la estadía" className="space-y-4">
        <h4 className="font-display font-bold text-base text-sand-900">
          Liquidación de la Estadía
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-4 border-b border-sand-200">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-sand-500 uppercase tracking-wider block">
              Total Estadía Pactada
            </span>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-sand-900">
              ${(voucher.finalPrice ?? 0).toLocaleString('es-AR')}{' '}
              <span className="text-xs font-sans font-bold text-sand-500">ARS</span>
            </div>
            <span className="text-xs text-sand-500 block">
              Tarifa final pactada con el establecimiento
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-terracotta-700 uppercase tracking-wider block">
              Seña Requerida ({downPaymentPercentage}%)
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-terracotta-600">
              ${downPaymentAmount.toLocaleString('es-AR')}{' '}
              <span className="text-xs font-sans font-bold text-terracotta-700">ARS</span>
            </div>
            <span className="text-xs text-terracotta-800 font-medium block">
              Monto para confirmar la reserva
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Saldo al Ingreso
            </span>
            <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-800">
              ${remainingBalance.toLocaleString('es-AR')}{' '}
              <span className="text-xs font-sans font-bold text-emerald-700">ARS</span>
            </div>
            <span className="text-xs text-sand-500 block">
              Se abona al anfitrión en el check-in
            </span>
          </div>
        </div>

        {/* Datos Bancarios para la Transferencia (Sin anidación de cajas) */}
        <div className="pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h4 className="font-display font-bold text-sm text-sand-900">
              Datos para el Depósito de la Seña Bancaria
            </h4>
            <span className="text-xs text-sand-500">
              Transferencia directa a la cuenta del anfitrión
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[11px] text-sand-500 uppercase font-semibold block">Titular de la cuenta</span>
              <span className="font-semibold text-sand-900 text-sm block">
                {voucher.bankAccountHolder || 'Administración Cabañas Capilla'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-sand-500 uppercase font-semibold block">Entidad Bancaria</span>
              <span className="font-semibold text-sand-900 text-sm block">
                {voucher.bankName || 'Banco de la Nación Argentina'}
              </span>
            </div>

            {/* CBU con botón copiar plano */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-sand-500 uppercase font-semibold block">CBU / CVU</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs font-bold text-sand-900 bg-sand-100 px-2 py-1 rounded-md select-all truncate">
                  {voucher.bankCbu || '0110485530048500123456'}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(voucher.bankCbu || '0110485530048500123456', 'cbu')}
                  className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-xs font-bold shrink-0 transition-colors cursor-pointer print:hidden flex items-center gap-1"
                  title="Copiar CBU"
                >
                  {copied === 'cbu' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sand-600" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Alias con botón copiar plano */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-sand-500 uppercase font-semibold block">Alias Bancario</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs font-bold text-terracotta-600 bg-sand-100 px-2 py-1 rounded-md select-all truncate">
                  {voucher.bankAlias || 'CAPILLA.RESERVA.OFICIAL'}
                </code>
                <button
                  type="button"
                  onClick={() => handleCopy(voucher.bankAlias || 'CAPILLA.RESERVA.OFICIAL', 'alias')}
                  className="px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-sand-800 text-xs font-bold shrink-0 transition-colors cursor-pointer print:hidden flex items-center gap-1"
                  title="Copiar Alias"
                >
                  {copied === 'alias' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sand-600" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <p className="text-xs text-sand-500 italic pt-1">
            Una vez realizada la transferencia de la seña, enviá el comprobante al anfitrión por WhatsApp para validar y garantizar tu lugar.
          </p>
        </div>
      </section>

      {/* Estado del Reenvío de Correo */}
      {resendMessage && (
        <div
          role="status"
          className={`flex items-start gap-2.5 p-3.5 rounded-xl border text-xs font-semibold print:hidden ${
            resendState === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {resendState === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          )}
          <span>{resendMessage}</span>
        </div>
      )}

      {/* Barra de Acciones del Voucher (Ocultas al imprimir con @media print) */}
      <footer className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-sand-200 print:hidden">
        {canReview && (
          <Link
            to={`/resenas/nueva?code=${encodeURIComponent(voucher.code)}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-terracotta-500 hover:bg-terracotta-600 text-white transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Calificar Estadía</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setShowEmailPreview(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-sand-300 bg-white text-sand-800 hover:bg-sand-100 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-emerald-portal-600" />
          <span>Ver Correo Oficial</span>
        </button>

        <button
          type="button"
          onClick={handleResendVoucher}
          disabled={resendState === 'sending'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-sand-300 bg-white text-sand-800 hover:bg-sand-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {resendState === 'sending' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 text-terracotta-500" />
          )}
          <span>{resendState === 'sending' ? 'Reenviando...' : 'Reenviar voucher por email'}</span>
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-uritorco-600 hover:bg-uritorco-700 text-white transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat con Anfitrión</span>
        </a>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sand-900 hover:bg-sand-800 text-white transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Descargar / Imprimir Voucher</span>
        </button>
      </footer>

      {/* Modal de Previsualización del Correo Institucional (Bottomsheet en móvil) */}
      <VoucherEmailPreviewModal
        isOpen={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        voucher={voucher}
      />
    </article>
  );
};
