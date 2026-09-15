import React from 'react';
import type { AttractionTrailSpecs } from '../../types';

interface AttractionTelemetryBarProps {
  specs: AttractionTrailSpecs;
  isTrekking?: boolean;
}

export const AttractionTelemetryBar: React.FC<AttractionTelemetryBarProps> = ({
  specs,
  isTrekking = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <h3 className="font-display font-black text-base text-sand-950 flex items-center gap-2">
        <svg className="w-4 h-4 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>{isTrekking ? 'Ficha Técnica del Sendero' : 'Datos Clave del Paseo'}</span>
      </h3>

      {/* Cuadrícula de 2 Columnas estable para el sidebar (Anti-wrapping bugs) */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {isTrekking ? (
          <>
            <div className="border-b border-sand-100 pb-2.5">
              <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
                Desnivel Positivo
              </span>
              <span className="text-xl font-black text-sand-950">
                {specs.elevationGainMeters ? `+${specs.elevationGainMeters} m` : 'Moderado'}
              </span>
            </div>

            <div className="border-b border-sand-100 pb-2.5">
              <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
                Cota Máxima
              </span>
              <span className="text-xl font-black text-sand-950">
                {specs.maxElevationMsnm ? `${specs.maxElevationMsnm} msnm` : '1.000 m'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-sand-100 pb-2.5">
              <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
                Modalidad
              </span>
              <span className="text-sm font-black text-sand-950 block mt-0.5">
                {specs.trailType ?? 'Paseo libre'}
              </span>
            </div>

            <div className="border-b border-sand-100 pb-2.5">
              <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
                Guía Requerido
              </span>
              <span className="text-sm font-black text-sand-950 block mt-0.5">
                {specs.guideRequired ? 'Guía habilitado' : 'Autoguiado libre'}
              </span>
            </div>
          </>
        )}

        <div className="pt-1">
          <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
            Duración
          </span>
          <span className="text-sm font-black text-sand-950 block mt-0.5 leading-snug">
            {specs.estimatedDuration}
          </span>
        </div>

        <div className="pt-1">
          <span className="text-[10px] font-bold text-sand-600 uppercase tracking-wider block">
            Distancia
          </span>
          <span className="text-sm font-black text-sand-950 block mt-0.5 leading-snug">
            {specs.distanceKm ? `${specs.distanceKm} km` : 'En el centro'}
          </span>
        </div>
      </div>

      {specs.terrainType && (
        <div className="pt-3 border-t border-sand-100 text-xs text-sand-700 flex items-start gap-2">
          <span className="font-bold text-sand-900 shrink-0">Terreno:</span>
          <span>{specs.terrainType}</span>
        </div>
      )}
    </div>
  );
};
