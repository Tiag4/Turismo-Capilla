import React, { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { CircuitsHeader } from '../components/circuits/CircuitsHeader';
import { CircuitTabs } from '../components/circuits/CircuitTabs';
import { MysticCircuitView } from '../components/circuits/MysticCircuitView';
import { GastronomicCircuitView } from '../components/circuits/GastronomicCircuitView';
import { AdventureCircuitView } from '../components/circuits/AdventureCircuitView';
import { InteractiveMapContainer } from '../components/map/InteractiveMapContainer';
import { getCircuitPlaces } from '../components/circuits/data/circuitsData';
import type { CircuitId } from '../components/circuits/types/circuits.types';

export const ThematicCircuitsPage: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<CircuitId>('mistico');
  const circuitPlaces = useMemo(() => getCircuitPlaces(activeCircuit), [activeCircuit]);

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

        <div className="space-y-3 pt-4" id="mapa">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-600" />
              <h3 className="font-display font-bold text-lg text-sand-900">
                Ubicaciones del Circuito en el Mapa
              </h3>
            </div>
            <span className="text-xs text-sand-500 font-medium">Topografía oficial con Leaflet</span>
          </div>
          <InteractiveMapContainer
            places={circuitPlaces}
            showFilters={false}
            heightClassName="h-[460px] sm:h-[520px]"
          />
        </div>
      </div>
    </div>
  );
};
