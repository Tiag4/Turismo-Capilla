import React from 'react';
import type { AttractionPracticalInfo } from '../../types';

interface AttractionSafetyProtocolProps {
  info: AttractionPracticalInfo;
  isTrekking?: boolean;
}

export const AttractionSafetyProtocol: React.FC<AttractionSafetyProtocolProps> = ({
  info,
  isTrekking = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-sand-100 pb-3">
        <h3 className="font-display font-black text-lg text-sand-950 flex items-center gap-2">
          <svg className="w-5 h-5 text-uritorco-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{isTrekking ? 'Protocolo de Seguridad & Guardaparques' : 'Información Práctica & Recomendaciones'}</span>
        </h3>
        <span className="text-[11px] font-bold text-white bg-sand-900 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
          Normativa Oficial
        </span>
      </div>

      {/* Reglas críticas en lista plana sin cajas anidadas (Anti-Vibecoded) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="border-l-2 border-sand-300 pl-3">
          <span className="font-black text-sand-950 text-xs block mb-0.5 uppercase tracking-wider">
            Horarios & Ingreso
          </span>
          <span className="text-sand-700">{info.openingHours}</span>
          {info.cutoffTime && (
            <span className="block mt-1 font-bold text-terracotta-700">
              {info.cutoffTime}
            </span>
          )}
        </div>

        <div className="border-l-2 border-sand-300 pl-3">
          <span className="font-black text-sand-950 text-xs block mb-0.5 uppercase tracking-wider">
            {isTrekking ? 'Ración de Hidratación Obligatoria' : 'Recomendación de Agua'}
          </span>
          <span className="text-sand-700">{info.hydrationRequirement}</span>
        </div>
      </div>

      {/* Normas y advertencias sin puntitos naranjas vibecoded */}
      {info.safetyWarnings && info.safetyWarnings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-sand-100">
          <span className="text-xs font-black text-sand-950 uppercase tracking-wider block">
            Pautas de Visita
          </span>
          <ul className="space-y-2 text-xs text-sand-700">
            {info.safetyWarnings.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-sand-400 font-bold shrink-0">—</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Teléfonos de Emergencia */}
      {isTrekking && (
        <div className="pt-3 border-t border-sand-100 flex flex-wrap items-center justify-between gap-3 text-xs text-sand-600">
          <span className="font-bold text-sand-900">Emergencias Capilla del Monte:</span>
          <div className="flex items-center gap-3 font-mono font-bold text-sand-950">
            <span>Bomberos: 100</span>
            <span>·</span>
            <span>Policía: 101</span>
            <span>·</span>
            <span>Hospital: 107</span>
          </div>
        </div>
      )}
    </div>
  );
};
