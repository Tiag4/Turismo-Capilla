import React from 'react';
import type { NightPhase, StargazingSpot } from '../types';

interface AstroInsightPanelProps {
  phase: NightPhase;
  spots: StargazingSpot[];
  activeSpot: StargazingSpot;
  onSelectSpot: (id: string) => void;
}

export const AstroInsightPanel: React.FC<AstroInsightPanelProps> = ({
  phase,
  spots,
  activeSpot,
  onSelectSpot,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Columna Izquierda: Detalle de la Fase Activa (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 flex flex-col justify-between space-y-5 shadow-xs">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-xl border border-primary-100">
              {phase.timeLabel} · {phase.darknessLevel}
            </span>
          </div>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-sand-900 tracking-tight">
            {phase.title}
          </h3>

          <p className="text-sm sm:text-base text-sand-700 leading-relaxed font-normal">
            {phase.description}
          </p>
        </div>

        {/* Recomendación Práctica de Astroturismo */}
        <div className="p-4 bg-sand-50 rounded-2xl border border-sand-200 text-xs text-sand-800 space-y-1.5">
          <span className="font-bold text-sand-900 block">
            Guía práctica para esta hora:
          </span>
          <p className="leading-relaxed text-sand-700">
            {phase.recommendedActivity}
          </p>
        </div>
      </div>

      {/* Columna Derecha: Miradores de Cielos Limpios (5 cols) */}
      <div className="lg:col-span-5 bg-sand-900 text-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-md border border-sand-800">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sand-300 uppercase tracking-wider">
              Miradores Certificados
            </span>
            <span className="text-xs text-primary-400 font-semibold font-mono">
              Bortle 2-3
            </span>
          </div>

          {/* Selector de Mirador */}
          <div className="flex gap-2 p-1 bg-sand-800/80 rounded-xl">
            {spots.map((spot) => {
              const isSelected = spot.id === activeSpot.id;
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => onSelectSpot(spot.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-white text-sand-900 shadow-xs'
                      : 'text-sand-300 hover:text-white'
                  }`}
                >
                  {spot.title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-display font-bold text-lg text-white">
              {activeSpot.title}
            </h4>
            <div className="flex items-center gap-3 text-xs text-primary-300 font-semibold">
              <span>{activeSpot.altitudeMsnm} msnm</span>
              <span>•</span>
              <span>{activeSpot.accessibility}</span>
            </div>
            <p className="text-xs text-sand-300 leading-relaxed">
              {activeSpot.description}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-sand-800 space-y-1.5">
          {activeSpot.features.map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-sand-300">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
