import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Mountain, MapPin } from 'lucide-react';
import { useAttractionsFilter } from './hooks/useAttractionsFilter';
import type { AttractionItem } from './types';
import { AttractionsHeader } from './components/AttractionsHeader';
import { AttractionsFilterBar } from './components/AttractionsFilterBar';
import { AttractionCard } from './components/AttractionCard';
import { AttractionsEmptyState } from './components/AttractionsEmptyState';
import { CircuitTabs } from '../circuits/CircuitTabs';
import { MysticCircuitView } from '../circuits/MysticCircuitView';
import { GastronomicCircuitView } from '../circuits/GastronomicCircuitView';
import { AdventureCircuitView } from '../circuits/AdventureCircuitView';
import { InteractiveMapContainer } from '../map/InteractiveMapContainer';
import { getCircuitPlaces } from '../circuits/data/circuitsData';
import type { CircuitId } from '../circuits/types/circuits.types';

export const AttractionsCatalogContainer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // SSOT: el modo y el circuito se derivan directamente de la URL sin estados duplicados ni useEffects reactivos
  const viewMode = searchParams.get('modo') === 'circuitos' ? 'circuitos' : 'senderos';
  const activeCircuit = (searchParams.get('circuito') as CircuitId) || 'mistico';

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

  const handleSelectViewMode = (mode: 'senderos' | 'circuitos') => {
    const newParams = new URLSearchParams(searchParams);
    if (mode === 'circuitos') {
      newParams.set('modo', 'circuitos');
      if (!newParams.get('circuito')) {
        newParams.set('circuito', 'mistico');
      }
    } else {
      newParams.delete('modo');
      newParams.delete('circuito');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSelectCircuit = (circuitId: CircuitId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('modo', 'circuitos');
    newParams.set('circuito', circuitId);
    setSearchParams(newParams, { replace: true });
  };

  const circuitPlaces = useMemo(() => {
    return getCircuitPlaces(activeCircuit);
  }, [activeCircuit]);

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial y Buscador */}
      <AttractionsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Selector de Modo de Exploración Integrado (Anti-Vibecoded & Gestalt) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-sand-200/70 rounded-2xl border border-sand-300/70 max-w-fit">
        <button
          type="button"
          onClick={() => handleSelectViewMode('senderos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'senderos'
              ? 'bg-white text-sand-900 shadow-xs border border-sand-300/60'
              : 'text-sand-700 hover:text-sand-950 hover:bg-white/40'
          }`}
        >
          <Mountain className={`w-4 h-4 ${viewMode === 'senderos' ? 'text-terracotta-600' : 'text-sand-500'}`} />
          <span>Catálogo de Senderos</span>
          <span className="text-[11px] font-semibold text-sand-500">({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectViewMode('circuitos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            viewMode === 'circuitos'
              ? 'bg-white text-sand-900 shadow-xs border border-sand-300/60'
              : 'text-sand-700 hover:text-sand-950 hover:bg-white/40'
          }`}
        >
          <Compass className={`w-4 h-4 ${viewMode === 'circuitos' ? 'text-terracotta-600' : 'text-sand-500'}`} />
          <span>Circuitos Temáticos Oficiales</span>
        </button>
      </div>

      {viewMode === 'senderos' ? (
        <div className="space-y-6">
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

          {/* Grilla Responsive de Atractivos y Senderos */}
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
      ) : (
        <div className="space-y-10 pt-2">
          {/* Selector de Circuito Temático */}
          <CircuitTabs
            activeCircuit={activeCircuit}
            onSelectCircuit={handleSelectCircuit}
          />

          {/* Contenido Curado del Circuito Seleccionado */}
          {activeCircuit === 'mistico' && <MysticCircuitView />}
          {activeCircuit === 'sabores' && <GastronomicCircuitView />}
          {activeCircuit === 'aventura' && <AdventureCircuitView />}

          {/* Mapa Interactivo Oficial Reutilizado (Leaflet con Topografía) */}
          <div className="space-y-3 pt-4" id="mapa">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-terracotta-600" />
                <h3 className="font-display font-bold text-lg text-sand-900">
                  Ubicaciones del Circuito en el Mapa
                </h3>
              </div>
              <span className="text-xs text-sand-500 font-medium">Topografía oficial con Leaflet</span>
            </div>
            <InteractiveMapContainer
              places={circuitPlaces}
              showFilters={false}
              heightClassName="h-[460px] sm:h-[520px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
