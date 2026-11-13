import React from 'react';
import { Thermometer, Flashlight, Moon, Compass } from 'lucide-react';
import type { AstroPreparationTip } from '../types';

interface AstroPreparationSectionProps {
  tips: AstroPreparationTip[];
}

const TIP_ICONS: Record<AstroPreparationTip['iconKey'], React.FC<{ className?: string }>> = {
  jacket: Thermometer,
  flashlight: Flashlight,
  moon: Moon,
  compass: Compass,
};

export const AstroPreparationSection: React.FC<AstroPreparationSectionProps> = ({ tips }) => {
  return (
    <section
      aria-labelledby="prep-heading"
      className="border-t border-sand-200 pt-10 space-y-6"
    >
      <div className="max-w-2xl space-y-2">
        <h2
          id="prep-heading"
          className="font-display font-extrabold text-2xl sm:text-3xl text-sand-900 tracking-tight"
        >
          Antes de salir: recomendaciones prácticas
        </h2>
        <p className="text-sm sm:text-base text-sand-700 leading-relaxed max-w-[65ch]">
          La observación nocturna en las sierras requiere preparación básica para cuidar la seguridad y aprovechar la oscuridad natural del entorno.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7">
        {tips.map((tip) => {
          const IconComponent = TIP_ICONS[tip.iconKey];
          return (
            <div key={tip.id} className="flex items-start gap-3.5">
              <IconComponent className="w-5 h-5 text-terracotta-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-sand-900">
                  {tip.title}
                </h3>
                <p className="text-sm text-sand-700 leading-relaxed max-w-[60ch]">
                  {tip.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
