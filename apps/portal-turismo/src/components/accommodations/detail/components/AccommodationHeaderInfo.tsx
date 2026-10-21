import React from 'react';
import { Star, MapPin, ShieldCheck, ArrowLeft, Coffee, UtensilsCrossed } from 'lucide-react';
import type { AccommodationDetailData } from '../types';
import { AccommodationShareMenu } from './AccommodationShareMenu';

interface AccommodationHeaderInfoProps {
  data: AccommodationDetailData;
}

export const AccommodationHeaderInfo: React.FC<AccommodationHeaderInfoProps> = ({ data }) => {
  const hasBreakfast = Boolean(
    data.hasBreakfast ||
    data.amenities?.some((a) => a.toLowerCase().includes('desayuno')) ||
    data.roomTypes?.some((r) => r.breakfastIncluded)
  );

  return (
    <header className="space-y-4 pb-2">
      {/* Navegación Breadcrumb Superior y Botón de Compartir */}
      <div className="flex items-center justify-between">
        <a
          href="/alojamientos"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </a>

        <AccommodationShareMenu data={data} />
      </div>

      {/* Título Principal */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="font-display font-black text-2xl sm:text-4xl text-stone-900 tracking-tight">
            {data.title}
          </h1>
          {data.verified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0c261a] text-white text-[11px] font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
              <span>Prestador Oficial</span>
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-stone-600 font-medium">
          {data.subtitle}
        </p>
      </div>

      {/* Indicador de Desayuno (HU-19) */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {hasBreakfast ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#005530] text-white text-xs font-bold shadow-xs">
            <Coffee className="w-4 h-4 text-white" />
            <span>Tarifa con Desayuno Incluido</span>
            <span className="text-[10px] font-normal opacity-90">(Serrano artesanal)</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-medium shadow-xs">
            <UtensilsCrossed className="w-3.5 h-3.5 text-stone-300" />
            <span>Sin Desayuno</span>
            <span className="text-[10px] text-stone-300">(Cocina y asador equipados)</span>
          </div>
        )}
      </div>

      {/* Métricas y Datos Clave */}
      <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-stone-200/80">
        <div className="flex items-center gap-1 text-amber-600 font-bold">
          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span className="text-stone-900 font-black">{data.rating.toFixed(1)}</span>
          <span className="text-stone-500 font-normal">({data.reviewCount} opiniones verificadas)</span>
        </div>

        <div className="flex items-center gap-1 text-stone-600">
          <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
          <span>{data.address}, {data.zone} — Capilla del Monte</span>
        </div>

        <span className="text-stone-400 hidden sm:inline">•</span>

        <span className="font-bold text-stone-700">
          Capacidad: <strong className="text-stone-900">{data.capacity}</strong>
        </span>
      </div>
    </header>
  );
};
