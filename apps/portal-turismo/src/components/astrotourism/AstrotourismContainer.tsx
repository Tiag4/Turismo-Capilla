import React from 'react';
import { useAstrotourism } from './hooks/useAstrotourism';
import { NightSkyCanvas } from './components/NightSkyCanvas';
import { NightTimeline } from './components/NightTimeline';
import { AstroInsightPanel } from './components/AstroInsightPanel';

export const AstrotourismContainer: React.FC = () => {
  const {
    phases,
    spots,
    activePhase,
    activeSpot,
    phaseIndex,
    selectPhase,
    selectSpot,
  } = useAstrotourism();

  return (
    <div className="space-y-8">
      {/* Canvas Bóveda Celeste Dinámica sobre el Cerro Uritorco */}
      <NightSkyCanvas phase={activePhase} />

      {/* Control de Línea de Tiempo Nocturna */}
      <NightTimeline
        phases={phases}
        currentIndex={phaseIndex}
        onSelectPhase={selectPhase}
      />

      {/* Panel de Insights y Miradores Certificados */}
      <AstroInsightPanel
        phase={activePhase}
        spots={spots}
        activeSpot={activeSpot}
        onSelectSpot={selectSpot}
      />
    </div>
  );
};
