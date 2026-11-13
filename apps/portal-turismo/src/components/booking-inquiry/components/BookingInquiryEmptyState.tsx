import React from 'react';
import { ShieldCheck, PhoneCall, FileCheck } from 'lucide-react';

export const BookingInquiryEmptyState: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white/80 rounded-2xl border border-sand-300 p-6 sm:p-8 text-center space-y-4 shadow-2xs">
        <svg className="w-8 h-8 text-sand-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>

        <div className="space-y-1.5">
          <h3 className="font-display font-black text-base text-sand-950">
            ¿Dónde encuentro mi código de reserva?
          </h3>
          <p className="text-xs sm:text-sm text-sand-600 leading-relaxed max-w-lg mx-auto">
            Tu código oficial tiene el formato <code className="font-mono bg-sand-200/80 px-1.5 py-0.5 rounded text-sand-900 font-bold">CAP-2026-XXXX</code> y fue asignado al confirmar tu solicitud o enviado a tu correo electrónico.
          </p>
        </div>

        <div className="pt-2 text-xs text-sand-600 font-medium">
          ¿Aún no realizaste tu estadía?{' '}
          <a href="/alojamientos" className="text-terracotta-600 font-bold hover:underline">
            Explorá las cabañas y posadas habilitadas
          </a>
        </div>
      </div>

      {/* Grid Informativo para Continuidad Visual */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="bg-white/60 border border-sand-200 rounded-xl p-4 space-y-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <h4 className="font-bold text-sand-900">Garantía Municipal</h4>
          <p className="text-sand-600 text-[11px] leading-relaxed">
            Todos los vouchers corresponden a prestadores formales con inspección edilicia y matafuegos al día.
          </p>
        </div>

        <div className="bg-white/60 border border-sand-200 rounded-xl p-4 space-y-1.5">
          <PhoneCall className="w-4 h-4 text-terracotta-600" />
          <h4 className="font-bold text-sand-900">Trato Directo</h4>
          <p className="text-sand-600 text-[11px] leading-relaxed">
            Accedé al teléfono y WhatsApp oficial del anfitrión para coordinar horarios de llegada y seña.
          </p>
        </div>

        <div className="bg-white/60 border border-sand-200 rounded-xl p-4 space-y-1.5">
          <FileCheck className="w-4 h-4 text-uritorco-600" />
          <h4 className="font-bold text-sand-900">Voucher Imprimible</h4>
          <p className="text-sand-600 text-[11px] leading-relaxed">
            Descargá o imprimí el comprobante para presentarlo en el check-in o ante la Secretaría de Turismo.
          </p>
        </div>
      </div>
    </div>
  );
};
