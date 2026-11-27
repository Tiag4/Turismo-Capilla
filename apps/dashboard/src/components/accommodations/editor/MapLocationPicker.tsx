import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';

export interface MapLocationPickerProps {
  latitude: number;
  longitude: number;
  address?: string;
  onLocationChange: (lat: number, lng: number, suggestedAddress?: string) => void;
}

const DEFAULT_CENTER = { lat: -30.8654, lng: -64.5241 }; // Capilla del Monte centro

const createTerracottaMarker = () =>
  L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="transform: translate(-50%, -100%); cursor: grab;">
        <div style="background-color: #e06d39; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid white;">
          <div style="transform: rotate(45deg); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
  });

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  latitude,
  longitude,
  address,
  onLocationChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const currentLat = !isNaN(latitude) && latitude !== 0 ? latitude : DEFAULT_CENTER.lat;
  const currentLng = !isNaN(longitude) && longitude !== 0 ? longitude : DEFAULT_CENTER.lng;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [currentLat, currentLng],
      zoom: 14,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([currentLat, currentLng], {
      icon: createTerracottaMarker(),
      draggable: true,
    }).addTo(map);

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      const cleanLat = Number(position.lat.toFixed(6));
      const cleanLng = Number(position.lng.toFixed(6));
      onLocationChange(cleanLat, cleanLng);
    });

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      const cleanLat = Number(lat.toFixed(6));
      const cleanLng = Number(lng.toFixed(6));
      marker.setLatLng([cleanLat, cleanLng]);
      onLocationChange(cleanLat, cleanLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position if external coordinates change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - currentLat) > 0.0001 ||
        Math.abs(currentPos.lng - currentLng) > 0.0001
      ) {
        markerRef.current.setLatLng([currentLat, currentLng]);
        mapInstanceRef.current.panTo([currentLat, currentLng]);
      }
    }
  }, [currentLat, currentLng]);

  // Geocoding with OpenStreetMap Nominatim
  const handleSearchAddress = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const query = searchQuery.trim() || address?.trim();
      if (!query) return;

      setIsSearching(true);
      setSearchFeedback(null);

      try {
        const fullQuery = `${query}, Capilla del Monte, Córdoba, Argentina`;
        const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullQuery
        )}&limit=1`;

        const res = await fetch(endpoint, {
          headers: {
            Accept: 'application/json',
          },
        });

        const data = await res.json();
        if (data && data.length > 0) {
          const lat = Number(parseFloat(data[0].lat).toFixed(6));
          const lng = Number(parseFloat(data[0].lon).toFixed(6));
          const displayName = data[0].display_name;

          if (mapInstanceRef.current && markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            mapInstanceRef.current.setView([lat, lng], 16);
          }

          onLocationChange(lat, lng, displayName);
          setSearchFeedback(`Ubicación encontrada: ${data[0].name || query}`);
        } else {
          setSearchFeedback('No se encontraron coordenadas precisas en Capilla del Monte.');
        }
      } catch (err) {
        setSearchFeedback('Error al consultar el servicio de geocodificación.');
      } finally {
        setIsSearching(false);
      }
    },
    [searchQuery, address, onLocationChange]
  );

  const handleResetToCenter = () => {
    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]);
      mapInstanceRef.current.setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 14);
    }
    onLocationChange(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search Bar & Center Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <form onSubmit={handleSearchAddress} className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[var(--color-sand-400)] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar calle o paraje en Capilla del Monte..."
            className="w-full pl-9 pr-24 py-2 text-xs rounded-xl border border-[var(--color-sand-300)] bg-white text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-terracotta-500)]"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1 px-3 py-1 bg-[var(--color-sand-100)] hover:bg-[var(--color-sand-200)] text-[var(--color-sand-900)] text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ubicar'}
          </button>
        </form>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleResetToCenter}
          className="text-xs shrink-0"
        >
          <Navigation className="w-3.5 h-3.5 text-[var(--color-sand-600)]" />
          <span>Centro de Capilla</span>
        </Button>
      </div>

      {searchFeedback && (
        <span className="text-[11px] text-[var(--color-sand-600)]">{searchFeedback}</span>
      )}

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--color-sand-300)] shadow-xs">
        <div ref={mapContainerRef} className="h-64 w-full z-0" />
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-medium text-[var(--color-sand-800)] border border-[var(--color-sand-200)] shadow-xs flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[var(--color-terracotta-500)]" />
          <span>Hacé clic o arrastrá el marcador para definir la posición exacta</span>
        </div>
      </div>
    </div>
  );
};
