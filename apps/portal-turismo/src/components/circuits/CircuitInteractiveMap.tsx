import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { MYSTIC_SPOTS, GASTRONOMIC_VENUES, ADVENTURE_ACTIVITIES } from './data/circuitsData';
import type { CircuitId } from './types/circuits.types';

interface CircuitInteractiveMapProps {
  activeCircuit: CircuitId;
}

interface MapMarkerItem {
  id: string;
  title: string;
  badge: string;
  lat: number;
  lng: number;
  description: string;
  address?: string;
  color: string;
}

export const CircuitInteractiveMap: React.FC<CircuitInteractiveMapProps> = ({ activeCircuit }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const mapItems: MapMarkerItem[] = React.useMemo(() => {
    if (activeCircuit === 'mistico') {
      return MYSTIC_SPOTS.map((s) => ({
        id: s.id,
        title: s.title,
        badge: s.badge,
        lat: s.coordinates.lat,
        lng: s.coordinates.lng,
        description: s.description,
        color: '#7e22ce' // purple
      }));
    }
    if (activeCircuit === 'sabores') {
      return GASTRONOMIC_VENUES.map((v) => ({
        id: v.id,
        title: v.name,
        badge: v.categoryLabel,
        lat: v.coordinates.lat,
        lng: v.coordinates.lng,
        description: v.specialty,
        address: v.address,
        color: '#d97706' // amber
      }));
    }
    return ADVENTURE_ACTIVITIES.map((a) => ({
      id: a.id,
      title: a.title,
      badge: a.modalityLabel,
      lat: a.coordinates.lat,
      lng: a.coordinates.lng,
      description: a.description,
      address: a.location,
      color: '#059669' // emerald
    }));
  }, [activeCircuit]);

  const [selectedItem, setSelectedItem] = useState<MapMarkerItem>(mapItems[0]);

  useEffect(() => {
    setSelectedItem(mapItems[0]);
  }, [mapItems]);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;
      if (!isMounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [-30.8585, -64.5245],
        zoom: 13,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Circuitos Temáticos',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      drawMarkers(L, map);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const drawMarkers = (L: any, map: any) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    mapItems.forEach((item) => {
      const iconHtml = `
        <div style="background-color: ${item.color}; width: 32px; height: 32px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); cursor: pointer; transform: translate(-50%, -50%);">
          <span style="font-size: 13px; font-weight: 800;">📍</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [32, 32],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);
      marker.bindTooltip(`<strong>${item.title}</strong><br/><span style="font-size:11px">${item.badge}</span>`, {
        direction: 'top',
        offset: [0, -16],
      });

      marker.on('click', () => {
        setSelectedItem(item);
        map.setView([item.lat, item.lng], 14, { animate: true });
      });

      markersRef.current.push(marker);
      bounds.extend([item.lat, item.lng]);
    });

    if (mapItems.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((mod) => {
      drawMarkers(mod.default, mapRef.current);
    });
  }, [mapItems]);

  const handleSelectItem = (item: MapMarkerItem) => {
    setSelectedItem(item);
    if (mapRef.current) {
      mapRef.current.setView([item.lat, item.lng], 14, { animate: true });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-sand-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-terracotta-600" />
            <span>Mapa del Circuito Seleccionado</span>
          </h3>
          <p className="text-xs sm:text-sm text-sand-600">
            Hacé clic en cualquier parada o punto para ver su ubicación en el relieve de las sierras.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {mapItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-sand-900 text-white border-sand-900 shadow-xs'
                  : 'bg-white text-sand-700 border-sand-200 hover:bg-sand-50'
              }`}
            >
              <Navigation className="w-3 h-3 text-terracotta-500" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-sand-200 shadow-inner relative">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span
              className="inline-block px-2.5 py-1 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: selectedItem?.color ?? '#e06d39' }}
            >
              {selectedItem?.badge}
            </span>
            <h4 className="font-display font-bold text-lg text-sand-900">
              {selectedItem?.title}
            </h4>
            <p className="text-xs text-sand-700 leading-relaxed">
              {selectedItem?.description}
            </p>
            {selectedItem?.address && (
              <p className="text-xs font-medium text-sand-600 flex items-center gap-1.5 pt-1 bg-white/70 p-2 rounded-lg border border-sand-200">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                <span>{selectedItem.address}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-sand-200 text-xs text-sand-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>Puntos auditados por la Secretaría de Turismo.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
