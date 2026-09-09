import React from 'react';

interface AttractionsEmptyStateProps {
  onReset: () => void;
}

export const AttractionsEmptyState: React.FC<AttractionsEmptyStateProps> = ({ onReset }) => {
  return (
    <div className="py-16 px-4 text-center rounded-2xl border border-sand-300 bg-sand-100/50 space-y-4 max-w-xl mx-auto">
      {/* Ícono sin contenedor circular decorativo (Regla 9 Anti-vibecoded) */}
      <svg className="w-8 h-8 text-sand-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-sand-900">
          No encontramos senderos con esos filtros
        </h3>
        <p className="text-sand-600 text-sm">
          Probá buscando con otro término o seleccionando todas las categorías y dificultades.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sand-900 text-white hover:bg-terracotta-600 transition-colors cursor-pointer"
      >
        <span>Restablecer todos los filtros</span>
      </button>
    </div>
  );
};
