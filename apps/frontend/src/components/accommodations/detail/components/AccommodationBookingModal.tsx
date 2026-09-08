import React, { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck } from 'lucide-react';
import type { AccommodationDetailData } from '../types';
import type { UseAccommodationBookingReturn } from '../hooks/useAccommodationBooking';
import { AccommodationBookingFormFields } from './AccommodationBookingForm';
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
    nightsCount,
    totalPrice,
    isSubmitting,
    isSuccess,
    handleSubmitBooking,
    whatsappUrl,
  } = booking;
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, handleClose]);

  if (!isRendered || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Solicitud de Reserva">
      {/* Backdrop con fade animado */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer ${
          isAnimating ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer: Bottom-Sheet en Mobile (< 768px), Slide-Over lateral en Desktop (>= 768px) */}
      <div
        className={`fixed bottom-0 left-0 right-0 md:left-auto md:top-0 md:bottom-0 md:right-0 w-full md:w-[480px] lg:w-[540px] bg-white shadow-2xl rounded-t-3xl md:rounded-t-none md:rounded-l-3xl border-t md:border-t-0 md:border-l border-stone-200 flex flex-col h-[94vh] max-h-[96vh] md:h-full md:max-h-full z-50 transition-all duration-300 ease-out transform ${
          isAnimating
            ? 'translate-y-0 opacity-100 md:translate-x-0 md:translate-y-0'
            : 'translate-y-full opacity-0 md:translate-x-full md:translate-y-0'
        }`}
      >
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
            onClick={handleClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Cerrar panel de reserva"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido interactivo: Éxito o Formulario con footer fijo */}
        {isSuccess ? (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
            <AccommodationBookingSuccess
              hostName={data.host.name}
              checkIn={checkIn}
              checkOut={checkOut}
              nightsCount={nightsCount}
              totalPrice={totalPrice}
              whatsappUrl={whatsappUrl}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmitBooking} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 overflow-y-auto space-y-5 flex-1 overscroll-contain">
              <AccommodationBookingFormFields data={data} booking={booking} />
            </div>

            {/* Footer Fijo Pinned: Botón SIEMPRE visible sin necesidad de scroll */}
            <div className="shrink-0 px-6 py-4 border-t border-stone-200 bg-white/95 backdrop-blur-xs space-y-2 shadow-lg">
              <button
                type="submit"
                disabled={isSubmitting || !checkIn || !checkOut}
                style={{ backgroundColor: '#C95627', color: '#ffffff' }}
                className="w-full py-3.5 px-4 rounded-xl font-display font-bold text-sm shadow-md hover:brightness-95 active:brightness-90 disabled:opacity-50 transition-all cursor-pointer select-none text-center"
              >
                {isSubmitting ? 'Solicitando reserva...' : 'Solicitar reserva'}
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Contacto directo con el prestador • Sin comisiones</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
export const AccommodationBookingModal = AccommodationBookingDrawer;
