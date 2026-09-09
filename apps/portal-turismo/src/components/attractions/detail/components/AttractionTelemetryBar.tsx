import React from 'react';
import type { AttractionTrailSpecs } from '../../types';

interface AttractionTelemetryBarProps {
  specs: AttractionTrailSpecs;
}

export const AttractionTelemetryBar: React.FC<AttractionTelemetryBarProps> = ({ specs }) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="font-display font-bold text-base text-sand-900 flex items-center gap-2">
        <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>Ficha Técnica del Sendero</span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="text-[11px] font-bold text-sand-500 uppercase tracking-wider block">
            Desnivel Positivo
          </span>
          <span className="text-xl sm:text-2xl font-black text-sand-900">
            {specs.elevationGainMeters ? `+${specs.elevationGainMeters} m` : 'Llano'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="text-[11px] font-bold text-sand-500 uppercase tracking-wider block">
            Cota Máxima
          </span>
          <span className="text-xl sm:text-2xl font-black text-sand-900">
            {specs.maxElevationMsnm ? `${specs.maxElevationMsnm} msnm` : '1.000 m'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="text-[11px] font-bold text-sand-500 uppercase tracking-wider block">
            Duración Estimada
          </span>
          <span className="text-base sm:text-lg font-black text-sand-900 leading-tight block mt-1">
            {specs.estimatedDuration}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200/70">
          <span className="text-[11px] font-bold text-sand-500 uppercase tracking-wider block">
            Distancia Total
          </span>
          <span className="text-base sm:text-lg font-black text-sand-900 leading-tight block mt-1">
            {specs.distanceKm ? `${specs.distanceKm} km` : 'Libre'}
          </span>
          <span className="text-[10px] text-sand-500 block">{specs.trailType ?? 'Ida y vuelta'}</span>
        </div>
      </div>

      {specs.terrainType && (
        <div className="text-xs text-sand-600 bg-sand-50/60 p-3 rounded-xl border border-sand-100 flex items-start gap-2">
          <span className="font-bold text-sand-800 shrink-0">Tipo de terreno:</span>
          <span>{specs.terrainType}</span>
        </div>
      )}
    </div>
  );
};
