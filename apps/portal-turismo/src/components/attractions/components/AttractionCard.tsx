import React from 'react';
import type { AttractionItem } from '../types';

interface AttractionCardProps {
  item: AttractionItem;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ item }) => {
  const getDifficultyColor = (diff: AttractionItem['difficulty']) => {
    switch (diff) {
      case 'Alta':
        return 'text-terracotta-600';
      case 'Media':
        return 'text-amber-700';
      case 'Baja':
        return 'text-uritorco-700';
      default:
        return 'text-sand-700';
    }
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-xs hover:border-sand-400 hover:shadow-md transition-all duration-200">
      {/* Portada Limpia sin Píldoras Translúcidas Encimadas */}
      <a href={item.ctaUrl} className="relative aspect-16/10 overflow-hidden bg-sand-200 block">
        <img
          src={item.coverImage}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </a>

      {/* Contenido Editorial de la Ficha */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadatos Superiores: Categoría, Distancia, Dificultad Resaltada y Calificación */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sand-800 uppercase tracking-wider text-[11px]">
                {item.categoryLabel} · {item.distanceFromCenter}
              </span>
              {item.isTrekking && item.difficulty && (
                <>
                  <span className="text-sand-400 font-bold">·</span>
                  <span className={`font-extrabold uppercase tracking-wider text-[11px] ${getDifficultyColor(item.difficulty)}`}>
                    Dificultad {item.difficulty}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 font-bold text-sand-900">
              <svg className="w-3.5 h-3.5 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{item.rating}</span>
              <span className="text-sand-400 font-normal">({item.reviewCount})</span>
            </div>
          </div>

          <h2 className="font-display font-black text-xl text-sand-950 leading-snug group-hover:text-terracotta-600 transition-colors">
            <a href={item.ctaUrl} className="focus:outline-none">
              {item.title}
            </a>
          </h2>

          <p className="text-sand-600 text-sm line-clamp-2 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Telemetría Clave con Alto Contraste Tipográfico (Sin cajas grises deslavadas) */}
        <div className="pt-3 border-t border-sand-100 grid grid-cols-2 gap-3 text-xs">
          {item.isTrekking ? (
            <>
              <div>
                <span className="text-sand-600 block text-[10px] font-bold uppercase tracking-wider">
                  Desnivel Positivo
                </span>
                <span className="font-black text-sand-900 text-sm">
                  {item.trailSpecs?.elevationGainMeters ? `+${item.trailSpecs.elevationGainMeters} m` : 'Moderado'}
                </span>
              </div>
              <div>
                <span className="text-sand-600 block text-[10px] font-bold uppercase tracking-wider">
                  Cota Máxima
                </span>
                <span className="font-black text-sand-900 text-sm">
                  {item.trailSpecs?.maxElevationMsnm ? `${item.trailSpecs.maxElevationMsnm} msnm` : '1.000 m'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div>
                <span className="text-sand-600 block text-[10px] font-bold uppercase tracking-wider">
                  Tiempo Sugerido
                </span>
                <span className="font-black text-sand-900 text-sm">
                  {item.trailSpecs?.estimatedDuration ?? 'Paseo libre'}
                </span>
              </div>
              <div>
                <span className="text-sand-600 block text-[10px] font-bold uppercase tracking-wider">
                  Modalidad
                </span>
                <span className="font-black text-sand-900 text-sm">
                  {item.trailSpecs?.trailType ?? 'Circuito libre'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Botón CTA Sólido de Alto Contraste */}
        <div className="pt-1">
          <a
            href={item.ctaUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-sand-900 text-white hover:bg-terracotta-600 transition-colors"
          >
            <span>Ver ficha técnica y detalles</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};
