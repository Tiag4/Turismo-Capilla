import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock3, X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface ReviewSuccessModalProps {
  isOpen: boolean;
  bookingCode: string;
  accommodationName: string;
  onClose: () => void;
}

export const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({
  isOpen,
  bookingCode,
  accommodationName,
  onClose,
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  useBodyScrollLock(isRendered);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);

      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setIsVisible(false);

    const timer = setTimeout(() => setIsRendered(false), 220);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => () => {

  }, []);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-success-title"
    >
      <div className="fixed inset-0 bg-sand-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        className={`relative w-full max-w-md rounded-3xl bg-sand-50 border border-sand-300 shadow-2xl p-6 sm:p-8 text-center space-y-5 transition-all duration-200 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-3'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-sand-500 hover:bg-sand-200 hover:text-sand-800 transition-colors cursor-pointer"
          aria-label="Cerrar confirmación de reseña"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mx-auto w-16 h-16 rounded-2xl bg-uritorco-100 flex items-center justify-center">
          <CheckCircle2 className="w-9 h-9 text-uritorco-600" />
        </div>

        <div className="space-y-2">
          <h2 id="review-success-title" className="font-display font-black text-xl text-sand-950">
            ¡Gracias por compartir tu experiencia!
          </h2>
          <p className="text-sm text-sand-600">
            Tu reseña de <strong className="text-sand-900">{accommodationName}</strong> fue registrada
            correctamente para la reserva <span className="font-mono font-bold text-terracotta-600">{bookingCode}</span>.
          </p>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left">
          <Clock3 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 font-medium">
            La Comisión de Turismo revisará tu testimonio. Una vez aprobado, se publicará en la ficha
            del alojamiento y se sumará al promedio de calificaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full px-5 py-3 rounded-xl bg-sand-900 hover:bg-sand-800 text-white font-display font-bold text-sm transition-colors cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
