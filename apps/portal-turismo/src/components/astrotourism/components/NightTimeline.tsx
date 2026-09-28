import React from 'react';
import type { NightPhase } from '../types';

interface NightTimelineProps {
  phases: NightPhase[];
  currentIndex: number;
  onSelectPhase: (index: number) => void;
}

export const NightTimeline: React.FC<NightTimelineProps> = ({
  phases,
  currentIndex,
  onSelectPhase,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-sand-800 uppercase tracking-wider">
          Línea de Tiempo Nocturna (El Paso de la Noche)
        </span>
        <span className="text-xs text-sand-500 font-medium">
          Seleccioná una hora para transformar la bóveda celeste
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {phases.map((phase, idx) => {
          const isActive = currentIndex === idx;
          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onSelectPhase(idx)}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                isActive
                  ? 'bg-sand-900 text-white border-sand-900 shadow-md ring-2 ring-primary-500/30'
                  : 'bg-white hover:bg-sand-100 text-sand-800 border-sand-200 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono font-bold ${isActive ? 'text-primary-400' : 'text-primary-600'}`}>
                  {phase.timeLabel}
                </span>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary-400 animate-ping' : 'bg-sand-300'}`} />
              </div>
              <span className="block font-display font-bold text-sm leading-snug line-clamp-1">
                {phase.title}
              </span>
              <span className={`block text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-sand-300' : 'text-sand-500'}`}>
                {phase.subtitle}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
