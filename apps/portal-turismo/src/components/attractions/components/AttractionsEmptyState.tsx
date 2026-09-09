import React from 'react';

interface AttractionsEmptyStateProps {
  onReset: () => void;
}

export const AttractionsEmptyState: React.FC<AttractionsEmptyStateProps> = ({ onReset }) => {
  return (
    <div className="py-16 px-4 text-center rounded-2xl border border-dashed border-sand-300 bg-white/60 space-y-4 max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-sand-200 text-sand-600 mx-auto flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-sand-900">
          No encontramos senderos con esos filtros
        </h3>
        <p className="text-sand-600 text-sm">
          Probá buscando con otro término, seleccionando todas las categorías o despejando la dificultad.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sand-900 text-white hover:bg-sand-800 transition-colors cursor-pointer"
      >
        <span>Restablecer todos los filtros</span>
      </button>
    </div>
  );
};
