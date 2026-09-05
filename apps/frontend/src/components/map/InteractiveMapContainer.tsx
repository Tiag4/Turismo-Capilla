import React, { useState, useMemo } from 'react';
import { MOCK_PLACES, type MapPlace } from '../../data/mock-places';
import { useLeafletMap } from './hooks/useLeafletMap';
import { MapCardPreview } from './MapCardPreview';

type FilterCategory = 'all' | 'accommodation' | 'attraction';

export const InteractiveMapContainer: React.FC = () => {
  const [category, setCategory] = useState<FilterCategory>('all');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);

  const filteredPlaces = useMemo(() => {
    if (category === 'all') return MOCK_PLACES;
    return MOCK_PLACES.filter((p) => p.type === category);
  }, [category]);

  const { containerRef, isLoaded } = useLeafletMap({
    places: filteredPlaces,
    selectedPlace,
    onSelectPlace: setSelectedPlace,
  });

  return (
    <div className="relative w-full h-[550px] sm:h-[620px] rounded-3xl overflow-hidden border border-sand-200 shadow-2xl shadow-sand-300/30 bg-sand-100">
      {/* Mapa Leaflet */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Spinner de Carga Inicial */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-sand-50/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-8 h-8 rounded-full border-3 border-primary-500 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-sand-700">Cargando mapa de las sierras...</span>
        </div>
      )}

      {/* Controles de Filtros Flotantes */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
            category === 'all'
              ? 'bg-sand-900 text-white'
              : 'bg-white/95 text-sand-800 hover:bg-white border border-sand-200'
          }`}
        >
          Todo ({MOCK_PLACES.length})
        </button>

        <button
          type="button"
          onClick={() => setCategory('accommodation')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
            category === 'accommodation'
              ? 'bg-primary-500 text-white'
              : 'bg-white/95 text-sand-800 hover:bg-white border border-sand-200'
          }`}
        >
          <span>🏡</span>
          <span>Cabañas & Alojamientos</span>
        </button>

        <button
          type="button"
          onClick={() => setCategory('attraction')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
            category === 'attraction'
              ? 'bg-uritorco-600 text-white'
              : 'bg-white/95 text-sand-800 hover:bg-white border border-sand-200'
          }`}
        >
          <span>⛰️</span>
          <span>Paseos & Senderos</span>
        </button>
      </div>

      {/* Card Flotante de Vista Previa (Popover) */}
      {selectedPlace && (
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 max-w-[90vw]">
          <MapCardPreview place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        </div>
      )}
    </div>
  );
};