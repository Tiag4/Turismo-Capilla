import React from 'react';
import { useAttractionsFilter } from './hooks/useAttractionsFilter';
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
    resetFilters,
  } = useAttractionsFilter();

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial y Buscador */}
      <AttractionsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
      />

      {/* Barra de Filtros por Categoría, Dificultad y Orden */}
      <AttractionsFilterBar
        category={category}
        onSelectCategory={setCategory}
        difficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalCount={totalCount}
      />

      {/* Grilla Responsive de Atractivos y Senderos (Mobile 1 col, Tablet 2 col, Desktop 3 col) */}
      {totalCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredAttractions.map((item) => (
            <AttractionCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <AttractionsEmptyState onReset={resetFilters} />
      )}
    </div>
  );
};
