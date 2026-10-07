import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Info, CreditCard, Train, Bus, Maximize2 } from 'lucide-react';
import { MOBILITY_MAP_POINTS } from './data/mobilityData';
import type { MobilityPoint } from './types/mobility.types';

type MapFilter = 'all' | 'capilla' | 'peajes';

export const MobilityInteractiveMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [filter, setFilter] = useState<MapFilter>('all');
  const [selectedPoint, setSelectedPoint] = useState<MobilityPoint>(MOBILITY_MAP_POINTS[0]);

  const filteredPoints = MOBILITY_MAP_POINTS.filter((pt) => {
    if (filter === 'capilla') return pt.category !== 'peaje';
    if (filter === 'peajes') return pt.category === 'peaje';
    return true;
  });

  useEffect(() => {
    let isMounted = true;

    async function setupMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !containerRef.current) return;

      // Centro geográfico para abarcar la región de Córdoba y accesos
      const map = L.map(containerRef.current, {
        center: [-31.2500, -64.2000],
        zoom: 9,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Valle de Punilla & Accesos',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
      renderMarkers(L, map);
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

  const renderMarkers = (L: any, map: any) => {
    // Limpiar marcadores anteriores
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    filteredPoints.forEach((pt) => {
      const isToll = pt.category === 'peaje';
      const bgColor = pt.category === 'tren' ? '#059669' : pt.category === 'terminal' ? '#e06d39' : isToll ? '#d97706' : '#2563eb';

      const iconHtml = `
        <div style="background-color: ${bgColor}; width: ${isToll ? '30px' : '34px'}; height: ${isToll ? '30px' : '34px'}; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: white; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); cursor: pointer; transform: translate(-50%, -50%);">
          <span style="font-size: ${isToll ? '12px' : '14px'}; font-weight: 800; line-height: 1;">${isToll ? '$' : '📍'}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon }).addTo(map);
      marker.bindTooltip(`<strong>${pt.title}</strong><br/><span style="font-size: 11px;">${pt.badgeText}</span>`, {
        direction: 'top',
        offset: [0, -18]
      });

      marker.on('click', () => {
        setSelectedPoint(pt);
        map.setView([pt.lat, pt.lng], isToll ? 13 : 15, { animate: true });
      });

      markersRef.current.push(marker);
      bounds.extend([pt.lat, pt.lng]);
    });

    if (filteredPoints.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: filter === 'capilla' ? 14 : 11 });
    }
  };

  // Re-renderizar marcadores al cambiar filtro
  useEffect(() => {
    if (!mapRef.current) return;
    import('leaflet').then((mod) => {
      renderMarkers(mod.default, mapRef.current);
    });
  }, [filter]);

  const handleSelectPoint = (pt: MobilityPoint) => {
    setSelectedPoint(pt);
    if (mapRef.current) {
      mapRef.current.setView([pt.lat, pt.lng], pt.category === 'peaje' ? 13 : 15, { animate: true });
    }
  };

  const handleResetView = async () => {
    if (!mapRef.current) return;
    const L = (await import('leaflet')).default;
    const bounds = L.latLngBounds(filteredPoints.map((p) => [p.lat, p.lng]));
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-200 pb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-sand-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-terracotta-600" />
            <span>Mapa Interactivo de Peajes, Estaciones & Accesos</span>
          </h3>
          <p className="text-xs sm:text-sm text-sand-600">
            Hacé clic en cualquier peaje o punto de arribo para conocer su ubicación exacta, tarifa y accesos recomendados.
          </p>
        </div>

        <button
          onClick={handleResetView}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sand-700 bg-sand-100 hover:bg-sand-200 px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Maximize2 className="w-3.5 h-3.5 text-terracotta-600" />
          <span>Ver todo el mapa</span>
        </button>
      </div>

      {/* Selector de Filtros de Capa */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 p-1 bg-sand-100 rounded-2xl border border-sand-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-white text-sand-900 shadow-xs' : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            Todos ({MOBILITY_MAP_POINTS.length})
          </button>
          <button
            onClick={() => setFilter('peajes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'peajes' ? 'bg-amber-500 text-white shadow-xs' : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span>Peajes de Ruta ({MOBILITY_MAP_POINTS.filter((p) => p.category === 'peaje').length})</span>
          </button>
          <button
            onClick={() => setFilter('capilla')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'capilla' ? 'bg-uritorco-600 text-white shadow-xs' : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Llegada a Capilla ({MOBILITY_MAP_POINTS.filter((p) => p.category !== 'peaje').length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-sand-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Peaje</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Tren</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 inline-block" /> Terminal</span>
        </div>
      </div>

      {/* Lista de Puntos para Click Rápido */}
      <div className="flex flex-wrap gap-2">
        {filteredPoints.map((pt) => {
          const isSelected = selectedPoint.id === pt.id;
          return (
            <button
              key={pt.id}
              onClick={() => handleSelectPoint(pt)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-sand-900 text-white border-sand-900 shadow-xs'
                  : 'bg-white text-sand-700 border-sand-200 hover:bg-sand-50'
              }`}
            >
              {pt.category === 'peaje' ? (
                <CreditCard className="w-3 h-3 text-amber-500" />
              ) : pt.category === 'tren' ? (
                <Train className="w-3 h-3 text-emerald-600" />
              ) : (
                <Bus className="w-3 h-3 text-terracotta-500" />
              )}
              <span>{pt.title}</span>
            </button>
          );
        })}
      </div>

      {/* Contenedor del Mapa Leaflet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[420px] sm:h-[460px] rounded-2xl overflow-hidden border border-sand-200 shadow-inner relative">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Ficha del Punto Seleccionado */}
        <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                selectedPoint.category === 'peaje'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-terracotta-100 text-terracotta-800'
              }`}>
                {selectedPoint.badgeText}
              </span>
              {selectedPoint.routeOrigin && (
                <span className="text-[11px] font-medium text-sand-500">
                  {selectedPoint.routeOrigin}
                </span>
              )}
            </div>

            <h4 className="font-display font-bold text-lg text-sand-900">
              {selectedPoint.title}
            </h4>
            <p className="text-xs text-sand-700 leading-relaxed">
              {selectedPoint.description}
            </p>
            {selectedPoint.address && (
              <p className="text-xs font-medium text-sand-600 flex items-center gap-1.5 pt-1 bg-white/70 p-2 rounded-lg border border-sand-200">
                <MapPin className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
                <span>{selectedPoint.address}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-sand-200 text-xs text-sand-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-terracotta-500 shrink-0" />
            <span>TelePASE nacional habilitado en todos los puestos troncales de la RAC.</span>
          </div>
        </div>
      </div>
    </section>
  );
};
