import React from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationLeftColProps {
  data: AccommodationDetailData;
  averageRating?: number;
  totalReviews?: number;
}

export const AccommodationLeftCol: React.FC<AccommodationLeftColProps> = ({
  data,
  averageRating,
  totalReviews,
}) => {
  const displayRating = (averageRating ?? data.rating ?? 4.9).toFixed(1);
  const displayCount = totalReviews ?? data.reviewCount ?? 20;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <a
          href="#opiniones-huespedes"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-extrabold transition-colors"
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{displayRating}</span>
          <span className="text-stone-300 font-medium">({displayCount} reseñas)</span>
        </a>

        {data.verified && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-uritorco-600 text-white text-xs font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Verificado</span>
          </span>
        )}
      </div>

      <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-900 tracking-tight leading-tight">
        {data.title}
      </h1>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
        <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
        <span>{data.address} · {data.zone || 'Capilla del Monte'}</span>
      </div>

      {/* Párrafo descriptivo fiel a la captura */}
      <p className="text-sm text-stone-600 leading-relaxed font-normal pt-1">
        {data.fullDescription?.[0] ?? `${data.title} es un alojamiento serrano habilitado en Capilla del Monte, Córdoba.`}
      </p>
    </div>
  );
};

export interface AccommodationDescriptionProps {
  description?: string[];
}

export const AccommodationDescription: React.FC<AccommodationDescriptionProps> = ({ description }) => {
  return (
    <div className="space-y-3 pt-6 border-t border-stone-200">
      <h2 className="font-display font-bold text-lg text-stone-900">Sobre este hospedaje</h2>
      {description?.map((para, i) => (
        <p key={i} className="text-sm text-stone-600 leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
};

