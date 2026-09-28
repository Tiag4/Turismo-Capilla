import React from 'react';

export const BookingInquiryEmptyState: React.FC = () => {
  return (
    <div className="bg-white/70 rounded-2xl border border-sand-300 p-8 text-center space-y-4 max-w-xl mx-auto">
      {/* Ícono sin contenedor circular pastel (Regla 9 Anti-vibecoded) */}
      <svg className="w-8 h-8 text-sand-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>

      <div className="space-y-1">
        <h3 className="font-display font-black text-base text-sand-950">
          ¿Dónde encuentro mi código de reserva?
        </h3>
        <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
          Tu código oficial tiene el formato <code className="font-mono bg-sand-200/80 px-1.5 py-0.5 rounded text-sand-900 font-bold">CAP-2026-XXXX</code> y fue generado al finalizar tu solicitud o notificado al WhatsApp del anfitrión.
        </p>
      </div>

      <div className="pt-2 text-xs text-sand-600 font-medium">
        ¿Aún no hiciste tu reserva?{' '}
        <a href="/alojamientos" className="text-terracotta-600 font-bold hover:underline">
          Explorá las cabañas y posadas habilitadas
        </a>
      </div>
    </div>
  );
};
