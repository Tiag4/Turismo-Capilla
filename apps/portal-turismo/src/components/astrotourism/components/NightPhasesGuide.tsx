import React from 'react';
import { Clock } from 'lucide-react';
import type { NightPhase } from '../types';

interface NightPhasesGuideProps {
  phases: NightPhase[];
}

export const NightPhasesGuide: React.FC<NightPhasesGuideProps> = ({ phases }) => {
  return (
    <section aria-labelledby="night-phases-heading" className="space-y-6">
      <div className="max-w-3xl space-y-2">
        <h2
          id="night-phases-heading"
          className="font-display font-extrabold text-2xl sm:text-3xl text-sand-900 tracking-tight"
        >
          Qué cambia en el cielo según la hora de la noche
        </h2>
        <p className="text-sm sm:text-base text-sand-700 leading-relaxed max-w-[65ch]">
          La bóveda celeste sobre el Valle de Punilla no se ve igual a las nueve de la noche que de madrugada. Esta guía resume qué se observa en cada franja horaria para elegir el momento según lo que quieras ver o fotografiar.
        </p>
      </div>

      <div className="border-y border-sand-200 divide-y divide-sand-200">
        {phases.map((phase) => (
          <article
            key={phase.id}
            className="py-6 sm:py-7 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-10 items-start"
          >
            {/* Horario y etapa */}
            <div className="lg:col-span-4 space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="font-display font-extrabold text-2xl text-terracotta-700 tabular-nums">
                  {phase.timeLabel}
                </span>
                <span className="text-xs font-medium text-sand-600">
                  {phase.darknessLevel}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-sand-900 leading-snug">
                {phase.title}
              </h3>
              <p className="text-xs text-sand-600">
                {phase.subtitle}
              </p>
            </div>

            {/* Qué se ve y recomendación */}
            <div className="lg:col-span-8 space-y-4">
              <p className="text-sm text-sand-800 leading-relaxed max-w-[65ch]">
                {phase.description}
              </p>

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs pt-1">
                <div className="space-y-0.5">
                  <dt className="font-bold text-sand-900">
                    Qué se observa
                  </dt>
                  <dd className="text-sand-700 leading-relaxed">
                    {phase.visibleConstellation}. {phase.celestialEvent}.
                  </dd>
                </div>

                <div className="space-y-0.5">
                  <dt className="font-bold text-sand-900">
                    Qué conviene hacer
                  </dt>
                  <dd className="text-sand-700 leading-relaxed">
                    {phase.recommendedActivity}
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs text-sand-700">
        <Clock className="w-4 h-4 text-terracotta-700 shrink-0" aria-hidden="true" />
        <span>
          Podés comparar visualmente estas cuatro franjas en el{' '}
          <a
            href="#simulador-cielo"
            className="inline-flex items-center min-h-[24px] font-semibold text-terracotta-700 hover:text-terracotta-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700 rounded-xs"
          >
            simulador del cielo al final de la página
          </a>
          .
        </span>
      </div>
    </section>
  );
};
