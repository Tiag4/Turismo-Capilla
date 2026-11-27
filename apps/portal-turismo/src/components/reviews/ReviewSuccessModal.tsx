import React from 'react';
import { CheckCircle2, Clock3 } from 'lucide-react';
import { AdaptiveModal } from '../ui/AdaptiveModal';

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
  return (
    <AdaptiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      hideHeader
      bodyClassName="p-6 sm:p-8 text-center space-y-5"
    >
      <div className="mx-auto w-16 h-16 rounded-2xl bg-uritorco-100 flex items-center justify-center">
        <CheckCircle2 className="w-9 h-9 text-uritorco-600" />
      </div>

      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-uritorco-100 text-uritorco-800">
          <Clock3 className="w-3.5 h-3.5" />
          En proceso de moderación oficial
        </span>
        <h3 id="review-success-title" className="text-xl sm:text-2xl font-black font-display text-sand-900">
          ¡Reseña Recibida!
        </h3>
        <p className="text-sm text-sand-600 leading-relaxed">
          Gracias por calificar tu estadía en <strong className="text-sand-900">{accommodationName}</strong>.
          {bookingCode && (
            <span className="block mt-1 font-mono text-xs text-sand-500">
              Código de trámite: {bookingCode}
            </span>
          )}
        </p>
      </div>

      <p className="text-xs text-sand-500 leading-relaxed bg-sand-100/60 p-3.5 rounded-xl border border-sand-200">
        Para garantizar la veracidad del portal, el equipo de la Secretaría de Turismo
        revisará el comentario antes de su publicación definitiva.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="w-full py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-sm transition-colors cursor-pointer"
      >
        Entendido
      </button>
    </AdaptiveModal>
  );
};
