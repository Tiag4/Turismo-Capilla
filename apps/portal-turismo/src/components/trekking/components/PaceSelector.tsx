import React from 'react';
import type { HikerPace } from '../types';

interface PaceSelectorProps {
  selectedPace: HikerPace;
  onSelectPace: (pace: HikerPace) => void;
}

const PACES: Array<{ id: HikerPace; label: string; duration: string; hint: string }> = [
  { id: 'relaxed', label: 'Paseo Contemplativo', duration: '4.5 hs', hint: 'Fotografía y paradas frecuentes' },
  { id: 'moderate', label: 'Ritmo Trekking', duration: '3.5 hs', hint: 'Paso constante con pausas breves' },
  { id: 'sport', label: 'Ágil / Experto', duration: '2.5 hs', hint: 'Entrenamiento o experiencia previa' },
];

export const PaceSelector: React.FC<PaceSelectorProps> = ({ selectedPace, onSelectPace }) => {
  return (
    <div className="space-y-2">
      <span className="block text-xs font-bold text-sand-800 uppercase tracking-wider">
        Ritmo estimado de ascenso:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-1.5 bg-sand-200/60 rounded-2xl border border-sand-300/80">
        {PACES.map((p) => {
          const isActive = selectedPace === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPace(p.id)}
              className={`px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-sand-900 text-white shadow-xs'
                  : 'text-sand-700 hover:bg-sand-100/90 hover:text-sand-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold leading-tight">{p.label}</span>
                <span className={`text-xs font-mono font-bold shrink-0 ${isActive ? 'text-primary-400' : 'text-sand-600'}`}>
                  {p.duration}
                </span>
              </div>
              <span className={`block text-[11px] mt-1 leading-snug ${isActive ? 'text-sand-300' : 'text-sand-500'}`}>
                {p.hint}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
