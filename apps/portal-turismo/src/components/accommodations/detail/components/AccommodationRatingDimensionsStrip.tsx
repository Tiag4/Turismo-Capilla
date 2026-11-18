import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  KeyRound,
  MessageSquare,
  MapPin,
  Tag,
} from 'lucide-react';
import type { ReviewStats } from '../hooks/useAccommodationReviews';

interface AccommodationRatingDimensionsStripProps {
  stats: ReviewStats;
  totalReviews: number;
  className?: string;
}

export const AccommodationRatingDimensionsStrip: React.FC<AccommodationRatingDimensionsStripProps> = ({
  stats,
  totalReviews,
  className = '',
}) => {
  const dimensions = [
    {
      label: 'Limpieza',
      score: (stats?.cleanlinessAverage ?? 5.0).toFixed(1).replace('.', ','),
      Icon: Sparkles,
    },
    {
      label: 'Veracidad',
      score: (stats?.accuracyAverage ?? 5.0).toFixed(1).replace('.', ','),
      Icon: ShieldCheck,
    },
    {
      label: 'Check-in',
      score: (stats?.checkInAverage ?? 5.0).toFixed(1).replace('.', ','),
      Icon: KeyRound,
    },
    {
      label: 'Comunicación',
      score: (stats?.hostAverage ?? 5.0).toFixed(1).replace('.', ','),
      Icon: MessageSquare,
    },
    {
      label: 'Ubicación',
      score: (stats?.locationAverage ?? 5.0).toFixed(1).replace('.', ','),
      Icon: MapPin,
    },
    {
      label: 'Precio según calidad',
      score: (stats?.valueAverage ?? 4.8).toFixed(1).replace('.', ','),
      Icon: Tag,
    },
  ];

  return (
    <div
      className={`w-full overflow-x-auto md:overflow-x-visible overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2 ${className}`}
    >
      <div className="min-w-[740px] md:min-w-0 w-full flex items-center justify-between">
        {/* Columna 1: Histograma de calificación general */}
        <div className="shrink-0 min-w-[145px] lg:min-w-[160px] pr-2 lg:pr-3 flex flex-col justify-between h-28 text-left">
          <span className="text-xs lg:text-sm font-semibold text-stone-900 block leading-normal whitespace-nowrap pt-0.5">
            Calificación general
          </span>
          <div className="space-y-1 w-full pt-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats?.distribution?.[star as 1 | 2 | 3 | 4 | 5] || 0;
              const pct = totalReviews > 0 ? (count / totalReviews) * 100 : star === 5 ? 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-[11px] text-stone-600 font-medium">
                  <span className="w-2.5 tabular-nums text-stone-500 shrink-0">{star}</span>
                  <div className="w-16 lg:w-20 h-1 rounded-full bg-stone-200 overflow-hidden shrink-0">
                    <div
                      className="h-full bg-stone-900 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Separador vertical con margen */}
        <div className="w-px h-16 bg-stone-200 shrink-0 self-center mx-2 lg:mx-3" aria-hidden="true" />

        {/* Columnas 2 a 7: Dimensiones individuales sin truncate para evitar cortes de texto */}
        {dimensions.map((dim, idx) => {
          const Icon = dim.Icon;
          return (
            <React.Fragment key={dim.label}>
              <div className="flex-1 min-w-[85px] lg:min-w-[105px] px-2 lg:px-3 flex flex-col justify-between h-28 text-left">
                <span className="text-xs lg:text-sm font-semibold text-stone-900 block leading-normal whitespace-nowrap pt-0.5">
                  {dim.label}
                </span>
                <span className="font-['Outfit'] font-black text-xl lg:text-2xl text-stone-900 tabular-nums my-auto">
                  {dim.score}
                </span>
                <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-stone-800 shrink-0 stroke-[1.75]" aria-hidden="true" />
              </div>
              {idx < dimensions.length - 1 && (
                <div className="w-px h-16 bg-stone-200 shrink-0 self-center mx-2 lg:mx-3" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};