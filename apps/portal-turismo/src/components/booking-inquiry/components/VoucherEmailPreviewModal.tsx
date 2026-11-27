import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import type { BookingVoucherRecord } from '../types';
import { generateBookingVoucherEmailHtml } from '../../../services/email/voucherEmailTemplate';
import { AdaptiveModal } from '../../ui/AdaptiveModal';

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

  const handleOpenInNewTab = () => {
    const blob = new Blob([emailHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AdaptiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      heightClassName="h-[94dvh] sm:h-[88vh]"
      maxHeightClassName="max-h-[94dvh] sm:max-h-[88vh]"
      bodyClassName="overflow-hidden flex flex-col p-0 sm:p-4 bg-sand-100"
      title="Previsualización del Correo Institucional"
      subtitle={`Despachado a ${voucher.email}`}
      renderHeaderAction={
        <button
          type="button"
          onClick={handleOpenInNewTab}
          title="Abrir HTML del correo en una pestaña independiente"
          aria-label="Abrir HTML del correo en una pestaña nueva"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sand-700 bg-sand-100 hover:bg-sand-200 rounded-lg transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Abrir en pestaña</span>
        </button>
      }
    >
      <iframe
        srcDoc={emailHtml}
        title="Previsualización de correo institucional"
        className="w-full flex-1 h-full border-0 sm:rounded-xl sm:border sm:border-sand-300 bg-white shadow-xs"
        sandbox="allow-same-origin"
      />
    </AdaptiveModal>
  );
};
