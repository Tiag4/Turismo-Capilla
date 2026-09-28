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
      {/* 4 Metrics Grid - limpio y sin cajas blancas pesadas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Cota Actual */}
        <div className="bg-sand-100/60 p-3.5 sm:p-4 rounded-xl border border-sand-200/80 space-y-1">
          <span className="block text-[11px] font-bold text-sand-600 uppercase tracking-wider">
            Cota de Altitud
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-950">
              {elevationMsnm.toLocaleString('es-AR')}
            </span>
            <span className="text-xs font-semibold text-sand-600">msnm</span>
          </div>
          <span className="block text-[11px] text-terracotta-600 font-bold">
            +{elevationGainM}m de desnivel
          </span>
        </div>

        {/* Distancia Recorrida */}
        <div className="bg-sand-100/60 p-3.5 sm:p-4 rounded-xl border border-sand-200/80 space-y-1">
          <span className="block text-[11px] font-bold text-sand-600 uppercase tracking-wider">
            Distancia de Sendero
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-950">
              {currentKm.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-sand-600">km</span>
          </div>
          <span className="block text-[11px] text-sand-600 font-medium">
            de 5.8 km a cumbre
          </span>
        </div>

        {/* Temperatura en Cota */}
        <div className="bg-sand-100/60 p-3.5 sm:p-4 rounded-xl border border-sand-200/80 space-y-1">
          <span className="block text-[11px] font-bold text-sand-600 uppercase tracking-wider">
            Temperatura en Cota
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-950">
              {estimatedTempC}°
            </span>
            <span className="text-xs font-semibold text-sand-600">C</span>
          </div>
          <span className="block text-[11px] text-amber-700 font-semibold">
            {(24 - estimatedTempC).toFixed(1)}°C menos que en base
          </span>
        </div>

        {/* Tiempo de Marcha */}
        <div className="bg-sand-100/60 p-3.5 sm:p-4 rounded-xl border border-sand-200/80 space-y-1">
          <span className="block text-[11px] font-bold text-sand-600 uppercase tracking-wider">
            Tiempo de Marcha
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-display font-black text-sand-950">
              {ascentTimeHours}h {ascentTimeMinutes.toString().padStart(2, '0')}m
            </span>
          </div>
          <span className="block text-[11px] text-sand-600 font-medium">
            ascenso sin pausas
          </span>
        </div>
      </div>

      {/* Alerta Operativa de Seguridad (Solamente si supera cota de corte o advertencia) */}
      {isCutoffZone ? (
        <div className="p-3.5 bg-sand-900 text-white rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border border-sand-700">
          <div className="space-y-0.5">
            <span className="font-bold text-terracotta-400 block">
              Control de Seguridad Estricto — Refugio de los Pastores
            </span>
            <span className="text-sand-300">
              Horario de corte: después de las 14:00 hs los guardaparques impiden continuar a cumbre.
            </span>
          </div>
          <span className="shrink-0 px-3 py-1 bg-terracotta-600 text-white font-bold rounded-lg text-[11px]">
            Corte 14:00 hs
          </span>
        </div>
      ) : (
        <div className="p-3 bg-sand-200/50 text-sand-700 rounded-xl flex items-center justify-between text-xs border border-sand-200">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-uritorco-600 shrink-0" />
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
