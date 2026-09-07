import React from 'react';
import { Sparkles, Waves, Mountain, HeartHandshake, Flame, Droplets, ArrowUpDown } from 'lucide-react';
import type { PillFilter, SortOption } from '../hooks/useAccommodationsFilter';

interface AccommodationsFilterPillsProps {
  selectedPill: PillFilter;
  onSelectPill: (pill: PillFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

interface PillItem {
  id: PillFilter;
  label: string;
  icon: React.ReactNode;
}

const PILLS: PillItem[] = [
  { id: 'all', label: 'Todos', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'pileta', label: 'Con pileta', icon: <Waves className="w-3.5 h-3.5" /> },
  { id: 'falda', label: 'Falda del Uritorco', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'pet', label: 'Pet-friendly', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  { id: 'asador', label: 'Con asador', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'rio', label: 'Cerca del río', icon: <Droplets className="w-3.5 h-3.5" /> },
];

export const AccommodationsFilterPills: React.FC<AccommodationsFilterPillsProps> = ({
  selectedPill,
  onSelectPill,
  sortOption,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-stone-200/80">
      {/* Carrusel de Píldoras de Filtro Rápido */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {PILLS.map((pill) => {
          const isActive = selectedPill === pill.id;
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onSelectPill(pill.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
              }`}
            >
              <span className={isActive ? 'text-terracotta-400' : 'text-stone-500'}>{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contador y Ordenamiento */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        <span className="text-xs font-bold text-stone-500">
          <strong className="text-stone-900 font-extrabold">{totalCount}</strong> {totalCount === 1 ? 'alojamiento' : 'alojamientos'}
        </span>

        {/* Selector de Orden */}
        <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
          <ArrowUpDown className="w-3 h-3 text-stone-500 shrink-0" />
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="recommended">Recomendados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="rating-desc">Mejor puntuados</option>
          </select>
        </div>
      </div>
    </div>
  );
};
