import React from 'react';
import { Layers, Home, Hotel, BedDouble, Building } from 'lucide-react';
import type { AccommodationTypeFilter } from '../hooks/useAccommodationsFilter';

interface AccommodationsTypeTabsProps {
  selectedType: AccommodationTypeFilter;
  onSelectType: (type: AccommodationTypeFilter) => void;
}

interface TypeTabItem {
  id: AccommodationTypeFilter;
  label: string;
  icon: React.ReactNode;
}

const TYPE_TABS: TypeTabItem[] = [
  { id: 'all', label: 'Todos', icon: <Layers className="w-4 h-4" /> },
  { id: 'cabin', label: 'Cabañas', icon: <Home className="w-4 h-4" /> },
  { id: 'inn', label: 'Hosterías', icon: <BedDouble className="w-4 h-4" /> },
  { id: 'hotel', label: 'Hoteles y Posadas', icon: <Hotel className="w-4 h-4" /> },
  { id: 'apartment', label: 'Departamentos', icon: <Building className="w-4 h-4" /> },
];

export const AccommodationsTypeTabs: React.FC<AccommodationsTypeTabsProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div
      role="tablist"
      aria-label="Tipos de alojamiento"
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
    >
      {TYPE_TABS.map((tab) => {
        const isActive = selectedType === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectType(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer select-none whitespace-nowrap ${
              isActive
                ? 'bg-terracotta-500 text-white shadow-md shadow-terracotta-500/20'
                : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200/80 shadow-xs'
            }`}
          >
            <span className={isActive ? 'text-white' : 'text-terracotta-600'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
