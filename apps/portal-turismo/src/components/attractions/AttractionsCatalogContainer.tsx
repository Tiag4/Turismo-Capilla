import React, { useEffect, useMemo, useState } from 'react';
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
import { AdventureCircuitView } from '../circuits/AdventureCircuitView';
import { InteractiveMapContainer } from '../map/InteractiveMapContainer';
import { ADVENTURE_ACTIVITIES, MYSTIC_SPOTS, getCircuitPlaces } from '../circuits/data/circuitsData';
import type { AdventureActivity, CircuitId, CircuitSpot } from '../circuits/types/circuits.types';
import { api } from '../../services/api';

export const AttractionsCatalogContainer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // SSOT: el modo y el circuito se derivan directamente de la URL sin estados duplicados
  const viewMode = searchParams.get('modo') === 'circuitos' ? 'circuitos' : 'senderos';
  const rawCircuit = searchParams.get('circuito') as CircuitId | null;
  const activeCircuit: CircuitId = rawCircuit === 'aventura' ? 'aventura' : 'mistico';

  const [mysticSpots, setMysticSpots] = useState<CircuitSpot[]>(MYSTIC_SPOTS);
  const [adventureActivities, setAdventureActivities] = useState<AdventureActivity[]>(ADVENTURE_ACTIVITIES);

  useEffect(() => {
    let active = true;
    api.getCircuitsConfig().then((remote) => {
      if (!active || !remote) return;
      if (Array.isArray(remote.mysticSpots) && remote.mysticSpots.length > 0) {
        setMysticSpots(remote.mysticSpots as CircuitSpot[]);
      }
      if (Array.isArray(remote.adventureActivities) && remote.adventureActivities.length > 0) {
        setAdventureActivities(remote.adventureActivities as AdventureActivity[]);
      }
    });
    return () => {
      active = false;
    };
  }, []);

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
    if (activeCircuit === 'mistico') {
      return mysticSpots.map((spot) => ({
        id: spot.id,
        type: 'attraction' as const,
        title: spot.title,
        subtitle: spot.subtitle,
        category: 'Circuito Místico',
        lat: spot.coordinates?.lat ?? -30.857,
        lng: spot.coordinates?.lng ?? -64.515,
        rating: 4.9,
        reviewCount: 120,
        imageUrl: spot.image,
        address: 'Capilla del Monte, Córdoba',
        verified: true,
        isFeatured: true,
        distanceFromCenter: spot.bestTime || 'Paseo Diurno',
        ctaUrl: `/atractivos?modo=circuitos&circuito=mistico#${spot.id}`,
      }));
    }
    if (activeCircuit === 'aventura') {
      return adventureActivities.map((act) => ({
        id: act.id,
        type: 'attraction' as const,
        title: act.title,
        subtitle: `${act.modalityLabel} · ${act.location}`,
        category: 'Turismo Alternativo',
        lat: act.coordinates?.lat ?? -30.857,
        lng: act.coordinates?.lng ?? -64.515,
        rating: 4.9,
        reviewCount: 94,
        imageUrl: act.image || '/images/attractions/los-terrones/los-terrones-01.jpg',
        address: act.location,
        verified: true,
        isFeatured: true,
        distanceFromCenter: act.duration,
        difficulty: act.difficulty,
        ctaUrl: `/atractivos?modo=circuitos&circuito=aventura#${act.id}`,
      }));
    }
    return getCircuitPlaces(activeCircuit);
  }, [activeCircuit, mysticSpots, adventureActivities]);

  return (
    <div className="space-y-8">
      {/* Cabecera Editorial y Buscador */}
      <AttractionsHeader
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Selector de Modo Editorial sin bandejas ni tarjetitis (Anti-Vibecoded) */}
      <div className="flex flex-wrap items-center gap-6 border-b border-sand-200">
        <button
          type="button"
          onClick={() => handleSelectViewMode('senderos')}
          className={`flex items-center gap-2 pb-3 -mb-px text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            viewMode === 'senderos'
              ? 'border-terracotta-600 text-sand-950'
              : 'border-transparent text-sand-600 hover:text-sand-900'
          }`}
        >
          <Mountain className={`w-4 h-4 ${viewMode === 'senderos' ? 'text-terracotta-600' : 'text-sand-500'}`} />
          <span>Catálogo de Senderos</span>
          <span className="text-[11px] font-semibold text-sand-500">({totalCount})</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectViewMode('circuitos')}
          className={`flex items-center gap-2 pb-3 -mb-px text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
            viewMode === 'circuitos'
              ? 'border-terracotta-600 text-sand-950'
              : 'border-transparent text-sand-600 hover:text-sand-900'
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
          {activeCircuit === 'mistico' && <MysticCircuitView spots={mysticSpots} />}
          {activeCircuit === 'aventura' && <AdventureCircuitView activities={adventureActivities} />}

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
