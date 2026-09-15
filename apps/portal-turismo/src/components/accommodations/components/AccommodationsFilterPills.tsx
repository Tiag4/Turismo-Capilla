import React from 'react';
import { Layers, Waves, Mountain, HeartHandshake, Flame, Droplets, ArrowUpDown } from 'lucide-react';
import type { PillFilter, SortOption } from '../hooks/useAccommodationsFilter';
import { CustomSelect, type Option } from '../../ui/CustomSelect';

interface AccommodationsFilterPillsProps {
  selectedPills: PillFilter[];
  onTogglePill: (pill: PillFilter) => void;
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
  { id: 'all', label: 'Todos', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'pileta', label: 'Con pileta', icon: <Waves className="w-3.5 h-3.5" /> },
  { id: 'falda', label: 'Falda del Uritorco', icon: <Mountain className="w-3.5 h-3.5" /> },
  { id: 'pet', label: 'Pet-friendly', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  { id: 'asador', label: 'Con asador', icon: <Flame className="w-3.5 h-3.5" /> },
  { id: 'rio', label: 'Cerca del río', icon: <Droplets className="w-3.5 h-3.5" /> },
];

const SORT_OPTIONS: Option[] = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'rating-desc', label: 'Mejor puntuados' },
];

export const AccommodationsFilterPills: React.FC<AccommodationsFilterPillsProps> = ({
  selectedPills,
  onTogglePill,
  sortOption,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-stone-200/80">
      {/* Carrusel de Píldoras de Filtro Rápido Multi-selección */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {PILLS.map((pill) => {
          const isActive =
            pill.id === 'all'
              ? selectedPills.includes('all') || selectedPills.length === 0
              : selectedPills.includes(pill.id);
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onTogglePill(pill.id)}
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

      {/* Contador y Ordenamiento Custom */}
      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
        <span className="text-xs font-bold text-stone-500">
          <strong className="text-stone-900 font-extrabold">{totalCount}</strong>{' '}
          {totalCount === 1 ? 'alojamiento' : 'alojamientos'}
        </span>

        {/* Selector de Orden Custom */}
        <div className="w-44">
          <CustomSelect
            label="Ordenar por"
            value={sortOption}
            onChange={(val) => onSortChange(val as SortOption)}
            options={SORT_OPTIONS}
            variant="compact"
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
          />
        </div>
      </div>
    </div>
  );
};
