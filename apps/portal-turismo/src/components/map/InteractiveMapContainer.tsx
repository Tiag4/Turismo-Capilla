import React, { useState, useMemo } from 'react';
import {
  Home,
  Mountain,
  Waves,
  Compass,
  Landmark,
  Layers,
  ChevronDown,
  Info,
} from 'lucide-react';
import { MOCK_PLACES, type MapPlace } from '../../data/mock-places';
import { useLeafletMap, type TileStyle } from './hooks/useLeafletMap';
import { MapCardPreview } from './MapCardPreview';

type FilterType = 'all' | 'alojamientos' | 'senderos' | 'balnearios' | 'rocas' | 'patrimonio';

interface FilterItem {
  id: FilterType;
  label: string;
  icon: React.ReactNode;
}

const FILTERS: FilterItem[] = [
  {
    id: 'all',
    label: 'Todos',
    icon: <Layers className="w-3.5 h-3.5" />,
  },
  {
    id: 'alojamientos',
    label: 'Alojamientos',
    icon: <Home className="w-3.5 h-3.5" />,
  },
  {
    id: 'senderos',
    label: 'Senderos al Cerro',
    icon: <Mountain className="w-3.5 h-3.5" />,
  },
  {
    id: 'balnearios',
    label: 'Balnearios & Ríos',
    icon: <Waves className="w-3.5 h-3.5" />,
  },
  {
    id: 'rocas',
    label: 'Paseos & Rocas',
    icon: <Compass className="w-3.5 h-3.5" />,
  },
  {
    id: 'patrimonio',
    label: 'Casco Histórico',
    icon: <Landmark className="w-3.5 h-3.5" />,
  },
];

export const InteractiveMapContainer: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
  const [tileStyle, setTileStyle] = useState<TileStyle>('esri');
  const [showLegend, setShowLegend] = useState(true);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const filteredPlaces = useMemo(() => {
    if (filter === 'all') return MOCK_PLACES;
    if (filter === 'alojamientos') {
      return MOCK_PLACES.filter((p) => p.type === 'accommodation');
    }
    if (filter === 'senderos') {
      return MOCK_PLACES.filter(
        (p) =>
          p.id === 'att-1' ||
          p.category.toLowerCase().includes('trekking') ||
          p.category.toLowerCase().includes('cumbre')
      );
    }
    if (filter === 'balnearios') {
      return MOCK_PLACES.filter(
        (p) =>
          p.id === 'att-4' ||
          p.id === 'att-5' ||
          p.category.toLowerCase().includes('balneario') ||
          p.category.toLowerCase().includes('dique')
      );
    }
    if (filter === 'rocas') {
      return MOCK_PLACES.filter(
        (p) =>
          p.id === 'att-2' ||
          p.id === 'att-3' ||
          p.id === 'att-7' ||
          p.category.toLowerCase().includes('rocosas') ||
          p.category.toLowerCase().includes('geoforma')
      );
    }
    if (filter === 'patrimonio') {
      return MOCK_PLACES.filter(
        (p) =>
          p.id === 'att-8' ||
          p.id === 'acc-2' ||
          p.id === 'acc-4' ||
          p.category.toLowerCase().includes('histórico') ||
          p.category.toLowerCase().includes('casona')
      );
    }
    return MOCK_PLACES;
  }, [filter]);

  const { containerRef, isLoaded } = useLeafletMap({
    places: filteredPlaces,
    selectedPlace,
    onSelectPlace: setSelectedPlace,
    tileStyle,
  });

  return (
    <div className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] rounded-3xl overflow-hidden border border-sand-300/80 shadow-2xl shadow-sand-900/10 bg-[#f4ede2]">
      {/* Contenedor del Mapa Leaflet */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Spinner de Carga Inicial */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-sand-50/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
          <div className="w-8 h-8 rounded-full border-3 border-primary-500 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-sand-700">Cargando topografía serrana...</span>
        </div>
      )}

      {/* FILTROS SUPERIORES FLOTANTES (Barra de Píldoras con Scroll Horizontal Suave) */}
      <div className="absolute top-4 left-4 right-4 sm:right-auto z-20 flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-2 pointer-events-auto">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-stone-200/90 shadow-lg">
          {FILTERS.map((item) => {
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#0c261a] text-white shadow-md shadow-[#0c261a]/25'
                    : 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/90'
                }`}
              >
                <span className={isActive ? 'text-primary-300' : 'text-stone-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTOR DE CAPA TOPOGRÁFICA / EDITORIAL (Esquina Superior Derecha) */}
      <div className="hidden sm:block absolute top-4 right-4 z-20 pointer-events-auto">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white backdrop-blur-md border border-stone-200/90 shadow-lg text-xs font-bold text-stone-800 flex items-center gap-2 transition-colors cursor-pointer select-none"
          >
            <Layers className="w-4 h-4 text-primary-600" />
            <span>
              {tileStyle === 'opentopo'
                ? 'Relieve Topográfico'
                : tileStyle === 'esri'
                ? 'Esri Topográfico'
                : 'Editorial Limpio'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-stone-200 p-1.5 space-y-1 z-30">
              <button
                type="button"
                onClick={() => {
                  setTileStyle('opentopo');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex flex-col transition-colors cursor-pointer ${
                  tileStyle === 'opentopo'
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Relieve Topográfico (SRTM)</span>
                <span className="text-[10px] font-normal text-stone-500">Curvas de nivel y sombreado</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTileStyle('esri');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex flex-col transition-colors cursor-pointer ${
                  tileStyle === 'esri'
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Esri World Topo</span>
                <span className="text-[10px] font-normal text-stone-500">Relieve suave y ríos</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTileStyle('voyager');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex flex-col transition-colors cursor-pointer ${
                  tileStyle === 'voyager'
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span>Editorial Carto</span>
                <span className="text-[10px] font-normal text-stone-500">Calles y manzanas urbanas</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CARD FLOTANTE DE VISTA PREVIA (Esquina Inferior Izquierda, preservando marcadores y popover) */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 max-w-[92vw] sm:max-w-sm pointer-events-auto">
          <MapCardPreview place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        </div>
      )}

      {/* LEYENDA TOPOGRÁFICA FLOTANTE (Esquina Inferior Derecha, basada en la referencia del usuario) */}
      <div className="hidden md:block absolute bottom-6 right-6 z-20 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-xl p-3.5 w-60 text-stone-800">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-stone-900 font-display">
                Leyenda Topográfica
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowLegend(!showLegend)}
              className="text-[10px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              {showLegend ? 'Ocultar' : 'Ver'}
            </button>
          </div>

          {showLegend && (
            <div className="space-y-2.5 text-[11px]">
              {/* Gradiente de Elevación */}
              <div>
                <div className="flex items-center justify-between text-[10px] text-stone-600 font-bold mb-1">
                  <span>1.979 m (Cumbre)</span>
                  <span>950 m (Valle)</span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-[#b3542a] via-[#859c47] to-[#e6d8be] shadow-inner" />
              </div>

              {/* Items de la Leyenda */}
              <div className="space-y-1.5 pt-1 text-stone-600 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-t border-dashed border-terracotta-700"></div>
                  <span>Senderos & Huellas serranas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-stone-400"></div>
                  <span>Curvas de nivel (cada 20 m)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3a7bd5]"></div>
                  <span>Río Calabalumba & Dique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e06d39]"></div>
                  <span>Alojamientos habilitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#5c7e30]"></div>
                  <span>Paseos & Atractivos naturales</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};