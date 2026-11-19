import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import type { BookingVoucherRecord } from '../types';
import { generateBookingVoucherEmailHtml } from '../../../services/email/voucherEmailTemplate';

interface VoucherEmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: BookingVoucherRecord;
}

export const VoucherEmailPreviewModal: React.FC<VoucherEmailPreviewModalProps> = ({
  isOpen,
  onClose,
  voucher,
}) => {
  // Body scroll lock & ESC listener
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const emailHtml = useMemo(() => {
    return generateBookingVoucherEmailHtml({
      code: voucher.code,
      accommodationTitle: voucher.accommodationTitle,
      accommodationZone: voucher.accommodationZone,
      accommodationAddress: voucher.accommodationAddress,
      firstName: voucher.firstName,
      lastName: voucher.lastName,
      email: voucher.email,
      phone: voucher.phone,
      checkIn: voucher.checkIn,
      checkOut: voucher.checkOut,
      nightsCount: voucher.nightsCount,
      adults: voucher.adults,
      children: voucher.children,
      rooms: voucher.rooms,
      finalPrice: voucher.finalPrice,
      downPaymentPercentage: voucher.downPaymentPercentage,
      downPaymentAmount: voucher.downPaymentAmount,
      remainingBalance: voucher.remainingBalance,
      bankAccountHolder: voucher.bankAccountHolder,
      bankCbu: voucher.bankCbu,
      bankAlias: voucher.bankAlias,
      bankName: voucher.bankName,
      status: voucher.status,
      hostPhone: voucher.hostPhone,
      portalBaseUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
      forHost: false,
    });
  }, [voucher]);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleOpenInNewTab = () => {
    const blob = new Blob([emailHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-preview-modal-title"
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop oscuro con blur funcional */}
      <div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottomsheet en mobile / Modal centrado en desktop */}
      <div
        className="relative z-10 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border-t sm:border border-sand-300 w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tirador táctil visual para Mobile (Drag handle pill) */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0 bg-sand-50/80">
          <div className="w-12 h-1.5 bg-sand-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sand-200 bg-sand-50/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-portal-500/15 text-emerald-portal-700 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="email-preview-modal-title" className="font-display font-bold text-base text-sand-900 truncate">
                  Previsualización del Correo Institucional
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  HTML Oficial
                </span>
              </div>
              <p className="text-xs text-sand-500 truncate">
                Despachado a <strong className="text-sand-700">{voucher.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sand-700 hover:text-sand-950 bg-white hover:bg-sand-100 rounded-lg border border-sand-300 transition-colors cursor-pointer"
              title="Abrir correo en pestaña completa"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir completo</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-sand-500 hover:text-sand-900 hover:bg-sand-200/60 transition-colors cursor-pointer"
              aria-label="Cerrar vista previa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lienzo del Correo (Iframe adaptable) */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-sand-100/60 flex justify-center">
          <div className="w-full max-w-[600px] bg-white rounded-xl sm:rounded-2xl shadow-xs border border-sand-200 overflow-hidden">
            <iframe
              title="Renderizado del correo de confirmación de reserva"
              srcDoc={emailHtml}
              className="w-full h-[520px] sm:h-[620px] border-none block"
              sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
