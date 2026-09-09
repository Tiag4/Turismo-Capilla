import React from 'react';
import type { AttractionItem } from '../types';
import { AttractionHeroBento } from './components/AttractionHeroBento';
import { AttractionTelemetryBar } from './components/AttractionTelemetryBar';
import { AttractionSafetyProtocol } from './components/AttractionSafetyProtocol';
import { AttractionGearChecklist } from './components/AttractionGearChecklist';
import { AttractionLocationCard } from './components/AttractionLocationCard';
import { NearbyAccommodationsCard } from './components/NearbyAccommodationsCard';
import { TrekkingMonitorContainer } from '../../trekking/TrekkingMonitorContainer';

interface AttractionDetailContainerProps {
  item: AttractionItem;
}

export const AttractionDetailContainer: React.FC<AttractionDetailContainerProps> = ({ item }) => {
  return (
    <div className="space-y-8">
      {/* Portada Bento Principal y Cabecera */}
      <AttractionHeroBento item={item} />

      {/* Disposición a Dos Columnas (Desktop: 2 cols / Mobile: 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Descripción, Altimetría Interactiva, Protocolo y Equipo */}
        <div className="lg:col-span-8 space-y-8">
          {/* Descripción General y Destacados */}
          <section className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-sand-950 mb-3">
                Acerca de este atractivo
              </h2>
              <p className="text-sand-700 leading-relaxed text-base">
                {item.overview}
              </p>
            </div>

            {item.highlights && item.highlights.length > 0 && (
              <div className="pt-4 border-t border-sand-100 space-y-3">
                <h3 className="font-display font-bold text-base text-sand-900">
                  Puntos destacados del recorrido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {item.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-2 shrink-0"></span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Monitor Altimétrico Interactivo para Senderos de Trekking */}
          {item.isTrekking && (
            <section className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="border-b border-sand-100 pb-4">
                <h2 className="font-display font-bold text-2xl text-sand-950">
                  Perfil Altimétrico & Telemetría en Vivo
                </h2>
                <p className="text-xs sm:text-sm text-sand-600">
                  Ajustá tu ritmo estimado y hacé clic sobre el trazado o las postas para consultar tiempos, pendiente y recomendaciones de cada tramo.
                </p>
              </div>
              <TrekkingMonitorContainer />
            </section>
          )}

          {/* Protocolo de Seguridad y Guardaparques */}
          <AttractionSafetyProtocol info={item.practicalInfo} />

          {/* Checklist de Equipamiento y Mochila */}
          <AttractionGearChecklist recommendedGear={item.practicalInfo.recommendedGear} />
        </div>

        {/* Columna Derecha Lateral: Ficha Técnica, Ubicación y Alojamientos */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AttractionTelemetryBar specs={item.trailSpecs} />
          <AttractionLocationCard item={item} />
          <NearbyAccommodationsCard />

          <div className="text-center pt-2">
            <a
              href="/atractivos"
              className="inline-flex items-center gap-2 text-xs font-bold text-sand-600 hover:text-sand-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Volver al catálogo de senderos</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
