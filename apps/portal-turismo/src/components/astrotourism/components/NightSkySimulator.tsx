import React from 'react';
import type { NightPhase } from '../types';
import { NightSkyCanvas } from './NightSkyCanvas';
import { NightTimeline } from './NightTimeline';

interface NightSkySimulatorProps {
  phases: NightPhase[];
  activePhase: NightPhase;
  phaseIndex: number;
  onSelectPhase: (index: number) => void;
}

export const NightSkySimulator: React.FC<NightSkySimulatorProps> = ({
  phases,
  activePhase,
  phaseIndex,
  onSelectPhase,
}) => {
  return (
    <section
      id="simulador-cielo"
      aria-labelledby="simulator-heading"
      className="scroll-mt-24 border-t border-sand-200 pt-10 space-y-6"
    >
      <div className="max-w-3xl space-y-2">
        <h2
          id="simulator-heading"
          className="font-display font-extrabold text-2xl sm:text-3xl text-sand-900 tracking-tight"
        >
          Simulador visual del cielo nocturno
        </h2>
        <p className="text-sm sm:text-base text-sand-700 leading-relaxed max-w-[65ch]">
          Elegí una franja horaria para comparar cómo cambian la luz del horizonte, el arco de la Vía Láctea y las constelaciones visibles sobre la silueta del Cerro Uritorco.
        </p>
      </div>

      <NightTimeline
        phases={phases}
        currentIndex={phaseIndex}
        onSelectPhase={onSelectPhase}
      />

      <div
        role="tabpanel"
        aria-labelledby={`astro-phase-tab-${activePhase.id}`}
        tabIndex={0}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700 rounded-2xl"
      >
        <NightSkyCanvas phase={activePhase} />
      </div>
    </section>
  );
};
