import React from 'react';
import { useAstrotourism } from './hooks/useAstrotourism';
import { AstroKeyFactsStrip } from './components/AstroKeyFactsStrip';
import { NightPhasesGuide } from './components/NightPhasesGuide';
import { StargazingSpotsSection } from './components/StargazingSpotsSection';
import { AstroPreparationSection } from './components/AstroPreparationSection';
import { NightSkySimulator } from './components/NightSkySimulator';

export const AstrotourismContainer: React.FC = () => {
  const {
    keyFacts,
    phases,
    spots,
    preparationTips,
    activePhase,
    phaseIndex,
    selectPhase,
  } = useAstrotourism();

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Datos clave de observación */}
      <AstroKeyFactsStrip facts={keyFacts} />

      {/* 2. Guía informativa de horarios nocturnos */}
      <NightPhasesGuide phases={phases} />

      {/* 3. Miradores y puntos recomendados */}
      <StargazingSpotsSection spots={spots} />

      {/* 4. Recomendaciones prácticas para salir de noche */}
      <AstroPreparationSection tips={preparationTips} />

      {/* 5. Simulador interactivo al final */}
      <NightSkySimulator
        phases={phases}
        activePhase={activePhase}
        phaseIndex={phaseIndex}
        onSelectPhase={selectPhase}
      />
    </div>
  );
};
