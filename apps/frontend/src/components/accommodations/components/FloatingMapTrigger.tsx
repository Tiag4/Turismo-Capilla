import React from 'react';
import { Map } from 'lucide-react';

interface FloatingMapTriggerProps {
  totalCount: number;
  onOpenMap: () => void;
}

export const FloatingMapTrigger: React.FC<FloatingMapTriggerProps> = ({ totalCount, onOpenMap }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={onOpenMap}
        aria-label="Abrir mapa de alojamientos"
        className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold text-xs shadow-2xl hover:shadow-stone-950/40 border border-stone-700/80 transition-all hover:scale-105 cursor-pointer select-none"
      >
        <Map className="w-4 h-4 text-terracotta-400 group-hover:rotate-12 transition-transform" />
        <span className="font-display font-bold tracking-wide">Ver en Mapa</span>
        <span className="bg-terracotta-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {totalCount}
        </span>
      </button>
    </div>
  );
};
