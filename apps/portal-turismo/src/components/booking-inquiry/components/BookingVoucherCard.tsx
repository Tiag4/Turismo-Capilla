import React, { useState } from 'react';
import type { BookingVoucherRecord } from '../types';

interface BookingVoucherCardProps {
  voucher: BookingVoucherRecord;
  onPrint: () => void;
}

export const BookingVoucherCard: React.FC<BookingVoucherCardProps> = ({ voucher, onPrint }) => {
  const isConfirmed = voucher.status === 'CONFIRMED';
  const [copied, setCopied] = useState<'cbu' | 'alias' | null>(null);

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

  const whatsappUrl = `https://wa.me/${(voucher.hostPhone || '5493548401122').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    `Hola! Me comunico respecto a mi reserva oficial *${voucher.code}* en *${voucher.accommodationTitle}* a nombre de *${voucher.firstName} ${voucher.lastName}*.`,
  )}`;

  return (
    <div className="bg-white rounded-2xl border-2 border-sand-300 p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
      {/* Cabecera del Voucher con Sello Institucional */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="/cropped-logo-capilla-del-monte-2024.png"
            alt="Capilla del Monte"
            className="h-10 w-auto object-contain"
          />
          <div>
            <span className="font-display font-bold text-lg text-sand-900 block leading-tight">
              Voucher Oficial de Reserva
            </span>
            <span className="text-xs text-sand-500 font-mono">
              Comisión de Turismo de Capilla del Monte
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider uppercase ${
              isConfirmed
                ? 'bg-emerald-portal-500 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isConfirmed ? 'Reserva Confirmada' : 'Pendiente de Confirmación'}
          </span>
        </div>
      </div>

      {/* Código y Ficha del Alojamiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 flex flex-col sm:flex-row items-start gap-4">
          <img
            src={voucher.accommodationImage}
            alt={voucher.accommodationTitle}
            className="w-full sm:w-28 h-28 rounded-xl object-cover border border-sand-200 shrink-0"
          />
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-uritorco-700 uppercase tracking-wider block">
              {voucher.accommodationZone} · Prestador Habilitado
            </span>
            <h3 className="font-display font-black text-xl text-sand-900 leading-tight">
              {voucher.accommodationTitle}
            </h3>
            <p className="text-xs text-sand-600">
              {voucher.accommodationAddress}
            </p>
            <div className="pt-1 text-xs text-sand-700">
              <span className="font-semibold">Contacto anfitrión: </span>
              <span>{voucher.hostPhone || '+54 9 3548 40-1122'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-center space-y-1">
          <span className="text-[10px] font-bold text-sand-500 uppercase tracking-wider block">
            Código Único de Trámite
          </span>
          <span className="font-mono font-black text-xl text-terracotta-600 block tracking-wider">
            {voucher.code}
          </span>
          <span className="text-[11px] text-sand-500 block">
            Emitido el {new Date(voucher.createdAt).toLocaleDateString('es-AR')}
          </span>
        </div>
      </div>

      {/* Cuadrícula de Datos de Estadía y Pasajeros */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-sand-50/70 border border-sand-200/80 text-xs">
        <div>
          <span className="font-semibold text-sand-500 block uppercase text-[10px]">Check-In</span>
          <span className="font-bold text-sand-900 text-sm">{voucher.checkIn || 'A coordinar'}</span>
          <span className="text-sand-500 text-[11px]">Desde las 14:00 hs</span>
        </div>
        <div>
          <span className="font-semibold text-sand-500 block uppercase text-[10px]">Check-Out</span>
          <span className="font-bold text-sand-900 text-sm">{voucher.checkOut || 'A coordinar'}</span>
          <span className="text-sand-500 text-[11px]">Hasta las 10:00 hs</span>
        </div>
        <div>
          <span className="font-semibold text-sand-500 block uppercase text-[10px]">Duración</span>
          <span className="font-bold text-sand-900 text-sm">{voucher.nightsCount} noches</span>
          <span className="text-sand-500 text-[11px]">{voucher.rooms} alojamiento</span>
        </div>
        <div>
          <span className="font-semibold text-sand-500 block uppercase text-[10px]">Titular</span>
          <span className="font-bold text-sand-900 text-sm truncate block">
            {voucher.firstName} {voucher.lastName}
          </span>
          <span className="text-sand-500 text-[11px]">
            {voucher.adults} adultos {voucher.children > 0 ? `· ${voucher.children} niños` : ''}
          </span>
        </div>
      </div>

      {/* Desglose Tarifario y Condiciones de Pago */}
      <div className="pt-2 border-t border-sand-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
          <div>
            <span className="text-[10px] text-amber-900/70 uppercase font-bold block">Total Estadía Pactada</span>
            <span className="font-display font-black text-xl text-sand-900">
              ${(voucher.finalPrice ?? 0).toLocaleString('es-AR')} <span className="text-xs font-sans font-bold text-sand-600">ARS</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-amber-900/70 uppercase font-bold block">Seña Requerida ({downPaymentPercentage}%)</span>
            <span className="font-display font-black text-xl text-amber-900">
              ${downPaymentAmount.toLocaleString('es-AR')} <span className="text-xs font-sans font-bold text-amber-800">ARS</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-amber-900/70 uppercase font-bold block">Saldo al Check-In</span>
            <span className="font-display font-black text-xl text-emerald-800">
              ${remainingBalance.toLocaleString('es-AR')} <span className="text-xs font-sans font-bold text-emerald-700">ARS</span>
            </span>
          </div>
        </div>

        {/* Datos Bancarios para la Seña */}
        <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 space-y-3">
          <div className="border-b border-sand-200 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="font-display font-bold text-sm text-sand-900">
              Datos para el Depósito de la Seña Bancaria
            </h4>
            <span className="text-[11px] text-sand-500 font-medium">
              Transferencia directa al anfitrión prestador
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-sand-500 uppercase font-bold block">Titular de la Cuenta</span>
              <span className="font-semibold text-sand-900 block">{voucher.bankAccountHolder || 'Administración Cabañas Capilla'}</span>
            </div>
            <div>
              <span className="text-[10px] text-sand-500 uppercase font-bold block">Entidad Bancaria</span>
              <span className="font-semibold text-sand-900 block">{voucher.bankName || 'Banco de la Nación Argentina'}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-sand-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-sand-500 uppercase font-bold block">CBU / CVU</span>
                <span className="font-mono text-xs font-bold text-sand-900 select-all truncate block">
                  {voucher.bankCbu || '0110485530048500123456'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(voucher.bankCbu || '0110485530048500123456', 'cbu')}
                className="px-2 py-1 rounded bg-sand-100 hover:bg-sand-200 text-sand-800 text-[11px] font-bold shrink-0 transition-colors cursor-pointer print:hidden"
              >
                {copied === 'cbu' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-sand-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] text-sand-500 uppercase font-bold block">Alias Bancario</span>
                <span className="font-mono text-xs font-bold text-sand-900 select-all truncate block">
                  {voucher.bankAlias || 'CAPILLA.RESERVA.OFICIAL'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(voucher.bankAlias || 'CAPILLA.RESERVA.OFICIAL', 'alias')}
                className="px-2 py-1 rounded bg-sand-100 hover:bg-sand-200 text-sand-800 text-[11px] font-bold shrink-0 transition-colors cursor-pointer print:hidden"
              >
                {copied === 'alias' ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-sand-500 italic pt-1">
            Una vez realizada la transferencia de la seña, enviá el comprobante al anfitrión para validar y garantizar tu lugar.
          </p>
        </div>
      </div>

      {/* Acciones del Voucher (Ocultas al imprimir con @media print) */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-sand-200 print:hidden">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-uritorco-600 hover:bg-uritorco-700 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.297.144.35.491 1.199.534 1.286.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z" />
          </svg>
          <span>Chat con Anfitrión</span>
        </a>

        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sand-900 hover:bg-sand-800 text-white transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Descargar / Imprimir Voucher</span>
        </button>
      </div>
    </div>
  );
};
