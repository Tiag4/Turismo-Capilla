import { useEffect, useRef, useState } from 'react';
import type { MapPlace } from '../../../data/mock-places';

export type TileStyle = 'opentopo' | 'esri' | 'voyager';

interface TileConfig {
  url: string;
  options: {
    attribution: string;
    subdomains?: string;
    maxZoom?: number;
    maxNativeZoom?: number;
  };
}

const TILE_STYLES: Record<TileStyle, TileConfig> = {
  opentopo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: {
      attribution:
        '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>), &copy; OpenStreetMap',
      subdomains: 'abc',
      maxNativeZoom: 17,
      maxZoom: 19,
    },
  },
  esri: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, USGS, NPS',
      maxZoom: 19,
    },
  },
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: {
      attribution: '&copy; CARTO & OpenStreetMap contributors',
      subdomains: 'abcd',
      maxZoom: 19,
    },
  },
};

interface UseLeafletMapOptions {
  places: MapPlace[];
  selectedPlace: MapPlace | null;
  onSelectPlace: (place: MapPlace) => void;
  tileStyle?: TileStyle;
}

export function useLeafletMap({
  places,
  selectedPlace,
  onSelectPlace,
  tileStyle = 'opentopo',
}: UseLeafletMapOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;

      // Si ya existe el mapa, no recrear
      if (mapInstanceRef.current) return;

      // Centro geográfico de Capilla del Monte (Valle del Uritorco)
      const map = L.map(containerRef.current, {
        center: [-30.8585, -64.5245],
        zoom: 14.5,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Capa base topográfica con curvas de nivel y relieve
      const styleConfig = TILE_STYLES[tileStyle] || TILE_STYLES.opentopo;
      const tileLayer = L.tileLayer(styleConfig.url, styleConfig.options).addTo(map);
      tileLayerRef.current = tileLayer;

      mapInstanceRef.current = map;
      setIsLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cambiar capa de mosaicos si el usuario alterna entre estilos
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    import('leaflet').then(({ default: L }) => {
      const map = mapInstanceRef.current;
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
      const styleConfig = TILE_STYLES[tileStyle] || TILE_STYLES.opentopo;
      const newLayer = L.tileLayer(styleConfig.url, styleConfig.options).addTo(map);
      if (newLayer.bringToBack) {
        newLayer.bringToBack();
      }
      tileLayerRef.current = newLayer;
    });
  }, [isLoaded, tileStyle]);

  // Actualizar marcadores cuando cambian los lugares o el mapa está listo
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current) return;

    import('leaflet').then(({ default: L }) => {
      const map = mapInstanceRef.current;

      // Limpiar marcadores anteriores
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      places.forEach((place) => {
        const isAccommodation = place.type === 'accommodation';
        const isSelected = selectedPlace?.id === place.id;

        // Custom HTML DivIcon con Tailwind libre de overflow y sin emojis (SSOT oficial)
        const iconHtml = isAccommodation
          ? `
            <div class="relative inline-flex flex-col items-center cursor-pointer transition-transform duration-200 ${
              isSelected ? 'scale-125 z-50' : 'hover:scale-110'
            } select-none">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e06d39] text-white shadow-md border-2 ${
                isSelected ? 'border-white ring-4 ring-[#e06d39]/40' : 'border-white'
              } font-sans text-[11px] font-bold whitespace-nowrap">
                <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                <span>$${((place.pricePerNight ?? 0) / 1000).toFixed(0)}k</span>
              </div>
              <div class="w-2 h-2 bg-[#e06d39] rotate-45 -mt-1 border-r border-b border-white"></div>
            </div>
          `
          : `
            <div class="relative inline-flex flex-col items-center cursor-pointer transition-transform duration-200 ${
              isSelected ? 'scale-125 z-50' : 'hover:scale-110'
            } select-none">
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5c7e30] text-white shadow-md border-2 ${
                isSelected ? 'border-white ring-4 ring-[#5c7e30]/40' : 'border-white'
              } font-sans text-[11px] font-bold whitespace-nowrap">
                <svg class="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                <span>${place.title.split(' ')[0]}</span>
              </div>
              <div class="w-2 h-2 bg-[#5c7e30] rotate-45 -mt-1 border-r border-b border-white"></div>
            </div>
          `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker',
          iconSize: undefined,
          iconAnchor: [34, 26],
        });

        const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          onSelectPlace(place);
          map.flyTo([place.lat, place.lng], 14, { duration: 0.8 });
        });

        markersRef.current.push(marker);
      });
    });
  }, [isLoaded, places, selectedPlace, onSelectPlace]);

  // Centrar en el lugar seleccionado si cambia externamente
  useEffect(() => {
    if (selectedPlace && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 14, { duration: 0.8 });
    }
  }, [selectedPlace]);

  return { containerRef, isLoaded };
}