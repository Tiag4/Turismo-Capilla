import React, { useRef } from 'react';
import type { Checkpoint, TrailPoint } from '../types';

interface ElevationProfileChartProps {
  currentKm: number;
  maxKm: number;
  trailProfile: TrailPoint[];
  checkpoints: Checkpoint[];
  onSelectKm: (km: number) => void;
  onSelectCheckpoint: (id: string) => void;
}

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 280;
const PAD_LEFT = 48;
const PAD_RIGHT = 32;
const PAD_TOP = 28;
const PAD_BOTTOM = 36;
const MIN_ALT = 950;
const MAX_ALT = 2050;

const CHART_W = VIEW_WIDTH - PAD_LEFT - PAD_RIGHT;
const CHART_H = VIEW_HEIGHT - PAD_TOP - PAD_BOTTOM;

function getX(km: number, maxKm: number): number {
  return PAD_LEFT + (Math.max(0, Math.min(maxKm, km)) / maxKm) * CHART_W;
}

function getY(alt: number): number {
  const norm = (alt - MIN_ALT) / (MAX_ALT - MIN_ALT);
  return PAD_TOP + CHART_H - norm * CHART_H;
}

export const ElevationProfileChart: React.FC<ElevationProfileChartProps> = ({
  currentKm,
  maxKm,
  trailProfile,
  checkpoints,
  onSelectKm,
  onSelectCheckpoint,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const points = trailProfile.map((p) => ({
    x: getX(p.distanceKm, maxKm),
    y: getY(p.elevationMsnm),
  }));

  const linePathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`, '');
  const areaPathD = `${linePathD} L ${points[points.length - 1].x.toFixed(1)},${(PAD_TOP + CHART_H).toFixed(1)} L ${points[0].x.toFixed(1)},${(PAD_TOP + CHART_H).toFixed(1)} Z`;

  const currentX = getX(currentKm, maxKm);
  const altGrid = [1000, 1250, 1500, 1750, 1979];

  const handleSvgPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const svgX = (relX / rect.width) * VIEW_WIDTH;
    const clampedSvgX = Math.max(PAD_LEFT, Math.min(PAD_LEFT + CHART_W, svgX));
    const calculatedKm = ((clampedSvgX - PAD_LEFT) / CHART_W) * maxKm;
    onSelectKm(Math.round(calculatedKm * 10) / 10);
  };

  return (
    <div className="bg-white rounded-3xl border border-sand-200 p-4 sm:p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-100 pb-3">
        <div>
          <h4 className="font-display font-bold text-lg text-sand-900">
            Perfil Altimétrico Interactivo (5.8 km)
          </h4>
          <p className="text-xs text-sand-500 font-normal">
            Deslizá el cursor o tocá cualquier posta para simular el trayecto de ascenso.
          </p>
        </div>
        <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl self-start sm:self-auto border border-primary-100">
          Desnivel Total: +979m
        </div>
      </div>

      <div className="relative select-none touch-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full h-auto cursor-ew-resize overflow-visible"
          onPointerDown={handleSvgPointer}
          onPointerMove={(e) => {
            if (e.buttons === 1) handleSvgPointer(e);
          }}
        >
          <defs>
            <linearGradient id="elevationAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e06d39" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#faf8f5" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Líneas Guía de Altitud */}
          {altGrid.map((alt) => {
            const y = getY(alt);
            return (
              <g key={alt}>
                <line
                  x1={PAD_LEFT}
                  y1={y}
                  x2={PAD_LEFT + CHART_W}
                  y2={y}
                  stroke="#ece8df"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={PAD_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-sand-400 font-mono text-[10px] font-semibold"
                >
                  {alt}m
                </text>
              </g>
            );
          })}

          {/* Área y Curva del Perfil */}
          <path d={areaPathD} fill="url(#elevationAreaGrad)" />
          <path d={linePathD} fill="none" stroke="#e06d39" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Postas / Checkpoints sobre la curva */}
          {checkpoints.map((cp) => {
            const cx = getX(cp.distanceKm, maxKm);
            const cy = getY(cp.elevationMsnm);
            const isNearCurrent = Math.abs(cp.distanceKm - currentKm) < 0.25;

            return (
              <g
                key={cp.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCheckpoint(cp.id);
                }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isNearCurrent ? '6' : '4.5'}
                  fill={isNearCurrent ? '#c95627' : '#ffffff'}
                  stroke="#c95627"
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                <text
                  x={cx}
                  y={cy - 12}
                  textAnchor="middle"
                  className={`text-[10px] font-bold transition-all ${
                    isNearCurrent ? 'fill-sand-900 font-black' : 'fill-sand-500 hover:fill-primary-600'
                  }`}
                >
                  {cp.title}
                </text>
              </g>
            );
          })}

          {/* Indicador de Posición Actual (Scrubber) */}
          <line
            x1={currentX}
            y1={PAD_TOP}
            x2={currentX}
            y2={PAD_TOP + CHART_H}
            stroke="#22201e"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <circle cx={currentX} cy={getY(trailProfile[0].elevationMsnm + (currentKm / maxKm) * 979)} r="7" fill="#22201e" stroke="#ffffff" strokeWidth="2.5" />
        </svg>

        {/* Control deslizante táctil accesible */}
        <div className="pt-2">
          <input
            type="range"
            min="0"
            max={maxKm}
            step="0.1"
            value={currentKm}
            onChange={(e) => onSelectKm(parseFloat(e.target.value))}
            aria-label="Distancia del sendero en kilómetros"
            className="w-full accent-primary-500 h-2 bg-sand-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono font-semibold text-sand-500 mt-1">
            <span>Km 0.0 (La Toma)</span>
            <span>Km 2.8 (Quebrada)</span>
            <span>Km 5.8 (Cumbre Uritorco)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
