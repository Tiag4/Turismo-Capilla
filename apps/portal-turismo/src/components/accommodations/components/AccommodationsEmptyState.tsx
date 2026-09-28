import React from 'react';
import { Home, RefreshCw } from 'lucide-react';

interface AccommodationsEmptyStateProps {
  onResetFilters: () => void;
}

export const AccommodationsEmptyState: React.FC<AccommodationsEmptyStateProps> = ({ onResetFilters }) => {
  return (
    <div className="text-center py-20 px-4 bg-white rounded-3xl border border-stone-200 shadow-sm max-w-xl mx-auto my-8 space-y-4">
      <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-stone-500">
        <Home className="w-8 h-8 text-stone-400" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-stone-900">
          No encontramos alojamientos con esos criterios
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Probá buscando en otra zona, cambiando las fechas de check-in o quitando algunas de las comodidades seleccionadas.
        </p>
      </div>
      <div className="pt-2">
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Restablecer todos los filtros</span>
        </button>
      </div>
    </div>
  );
};
