import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { MOBILITY_MAP_POINTS } from './data/mobilityData';
import type { MobilityPoint } from './types/mobility.types';

export const MobilityInteractiveMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<MobilityPoint>(MOBILITY_MAP_POINTS[0]);

  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [-30.8601, -64.5262],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Valle de Punilla',
        maxZoom: 18,
      }).addTo(map);

      MOBILITY_MAP_POINTS.forEach((pt) => {
        const iconHtml = `
          <div style="background-color: ${pt.category === 'tren' ? '#059669' : pt.category === 'terminal' ? '#e06d39' : '#3b82f6'}; width: 34px; height: 34px; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.25); cursor: pointer; transform: translate(-50%, -50%);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        `;

        const customIcon = L.divIcon({
          className: 'custom-leaflet-marker',
          html: iconHtml,
          iconSize: [34, 34],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedPoint(pt);
          map.setView([pt.lat, pt.lng], 15, { animate: true });
        });
      });

      mapRef.current = map;
    }

    setupMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleSelectPoint = (pt: MobilityPoint) => {
    setSelectedPoint(pt);
    if (mapRef.current) {
      mapRef.current.setView([pt.lat, pt.lng], 15, { animate: true });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-sand-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-terracotta-600" />
            <span>Mapa Interactivo de Accesos & Puntos de Arribo</span>
          </h3>
          <p className="text-xs sm:text-sm text-sand-600">
            Hacé clic en los puntos clave para localizar la Estación de Tren, Terminal y accesos por ruta.
          </p>
        </div>
      </div>

      {/* Selector Rápido de Puntos */}
      <div className="flex flex-wrap gap-2">
        {MOBILITY_MAP_POINTS.map((pt) => {
          const isSelected = selectedPoint.id === pt.id;
          return (
            <button
              key={pt.id}
              onClick={() => handleSelectPoint(pt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-sand-900 text-white shadow-xs'
                  : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{pt.title}</span>
            </button>
          );
        })}
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-sand-200 shadow-inner relative">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Ficha del Punto Seleccionado */}
        <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-terracotta-100 text-terracotta-800">
              {selectedPoint.badgeText}
            </span>
            <h4 className="font-display font-bold text-lg text-sand-900">
              {selectedPoint.title}
            </h4>
            <p className="text-xs text-sand-700 leading-relaxed">
              {selectedPoint.description}
            </p>
            {selectedPoint.address && (
              <p className="text-xs font-medium text-sand-500 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>{selectedPoint.address}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-sand-200 text-xs text-sand-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>Coordenadas verificadas por la Comisión de Turismo.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
