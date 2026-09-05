import { useEffect, useRef, useState } from 'react';
import type { MapPlace } from '../../../data/mock-places';

// Importación condicional de tipos de Leaflet
type LeafletModule = typeof import('leaflet');

interface UseLeafletMapOptions {
  places: MapPlace[];
  selectedPlace: MapPlace | null;
  onSelectPlace: (place: MapPlace) => void;
}

export function useLeafletMap({ places, selectedPlace, onSelectPlace }: UseLeafletMapOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
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
        center: [-30.858, -64.522],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false, // Evita atrapar el scroll de la página
      });

      // CartoDB Voyager — Paleta limpia y cálida tipo editorial
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

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

        // Custom HTML DivIcon con Tailwind
        const iconHtml = isAccommodation
          ? `
            <div class="relative group cursor-pointer transition-transform duration-200 ${
              isSelected ? 'scale-125 z-50' : 'hover:scale-110'
            }">
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e06d39] text-white shadow-lg shadow-[#e06d39]/40 border-2 ${
                isSelected ? 'border-white ring-4 ring-[#e06d39]/30' : 'border-white'
              } font-sans text-xs font-bold whitespace-nowrap">
                <span>🏡</span>
                <span>$${((place.pricePerNight ?? 0) / 1000).toFixed(0)}k</span>
              </div>
              <div class="w-2 h-2 bg-[#e06d39] rotate-45 mx-auto -mt-1 border-r border-b border-white"></div>
            </div>
          `
          : `
            <div class="relative group cursor-pointer transition-transform duration-200 ${
              isSelected ? 'scale-125 z-50' : 'hover:scale-110'
            }">
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#5c7e30] text-white shadow-lg shadow-[#5c7e30]/40 border-2 ${
                isSelected ? 'border-white ring-4 ring-[#5c7e30]/30' : 'border-white'
              } font-sans text-xs font-bold whitespace-nowrap">
                <span>⛰️</span>
                <span>${place.title.split(' ')[0]}</span>
              </div>
              <div class="w-2 h-2 bg-[#5c7e30] rotate-45 mx-auto -mt-1 border-r border-b border-white"></div>
            </div>
          `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-leaflet-marker',
          iconSize: [80, 36],
          iconAnchor: [40, 36],
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