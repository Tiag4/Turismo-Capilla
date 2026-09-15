import React from 'react';
import { CheckCircle2, MessageSquare } from 'lucide-react';

interface AccommodationBookingSuccessProps {
  hostName: string;
  checkIn: string;
  checkOut: string;
  nightsCount: number | null;
  totalPrice: number | null;
  whatsappUrl: string;
}

export const AccommodationBookingSuccess: React.FC<AccommodationBookingSuccessProps> = ({
  hostName,
  checkIn,
  checkOut,
  nightsCount,
  totalPrice,
  whatsappUrl,
}) => {
  return (
    <div className="text-center py-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h4 className="font-display font-black text-xl text-stone-900">
          ¡Solicitud Enviada con Éxito!
        </h4>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          El prestador <strong className="text-stone-900">{hostName}</strong> ha recibido tu pedido y se contactará para coordinar la seña.
        </p>
      </div>

      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
        <p>Estadía: <strong>{checkIn || 'A coordinar'}</strong> al <strong>{checkOut || 'A coordinar'}</strong> ({nightsCount ?? 0} noches)</p>
        <p>Total estimado: <strong>${(totalPrice ?? 0).toLocaleString('es-AR')} ARS</strong></p>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
      >
        <MessageSquare className="w-4 h-4" />
        <span>Contactar ahora por WhatsApp</span>
      </a>
    </div>
  );
};
