import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Mountain } from 'lucide-react';
import type { AttractionItem } from '../types';
import { api } from '../../../services/api';
import { ADVENTURE_ACTIVITIES, MYSTIC_SPOTS } from '../../circuits/data/circuitsData';
import type { AdventureActivity, CircuitSpot } from '../../circuits/types/circuits.types';
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
  const [linkedCircuits, setLinkedCircuits] = useState<
    { id: string; category: 'mistico' | 'aventura'; title: string; subtitle: string }[]
  >([]);

  useEffect(() => {
    let active = true;
    api.getCircuitsConfig().then((remote) => {
      if (!active) return;
      const mystic = (
        remote?.mysticSpots && remote.mysticSpots.length > 0 ? remote.mysticSpots : MYSTIC_SPOTS
      ) as CircuitSpot[];
      const adventure = (
        remote?.adventureActivities && remote.adventureActivities.length > 0
          ? remote.adventureActivities
          : ADVENTURE_ACTIVITIES
      ) as AdventureActivity[];

      const matchesId = (linkedId?: string, itemId?: string) =>
        linkedId === item.id || linkedId === item.slug || itemId === item.slug;

      const matched = [
        ...mystic
          .filter((s) => matchesId(s.linkedAttractionId, s.id))
          .map((s) => ({
            id: s.id,
            category: 'mistico' as const,
            title: s.title,
            subtitle: s.subtitle,
          })),
        ...adventure
          .filter((a) => matchesId(a.linkedAttractionId))
          .map((a) => ({
            id: a.id,
            category: 'aventura' as const,
            title: a.title,
            subtitle: `${a.modalityLabel} · ${a.location}`,
          })),
      ];

      setLinkedCircuits(matched);
    });
    return () => {
      active = false;
    };
  }, [item.id, item.slug]);

  return (
    <div className="space-y-8">
      {/* Portada Bento Principal y Cabecera */}
      <AttractionHeroBento item={item} />

      {/* Disposición a Dos Columnas (Desktop: 2 cols / Mobile: 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Descripción, Altimetría Interactiva, Protocolo y Equipo */}
        <div className="lg:col-span-8 space-y-6">
          {/* Descripción General y Destacados sin cajas rígidas */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display font-black text-2xl text-sand-950 mb-2">
                Acerca de este atractivo
              </h2>
              <p className="text-sand-700 leading-relaxed text-base">
                {item.overview}
              </p>
            </div>

            {item.highlights && item.highlights.length > 0 && (
              <div className="pt-4 border-t border-sand-200/80 space-y-3">
                <h3 className="font-display font-black text-sm uppercase tracking-wider text-sand-950">
                  Puntos destacados del recorrido
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {item.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-sand-700">
                      <span className="text-sand-400 font-bold shrink-0">—</span>
                      <span className="leading-snug">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Monitor Altimétrico Interactivo (solo Cerro Uritorco hasta parametrizar perfiles por sendero) */}
          {item.isTrekking &&
            (item.slug === 'cerro-uritorco' || item.title.toLowerCase().includes('uritorco')) && (
            <section className="space-y-6 pt-8 border-t border-sand-200/80">
              <div>
                <h2 className="font-display font-black text-2xl text-sand-950">
                  Perfil Altimétrico & Telemetría en Vivo
                </h2>
                <p className="text-xs sm:text-sm text-sand-600 mt-1 leading-relaxed">
                  Ajustá tu ritmo estimado y deslizá el cursor o tocá las postas para consultar tiempos, pendiente y recomendaciones de cada tramo.
                </p>
              </div>
              <TrekkingMonitorContainer />
            </section>
          )}

          {/* Protocolo de Seguridad & Recomendaciones Oficiales */}
          <AttractionSafetyProtocol info={item.practicalInfo} isTrekking={item.isTrekking} />

          {/* Checklist de Mochila solo para excursiones de montaña reales */}
          {item.isTrekking && (
            <AttractionGearChecklist recommendedGear={item.practicalInfo.recommendedGear} />
          )}

          {/* Circuitos Temáticos vinculados a este atractivo */}
          {linkedCircuits.length > 0 && (
            <section className="space-y-4 pt-8 border-t border-sand-200/80">
              <h2 className="font-display font-black text-2xl text-sand-950">
                Circuitos Temáticos vinculados
              </h2>
              <div className="divide-y divide-sand-200 border border-sand-200 rounded-2xl bg-white overflow-hidden">
                {linkedCircuits.map((circuit) => (
                  <Link
                    key={`${circuit.category}-${circuit.id}`}
                    to={`/circuitos/${circuit.category}/${circuit.id}`}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-sand-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {circuit.category === 'mistico' ? (
                        <Compass className="w-5 h-5 text-terracotta-600 shrink-0" />
                      ) : (
                        <Mountain className="w-5 h-5 text-uritorco-700 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-terracotta-700 block">
                          {circuit.category === 'mistico'
                            ? 'Circuito Místico & Energético'
                            : 'Turismo Alternativo & Aventura'}
                        </span>
                        <h3 className="font-display font-bold text-base text-sand-950 truncate">
                          {circuit.title}
                        </h3>
                        <p className="text-xs text-sand-600 truncate">{circuit.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-sand-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Columna Derecha Lateral: Ficha Técnica, Ubicación y Alojamientos */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <AttractionTelemetryBar specs={item.trailSpecs} isTrekking={item.isTrekking} />
          <AttractionLocationCard item={item} />
          <NearbyAccommodationsCard />

          <div className="text-center pt-2">
            <a
              href="/atractivos"
              className="inline-flex items-center gap-2 text-xs font-bold text-sand-700 hover:text-terracotta-600 transition-colors"
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
