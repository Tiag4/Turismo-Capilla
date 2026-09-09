import React from 'react';
import type { TrekkingTelemetry } from '../types';

interface TelemetryPanelProps {
  telemetry: TrekkingTelemetry;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ telemetry }) => {
  const {
    elevationMsnm,
    elevationGainM,
    estimatedTempC,
    ascentTimeHours,
    ascentTimeMinutes,
    currentKm,
    isCutoffZone,
  } = telemetry;

  return (
    <div className="space-y-4">
      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Cota Actual */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs">
          <span className="block text-[11px] font-bold text-sand-500 uppercase tracking-wider">
            Cota de Altitud
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-900">
              {elevationMsnm.toLocaleString('es-AR')}
            </span>
            <span className="text-xs font-semibold text-sand-500">msnm</span>
          </div>
          <span className="block text-[11px] text-primary-600 font-semibold mt-0.5">
            +{elevationGainM}m de desnivel
          </span>
        </div>

        {/* Distancia Recorrida */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs">
          <span className="block text-[11px] font-bold text-sand-500 uppercase tracking-wider">
            Distancia de Sendero
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-900">
              {currentKm.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-sand-500">km</span>
          </div>
          <span className="block text-[11px] text-sand-500 font-normal mt-0.5">
            de 5.8 km totales a cumbre
          </span>
        </div>

        {/* Temperatura en Cota */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs">
          <span className="block text-[11px] font-bold text-sand-500 uppercase tracking-wider">
            Temperatura en Cota
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-900">
              {estimatedTempC}°
            </span>
            <span className="text-xs font-semibold text-sand-500">C</span>
          </div>
          <span className="block text-[11px] text-amber-700 font-semibold mt-0.5">
            {(24 - estimatedTempC).toFixed(1)}°C menos que en base
          </span>
        </div>

        {/* Tiempo de Marcha */}
        <div className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs">
          <span className="block text-[11px] font-bold text-sand-500 uppercase tracking-wider">
            Tiempo de Marcha
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-900">
              {ascentTimeHours}h {ascentTimeMinutes.toString().padStart(2, '0')}m
            </span>
          </div>
          <span className="block text-[11px] text-sand-500 font-normal mt-0.5">
            ascenso sin pausas prolongadas
          </span>
        </div>
      </div>

      {/* Alerta Operativa de Seguridad (Solamente si supera cota de corte o advertencia) */}
      {isCutoffZone ? (
        <div className="p-3.5 bg-sand-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-sand-700">
          <div className="space-y-0.5">
            <span className="font-bold text-primary-400 block">
              Control de Seguridad Estricto — Refugio de los Pastores
            </span>
            <span className="text-sand-300">
              Horario de corte: después de las 14:00 hs los guardaparques impiden continuar a cumbre.
            </span>
          </div>
          <span className="shrink-0 px-3 py-1 bg-primary-600 text-white font-bold rounded-lg text-[11px]">
            Corte 14:00 hs
          </span>
        </div>
      ) : (
        <div className="p-3 bg-sand-100/90 text-sand-700 rounded-2xl flex items-center justify-between text-xs border border-sand-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-uritorco-500 shrink-0" />
            <span>Sendero habilitado en condiciones normales por Secretaría de Turismo.</span>
          </div>
          <span className="hidden sm:inline font-semibold text-sand-900">
            Registro previo en La Toma
          </span>
        </div>
      )}
    </div>
  );
};
