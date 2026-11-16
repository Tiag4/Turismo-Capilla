import React, { useState } from 'react';
import { Compass, CheckCircle, Clock, MapPin } from 'lucide-react';
import { ORIGINS_DATA } from './data/mobilityData';
import type { OriginId, RouteOption } from './types/mobility.types';
import { TollAlertCard } from './TollAlertCard';

export const RouteOriginsTabs: React.FC = () => {
  const [activeOriginId, setActiveOriginId] = useState<OriginId>('cordoba');

  const currentCategory = ORIGINS_DATA.find((c) => c.id === activeOriginId) ?? ORIGINS_DATA[0];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-sand-900 flex items-center gap-2">
          <Compass className="w-5 h-5 text-terracotta-600" />
          <span>Rutas por Punto de Origen</span>
        </h2>
        <p className="text-sm text-sand-600">
          Seleccioná tu procedencia para ver los trazados recomendados, distancias y puestos de peaje hacia Capilla del Monte.
        </p>
      </div>

      {/* Selector de Pestañas / Procedencias */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-sand-200/60 rounded-2xl border border-sand-300/60">
        {ORIGINS_DATA.map((cat) => {
          const isActive = cat.id === activeOriginId;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveOriginId(cat.id)}
              className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                isActive
                  ? 'bg-white text-sand-900 shadow-sm border border-sand-300'
                  : 'text-sand-700 hover:text-sand-900 hover:bg-white/50'
              }`}
            >
              <span className="block truncate">{cat.label}</span>
              <span className="block text-[11px] font-normal text-sand-500 mt-0.5">{cat.badge}</span>
            </button>
          );
        })}
      </div>

      {/* Resumen de la Procedencia */}
      <p className="text-xs sm:text-sm text-sand-600 bg-sand-100/70 p-3 rounded-xl border border-sand-200">
        {currentCategory.summary}
      </p>

      {/* Opciones de Rutas Disponibles */}
      <div className="space-y-6">
        {currentCategory.routes.map((route: RouteOption) => (
          <div
            key={route.id}
            className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-xs transition-all space-y-5 ${
              route.recommended
                ? 'border-terracotta-300 ring-2 ring-terracotta-500/10'
                : 'border-sand-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-sand-900">
                    {route.name}
                  </h3>
                  {route.recommended && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-uritorco-100 text-uritorco-800 border border-uritorco-200">
                      Recomendado
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-sand-100 text-sand-700 border border-sand-200">
                    {route.scenicQuality}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-sand-600 leading-relaxed">
                  {route.description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-sand-50 px-4 py-2 rounded-2xl border border-sand-200">
                <div className="text-right">
                  <span className="block text-xs text-sand-500">Distancia / Tiempo</span>
                  <span className="text-sm font-extrabold text-sand-900 font-display">
                    {route.distanceKm} km · {route.estimatedTime}
                  </span>
                </div>
                <Clock className="w-5 h-5 text-terracotta-600" />
              </div>
            </div>

            {/* Trazado y Carreteras */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-bold text-sand-700 flex items-center gap-1 mr-1">
                <MapPin className="w-3.5 h-3.5 text-sand-500" /> Vías:
              </span>
              {route.roads.map((road, rIdx) => (
                <span key={rIdx} className="px-2.5 py-1 rounded-lg bg-sand-100 text-sand-800 text-xs font-semibold">
                  {road}
                </span>
              ))}
            </div>

            {/* Puntos Destacados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-sand-700">
              {route.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-uritorco-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Desglose de Peajes de la Ruta */}
            <TollAlertCard tolls={route.tolls} precautions={route.precautions} />
          </div>
        ))}
      </div>
    </section>
  );
};
