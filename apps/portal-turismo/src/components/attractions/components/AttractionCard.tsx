import React from 'react';
import type { AttractionItem } from '../types';

interface AttractionCardProps {
  item: AttractionItem;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ item }) => {
  const getDifficultyBadge = (diff: AttractionItem['difficulty']) => {
    switch (diff) {
      case 'Alta':
        return 'bg-terracotta-600 text-white';
      case 'Media':
        return 'bg-amber-600 text-white';
      case 'Baja':
        return 'bg-uritorco-600 text-white';
      default:
        return 'bg-sand-700 text-white';
    }
  };

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-sand-300 transition-all duration-200">
      {/* Portada con Badge de Dificultad y Distancia */}
      <div className="relative aspect-16/10 overflow-hidden bg-sand-200">
        <img
          src={item.coverImage}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badges superiores */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${getDifficultyBadge(
              item.difficulty,
            )}`}
          >
            Dificultad {item.difficulty}
          </span>
          {item.isTrekking && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sand-900/90 text-sand-100 backdrop-blur-xs">
              Altimetría interactiva
            </span>
          )}
        </div>

        {/* Info inferior sobre imagen */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
          <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            <svg className="w-3.5 h-3.5 text-sand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {item.trailSpecs?.estimatedDuration ?? 'Paseo libre'}
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-lg">
            A {item.distanceFromCenter} del centro
          </span>
        </div>
      </div>

      {/* Contenido de la Ficha */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-uritorco-700 uppercase tracking-wider">
              {item.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-sand-800">
              <svg className="w-4 h-4 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>{item.rating}</span>
              <span className="text-sand-400">({item.reviewCount})</span>
            </div>
          </div>

          <h2 className="font-display font-bold text-xl text-sand-900 leading-snug group-hover:text-terracotta-600 transition-colors">
            <a href={item.ctaUrl} className="focus:outline-none">
              {item.title}
            </a>
          </h2>

          <p className="text-sand-600 text-sm line-clamp-2 leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Telemetría Clave en Miniatura */}
        {item.trailSpecs && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sand-100 text-xs text-sand-700">
            <div>
              <span className="text-sand-400 block text-[10px] uppercase font-semibold">Desnivel positivo</span>
              <span className="font-bold text-sand-900">
                {item.trailSpecs.elevationGainMeters ? `+${item.trailSpecs.elevationGainMeters} m` : 'Bajo / llano'}
              </span>
            </div>
            <div>
              <span className="text-sand-400 block text-[10px] uppercase font-semibold">Cota máxima</span>
              <span className="font-bold text-sand-900">
                {item.trailSpecs.maxElevationMsnm ? `${item.trailSpecs.maxElevationMsnm} msnm` : '1.000 msnm'}
              </span>
            </div>
          </div>
        )}

        {/* CTA Directo a la Ficha Técnica */}
        <div className="pt-2">
          <a
            href={item.ctaUrl}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-sand-100 hover:bg-terracotta-600 hover:text-white text-sand-800 transition-colors cursor-pointer"
          >
            <span>Ver sendero y ficha técnica</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};
