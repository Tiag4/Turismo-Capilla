import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import type { AccommodationDetailData } from '../types';
import type { UseAccommodationBookingReturn } from '../hooks/useAccommodationBooking';
import { AccommodationBookingForm } from './AccommodationBookingForm';
import { AccommodationBookingSuccess } from './AccommodationBookingSuccess';

interface AccommodationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AccommodationDetailData;
  booking: UseAccommodationBookingReturn;
}

export const AccommodationBookingModal: React.FC<AccommodationBookingModalProps> = ({
  isOpen,
  onClose,
  data,
  booking,
}) => {
  const {
    checkIn,
    checkOut,
    guests,
    nightsCount,
    totalPrice,
    depositRequired,
    guestName,
    setGuestName,
    guestEmail,
    setGuestEmail,
    guestPhone,
    setGuestPhone,
    isSubmitting,
    isSuccess,
    handleSubmitBooking,
    whatsappUrl,
  } = booking;
  // Scroll Lock obligatorio (AGENTS.md 8.2)
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in-0 duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Formulario de Solicitud de Reserva"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h3 className="font-display font-black text-lg text-stone-900">Solicitud de Reserva Directa</h3>
            <p className="text-xs text-stone-500 font-medium">{data.title} — {data.zone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Formulario */}
        <div className="p-6 overflow-y-auto space-y-5">
          {isSuccess ? (
            <AccommodationBookingSuccess
              hostName={data.host.name}
              checkIn={checkIn}
              checkOut={checkOut}
              nightsCount={nightsCount}
              totalPrice={totalPrice}
              whatsappUrl={whatsappUrl}
            />
          ) : (
            <AccommodationBookingForm
              data={data}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              nightsCount={nightsCount}
              totalPrice={totalPrice}
              depositRequired={depositRequired}
              guestName={guestName}
              onGuestNameChange={setGuestName}
              guestEmail={guestEmail}
              onGuestEmailChange={setGuestEmail}
              guestPhone={guestPhone}
              onGuestPhoneChange={setGuestPhone}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmitBooking}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
