import React from 'react';
import { ShieldAlert, Phone, MapPin, CheckCircle } from 'lucide-react';
import type { HealthGuardNotice } from '../../types/pharmacyDuty.types';

interface HealthGuardNoticeBannerProps {
  healthGuard: HealthGuardNotice;
}

export const HealthGuardNoticeBanner: React.FC<HealthGuardNoticeBannerProps> = ({ healthGuard }) => {
  if (!healthGuard) return null;

  return (
    <section
      aria-label="Guardia Médica Municipal"
      className="bg-white rounded-3xl border border-sand-200 p-6 sm:p-7 shadow-xs space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-700 text-white font-extrabold uppercase px-2.5 py-0.5 rounded-full text-[10px] tracking-wider shadow-xs">
                ATENCIÓN MÉDICA 24HS
              </span>
              <span className="text-xs text-sand-500 font-semibold">Salud Pública Municipal</span>
            </div>
            <h3 className="font-display font-bold text-xl text-sand-900 mt-0.5">
              {healthGuard.facilityName}
            </h3>
          </div>
        </div>

        <a
          href="tel:107"
          className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>Discar Urgencia Médica (107)</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-2 text-sand-700">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
            <span className="font-semibold text-sand-800">Dirección:</span>
            <span>{healthGuard.address} (Centro de Capilla del Monte)</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-semibold text-sand-800">Línea directa:</span>
            <span>{healthGuard.directPhone}</span>
          </p>

          <div className="pt-1">
            <span className="font-bold text-sand-900 block mb-1">Capacidades de Guardia Activa:</span>
            <ul className="space-y-1">
              {healthGuard.activeGuards.map((guard, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-sand-600">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{guard}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {healthGuard.specialNotice && (
          <div className="flex flex-col justify-between p-4 rounded-2xl bg-sand-50 border border-sand-200">
            <div>
              <span className="font-bold text-sand-900 block mb-1">
                Aviso Oficial de la Secretaría de Salud:
              </span>
              <p className="text-sand-700 leading-relaxed italic">
                "{healthGuard.specialNotice}"
              </p>
            </div>
            <p className="text-[10px] text-sand-400 pt-2">
              Información oficial sincronizada en tiempo real con Defensa Civil.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
