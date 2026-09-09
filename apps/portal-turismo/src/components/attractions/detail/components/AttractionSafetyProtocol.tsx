import React from 'react';
import type { AttractionPracticalInfo } from '../../types';

interface AttractionSafetyProtocolProps {
  info: AttractionPracticalInfo;
}

export const AttractionSafetyProtocol: React.FC<AttractionSafetyProtocolProps> = ({ info }) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-sand-100 pb-3">
        <h3 className="font-display font-bold text-base text-sand-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-uritorco-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Protocolo de Seguridad & Guardaparques</span>
        </h3>
        <span className="text-[11px] font-bold text-uritorco-800 bg-uritorco-100 px-2 py-0.5 rounded-md">
          Oficial
        </span>
      </div>

      {/* Reglas críticas destacadas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="font-bold text-sand-900 block mb-0.5">Horario & Registro</span>
          <span className="text-sand-600">{info.openingHours}</span>
          {info.cutoffTime && (
            <span className="block mt-1 font-semibold text-terracotta-700">
              {info.cutoffTime}
            </span>
          )}
        </div>

        <div className="p-3 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="font-bold text-sand-900 block mb-0.5">Ración de Hidratación</span>
          <span className="text-sand-600">{info.hydrationRequirement}</span>
        </div>
      </div>

      {/* Advertencias */}
      {info.safetyWarnings && info.safetyWarnings.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-sand-800 uppercase tracking-wider block">
            Normas de Cumplimiento Obligatorio
          </span>
          <ul className="space-y-1.5 text-xs text-sand-700">
            {info.safetyWarnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-terracotta-600 font-bold shrink-0">•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Teléfonos de Emergencia de Capilla del Monte */}
      <div className="pt-3 border-t border-sand-100 flex flex-wrap items-center justify-between gap-3 text-xs text-sand-600">
        <span className="font-semibold text-sand-800">Emergencias Capilla del Monte:</span>
        <div className="flex items-center gap-3 font-mono font-bold text-sand-900">
          <span>Bomberos: 100</span>
          <span>•</span>
          <span>Policía: 101</span>
          <span>•</span>
          <span>Hospital: 107</span>
        </div>
      </div>
    </div>
  );
};
