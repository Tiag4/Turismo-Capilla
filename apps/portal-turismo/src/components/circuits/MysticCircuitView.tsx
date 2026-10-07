import React from 'react';
import { Sparkles, MapPin, Compass, ShieldCheck, HeartHandshake, Eye } from 'lucide-react';
import { MYSTIC_SPOTS } from './data/circuitsData';

export const MysticCircuitView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner de Introducción Mística y Recomendaciones */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-sand-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-200 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Guía de Conexión & Respeto Ancestral</span>
          </div>
          <span className="text-xs text-purple-200 font-medium">Turismo Holístico Regulado</span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-3xl text-white">
          Ascensos Conscientes & Vórtices de Meditación
        </h3>

        <p className="text-sm text-sand-200 leading-relaxed max-w-3xl font-light">
          El Uritorco y sus quebradas son considerados territorio sagrado. Para vivenciar la experiencia en plenitud, se sugiere caminar en silencio, evitar la música electrónica en senderos naturales, practicar la respiración consciente y realizar los ascensos nocturnos acompañados por guías habilitados con matrícula provincial.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-purple-100">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-purple-300 shrink-0" />
            <span>Meditaciones en Luna Llena</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
            <HeartHandshake className="w-4 h-4 text-purple-300 shrink-0" />
            <span>Círculos de Sonido & Cuencos</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-300 shrink-0" />
            <span>Guías Matriculados Oficiales</span>
          </div>
        </div>
      </div>

      {/* Grilla de Vórtices Místicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MYSTIC_SPOTS.map((spot) => (
          <div
            key={spot.id}
            className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="p-6 sm:p-7 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  {spot.badge}
                </span>
                {spot.energyAttribute && (
                  <span className="text-[11px] font-semibold text-sand-500 bg-sand-100 px-2.5 py-0.5 rounded-full">
                    {spot.energyAttribute}
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-display font-bold text-xl sm:text-2xl text-sand-900">
                  {spot.title}
                </h4>
                <p className="text-xs sm:text-sm text-terracotta-700 font-semibold mt-0.5">
                  {spot.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
                {spot.description}
              </p>

              {/* Puntos Destacados */}
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-bold text-sand-800 block">Atributos del lugar:</span>
                {spot.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-sand-700">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              {/* Recomendaciones de meditación */}
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-3.5 space-y-1.5 text-xs text-purple-900">
                <span className="font-bold flex items-center gap-1.5 text-purple-950">
                  <Eye className="w-3.5 h-3.5" /> Recomendación consciente:
                </span>
                {spot.recommendations.map((rec, rIdx) => (
                  <p key={rIdx} className="text-[11px] text-purple-800 leading-normal">
                    • {rec}
                  </p>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-sand-50 border-t border-sand-200 flex items-center justify-between text-xs text-sand-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500" />
                <span>Coordenadas verificadas</span>
              </span>
              {spot.bestTime && (
                <span className="font-medium text-purple-700">Mejor momento: {spot.bestTime}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
