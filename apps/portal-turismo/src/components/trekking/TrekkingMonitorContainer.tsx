import React from 'react';
import { useTrekkingElevation } from './hooks/useTrekkingElevation';
import { ElevationProfileChart } from './components/ElevationProfileChart';
import { TelemetryPanel } from './components/TelemetryPanel';
import { CheckpointDetails } from './components/CheckpointDetails';
import { PaceSelector } from './components/PaceSelector';

export const TrekkingMonitorContainer: React.FC = () => {
  const {
    currentKm,
    pace,
    telemetry,
    checkpoints,
    trailProfile,
    maxKm,
    setKm,
    selectCheckpoint,
    setPace,
  } = useTrekkingElevation();

  return (
    <div className="space-y-6">
      {/* Controles de Ritmo y Telemetría en Tiempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <PaceSelector selectedPace={pace} onSelectPace={setPace} />
        </div>
        <div className="lg:col-span-2">
          <TelemetryPanel telemetry={telemetry} />
        </div>
      </div>

      {/* Gráfico de Perfil Altimétrico Interactivo */}
      <ElevationProfileChart
        currentKm={currentKm}
        maxKm={maxKm}
        trailProfile={trailProfile}
        checkpoints={checkpoints}
        onSelectKm={setKm}
        onSelectCheckpoint={selectCheckpoint}
      />

      {/* Ficha Dinámica de la Posta Seleccionada */}
      <CheckpointDetails checkpoint={telemetry.activeCheckpoint} />
    </div>
  );
};
