import React from 'react';
import { Mountain, ShieldCheck, Phone, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { ADVENTURE_ACTIVITIES } from './data/circuitsData';

export const AdventureCircuitView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner de Turismo Activo & Seguridad */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-sand-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Mountain className="w-3.5 h-3.5" />
          <span>Turismo Activo & Deportes de Montaña</span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-3xl text-white">
          Aventura Segura en las Sierras de Punilla
        </h3>

        <p className="text-sm text-sand-200 leading-relaxed max-w-3xl font-light">
          Capilla del Monte y sus alrededores ofrecen escenarios naturales inmejorables para el vuelo libre, la escalada vertical y la exploración de cavernas. Por normativa municipal y provincial, las actividades técnicas requieren la asistencia de prestadores homologados y seguros de turismo activo al día.
        </p>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 text-xs text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Todos los prestadores listados cuentan con matrícula oficial de la Cámara de Turismo de Capilla del Monte y guías habilitados.</span>
        </div>
      </div>

      {/* Grilla de Modalidades de Aventura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ADVENTURE_ACTIVITIES.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-sand-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {act.modalityLabel}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-sand-500">
                  <Clock className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>{act.duration}</span>
                </span>
              </div>

              <div>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-sand-900">
                  {act.title}
                </h4>
                <span className="text-xs font-semibold text-terracotta-600 block mt-0.5">
                  Ubicación: {act.location} · Dificultad: {act.difficulty}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
                {act.description}
              </p>

              {/* Equipamiento sugerido */}
              <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 space-y-1.5 text-xs">
                <span className="font-bold text-sand-800 block">Equipamiento sugerido para el participante:</span>
                {act.suggestedGear.map((gear, gIdx) => (
                  <div key={gIdx} className="flex items-start gap-1.5 text-sand-700 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-uritorco-600 shrink-0 mt-0.5" />
                    <span>{gear}</span>
                  </div>
                ))}
              </div>

              {/* Requisitos de seguridad */}
              <div className="space-y-1 text-xs text-amber-900 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                <span className="font-bold flex items-center gap-1 text-amber-950">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Protocolo de seguridad:
                </span>
                {act.safetyRequirements.map((req, rIdx) => (
                  <p key={rIdx} className="text-[11px] text-amber-900 leading-tight">
                    • {req}
                  </p>
                ))}
              </div>
            </div>

            {/* Prestadores certificados */}
            <div className="pt-4 border-t border-sand-200 space-y-2">
              <span className="text-xs font-bold text-sand-900 uppercase tracking-wider block">
                Prestadores Certificados & Reservas:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {act.certifiedProviders.map((prov, pIdx) => (
                  <div key={pIdx} className="bg-sand-50 p-3 rounded-xl border border-sand-200 text-xs space-y-1">
                    <span className="font-bold text-sand-900 block truncate">{prov.name}</span>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-800">
                      {prov.certificationBadge}
                    </span>
                    <div className="flex items-center gap-1.5 text-sand-700 pt-0.5">
                      <Phone className="w-3 h-3 text-uritorco-600" />
                      <a href={`tel:${prov.contact}`} className="font-semibold text-sand-800 hover:text-terracotta-600">
                        {prov.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
