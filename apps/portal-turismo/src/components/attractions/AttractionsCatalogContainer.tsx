import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight } from 'lucide-react';
import { useAttractionsFilter } from './hooks/useAttractionsFilter';
import type { AttractionItem } from './types';
import { AttractionsHeader } from './components/AttractionsHeader';
import { AttractionsFilterBar } from './components/AttractionsFilterBar';
import { AttractionCard } from './components/AttractionCard';
import { AttractionsEmptyState } from './components/AttractionsEmptyState';

export const AttractionsCatalogContainer: React.FC = () => {
  const {
    search,
    setSearch,
    category,
    setCategory,
    difficulty,
    setDifficulty,
    sortBy,
    setSortBy,
    filteredAttractions,
    totalCount,
    isLoading,
    resetFilters,
  } = useAttractionsFilter();

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial y Buscador */}
      <AttractionsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Acceso Destacado a Circuitos Temáticos (HU-21) */}
      <div className="bg-gradient-to-r from-sand-900 to-uritorco-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-sand-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-terracotta-500/20 text-terracotta-400 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-terracotta-400 uppercase tracking-wider block">
              Circuitos Temáticos Oficiales
            </span>
            <p className="text-sm font-semibold text-white">
              Explorá el Circuito Místico, Sabores Serranos y Aventura Activa
            </p>
          </div>
        </div>
        <Link
          to="/circuitos"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          <span>Explorar Circuitos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Barra de Filtros por Categoría, Dificultad y Orden */}
      <AttractionsFilterBar
        category={category}
        onSelectCategory={setCategory}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Grilla Responsive de Atractivos y Senderos (Mobile 1 col, Tablet 2 col, Desktop 3 col) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-sand-200/50 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : totalCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredAttractions.map((item: AttractionItem) => (
            <AttractionCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <AttractionsEmptyState onReset={resetFilters} />
      )}
    </div>
  );
};
