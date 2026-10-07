import React, { useState } from 'react';
import { CircuitsHeader } from '../components/circuits/CircuitsHeader';
import { CircuitTabs } from '../components/circuits/CircuitTabs';
import { MysticCircuitView } from '../components/circuits/MysticCircuitView';
import { GastronomicCircuitView } from '../components/circuits/GastronomicCircuitView';
import { AdventureCircuitView } from '../components/circuits/AdventureCircuitView';
import { CircuitInteractiveMap } from '../components/circuits/CircuitInteractiveMap';
import type { CircuitId } from '../components/circuits/types/circuits.types';

export const ThematicCircuitsPage: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<CircuitId>('mistico');

  return (
    <div className="py-10 sm:py-16 bg-sand-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <CircuitsHeader />

        <CircuitTabs
          activeCircuit={activeCircuit}
          onSelectCircuit={setActiveCircuit}
        />

        {activeCircuit === 'mistico' && <MysticCircuitView />}
        {activeCircuit === 'sabores' && <GastronomicCircuitView />}
        {activeCircuit === 'aventura' && <AdventureCircuitView />}

        <CircuitInteractiveMap activeCircuit={activeCircuit} />
      </div>
    </div>
  );
};
