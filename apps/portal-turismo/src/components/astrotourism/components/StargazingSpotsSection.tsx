import React from 'react';
import { Mountain, Route, Check } from 'lucide-react';
import type { StargazingSpot } from '../types';

interface StargazingSpotsSectionProps {
  spots: StargazingSpot[];
}

export const StargazingSpotsSection: React.FC<StargazingSpotsSectionProps> = ({ spots }) => {
  return (
    <section aria-labelledby="spots-heading" className="space-y-8">
      <div className="max-w-3xl space-y-2">
        <h2
          id="spots-heading"
          className="font-display font-extrabold text-2xl sm:text-3xl text-sand-900 tracking-tight"
        >
          Dónde observar el cielo en Capilla del Monte
        </h2>
        <p className="text-sm sm:text-base text-sand-700 leading-relaxed max-w-[65ch]">
          Alejarse unos kilómetros del alumbrado urbano marca la diferencia. Estos son los tres puntos de referencia en la región, ordenados de menor a mayor exigencia física.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {spots.map((spot) => (
          <article
            key={spot.id}
            className="border-t-2 border-sand-300 pt-5 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-xl text-sand-900">
                  {spot.title}
                </h3>
                <p className="text-xs font-semibold text-terracotta-700">
                  {spot.idealFor}
                </p>
              </div>

              <dl className="space-y-1.5 text-xs text-sand-700">
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-sand-600 shrink-0" aria-hidden="true" />
                  <dd>
                    <strong className="font-semibold text-sand-900">{spot.altitudeMsnm} m s. n. m.</strong> · {spot.bortleClass}
                  </dd>
                </div>
                <div className="flex items-start gap-2">
                  <Route className="w-4 h-4 text-sand-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <dd>{spot.accessibility}</dd>
                </div>
              </dl>

              <p className="text-sm text-sand-700 leading-relaxed">
                {spot.description}
              </p>
            </div>

            <ul className="space-y-2 pt-1">
              {(spot.features ?? []).map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-sand-700">
                  <Check className="w-3.5 h-3.5 text-uritorco-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
};
