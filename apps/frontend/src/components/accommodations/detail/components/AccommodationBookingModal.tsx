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

export const AccommodationBookingDrawer: React.FC<AccommodationBookingModalProps> = ({
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
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Solicitud de Reserva Directa"
    >
      {/* Backdrop con cierre al hacer click */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer: Bottom-Sheet en Mobile (< 768px), Slide-Over lateral en Desktop (>= 768px) */}
      <div className="fixed inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto w-full md:max-w-md lg:max-w-lg bg-white shadow-2xl rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-stone-200 flex flex-col max-h-[92vh] md:max-h-full h-auto md:h-full z-10 transition-all duration-300">
        {/* Indicador táctil para Mobile (Drag handle) */}
        <div className="md:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1 bg-stone-300 rounded-full" />
        </div>

        {/* Header Drawer */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-[#FAF8F5] shrink-0">
          <div>
            <h3 className="font-display font-black text-lg text-stone-900">Solicitud de Reserva Directa</h3>
            <p className="text-xs text-stone-500 font-medium">{data.title} — {data.zone}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar panel de reserva"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Scrolleable del Formulario */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
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
              onCheckInChange={booking.setCheckIn}
              checkOut={checkOut}
              onCheckOutChange={booking.setCheckOut}
              guests={guests}
              onGuestsChange={booking.setGuests}
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

export const AccommodationBookingModal = AccommodationBookingDrawer;
