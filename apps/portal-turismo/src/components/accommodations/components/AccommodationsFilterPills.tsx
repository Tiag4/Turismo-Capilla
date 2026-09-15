import React from 'react';
import { Waves, Wifi, Car, HeartHandshake, Flame, ArrowUpDown } from 'lucide-react';
import type { AmenityFilter, SortOption } from '../hooks/useAccommodationsFilter';
import { CustomSelect, type Option } from '../../ui/CustomSelect';

interface AccommodationsFilterPillsProps {
  selectedAmenities: AmenityFilter[];
  onToggleAmenity: (amenity: AmenityFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalCount: number;
}

interface AmenityPillItem {
  id: AmenityFilter;
  label: string;
  icon: React.ReactNode;
}

const AMENITY_PILLS: AmenityPillItem[] = [
  { id: 'pileta', label: 'Pileta', icon: <Waves className="w-3.5 h-3.5" /> },
  { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'estacionamiento', label: 'Estacionamiento', icon: <Car className="w-3.5 h-3.5" /> },
  { id: 'pet', label: 'Pet-friendly', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
  { id: 'asador', label: 'Asador / Parrilla', icon: <Flame className="w-3.5 h-3.5" /> },
];

const SORT_OPTIONS: Option[] = [
  { value: 'recommended', label: 'Recomendados' },
  { value: 'price-asc', label: 'Menor precio' },
  { value: 'price-desc', label: 'Mayor precio' },
  { value: 'rating-desc', label: 'Mejor valorados' },
];

export const AccommodationsFilterPills: React.FC<AccommodationsFilterPillsProps> = ({
  selectedAmenities,
  onToggleAmenity,
  sortOption,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 border-b border-stone-200/80">
      {/* Píldoras de Comodidades Destacadas (Multi-selección) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pr-1 shrink-0">
          Comodidades:
        </span>
        {AMENITY_PILLS.map((pill) => {
          const isActive = selectedAmenities.includes(pill.id);
          return (
            <button
              key={pill.id}
              type="button"
              onClick={() => onToggleAmenity(pill.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80'
              }`}
            >
              <span className={isActive ? 'text-terracotta-400' : 'text-stone-500'}>
                {pill.icon}
              </span>
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contador y Ordenamiento */}
      <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
        <span className="text-xs font-bold text-stone-500">
          <strong className="text-stone-900 font-extrabold">{totalCount}</strong>{' '}
          {totalCount === 1 ? 'alojamiento disponible' : 'alojamientos disponibles'}
        </span>

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
