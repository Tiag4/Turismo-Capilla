import React from 'react';
import type { NightPhase } from '../types';

interface NightSkyCanvasProps {
  phase: NightPhase;
}

// 40 deterministic star coordinates across the upper sky
const BACKGROUND_STARS = [
  { cx: 80, cy: 40, r: 1.2, op: 0.8 }, { cx: 140, cy: 75, r: 1.5, op: 0.9 },
  { cx: 210, cy: 30, r: 1.0, op: 0.7 }, { cx: 260, cy: 90, r: 1.8, op: 0.95 },
  { cx: 330, cy: 50, r: 1.1, op: 0.6 }, { cx: 390, cy: 35, r: 1.6, op: 0.9 },
  { cx: 450, cy: 80, r: 1.0, op: 0.8 }, { cx: 520, cy: 45, r: 1.4, op: 0.85 },
  { cx: 580, cy: 95, r: 1.9, op: 1.0 }, { cx: 650, cy: 40, r: 1.2, op: 0.75 },
  { cx: 720, cy: 70, r: 1.5, op: 0.9 }, { cx: 760, cy: 30, r: 1.1, op: 0.7 },
  { cx: 110, cy: 120, r: 1.3, op: 0.7 }, { cx: 180, cy: 140, r: 1.0, op: 0.6 },
  { cx: 290, cy: 130, r: 1.4, op: 0.8 }, { cx: 420, cy: 115, r: 1.7, op: 0.9 },
  { cx: 480, cy: 145, r: 1.1, op: 0.65 }, { cx: 610, cy: 135, r: 1.3, op: 0.8 },
  { cx: 690, cy: 125, r: 1.6, op: 0.85 }, { cx: 50, cy: 90, r: 1.0, op: 0.6 },
  { cx: 350, cy: 95, r: 1.2, op: 0.7 }, { cx: 550, cy: 110, r: 1.5, op: 0.85 },
  { cx: 740, cy: 105, r: 1.1, op: 0.7 }, { cx: 670, cy: 85, r: 1.4, op: 0.9 },
];

export const NightSkyCanvas: React.FC<NightSkyCanvasProps> = ({ phase }) => {
  const { skyColors, visibleConstellation, celestialEvent } = phase;

  return (
    <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-sand-800 select-none">
      <svg
        viewBox="0 0 800 420"
        className="w-full h-full object-cover transition-colors duration-1000 ease-out"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Degradé Dinámico del Cielo */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyColors.top} />
            <stop offset="55%" stopColor={skyColors.mid} />
            <stop offset="100%" stopColor={skyColors.horizon} />
          </linearGradient>

          {/* Resplandor Crepuscular / Galáctico */}
          <radialGradient id="horizonGlow" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor={skyColors.glow} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Vía Láctea / Velo Estelar */}
          <linearGradient id="milkyWayGlow" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(224,242,254,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Fondo del Cielo */}
        <rect width="800" height="420" fill="url(#skyGrad)" />
        <rect width="800" height="420" fill="url(#horizonGlow)" />

        {/* Arco de la Vía Láctea (Más brillante a las 23:00 y 02:30) */}
        <path
          d="M 120 0 Q 380 180 680 420"
          stroke="url(#milkyWayGlow)"
          strokeWidth="110"
          fill="none"
          className="transition-opacity duration-1000"
          style={{ opacity: phase.hour >= 22 && phase.hour <= 27 ? 1 : 0.25 }}
        />

        {/* Campo de Estrellas de Fondo */}
        <g className="transition-opacity duration-700">
          {BACKGROUND_STARS.map((star, idx) => (
            <circle
              key={idx}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#ffffff"
              opacity={star.op}
              className="animate-pulse"
              style={{ animationDuration: `${2.5 + (idx % 4) * 0.8}s` }}
            />
          ))}
        </g>

        {/* Constelación Austral: Cruz del Sur (Acrux, Mimosa, Gacrux, Imai) */}
        <g className="transition-all duration-700">
          <line x1="560" y1="70" x2="560" y2="125" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="535" y1="95" x2="585" y2="95" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 3" />

          {/* Estrellas de la Cruz */}
          <circle cx="560" cy="70" r="2.5" fill="#ffffff" />
          <circle cx="560" cy="125" r="3.2" fill="#ffffff" />
          <circle cx="535" cy="95" r="2.4" fill="#ffffff" />
          <circle cx="585" cy="95" r="2.2" fill="#ffffff" />

          {/* Punteros: Alfa y Beta Centauri */}
          <circle cx="625" cy="115" r="3.6" fill="#fef08a" />
          <circle cx="655" cy="125" r="2.8" fill="#e0f2fe" />

          <text x="560" y="55" textAnchor="middle" className="fill-sand-200 text-[10px] font-bold tracking-wider uppercase">
            Cruz del Sur & Punteros
          </text>
        </g>

        {/* Silueta Oficial del Cerro Uritorco (1.979m) y Las Gemelas */}
        <path
          d="M 0 420 L 0 350 Q 80 340 140 330 L 220 305 Q 260 290 310 240 Q 340 210 380 180 Q 400 165 415 170 Q 435 185 470 245 L 530 285 Q 580 295 640 320 Q 720 335 800 355 L 800 420 Z"
          fill="#06080e"
        />

        {/* Puntos de Cota en la Silueta */}
        <g>
          {/* Cota Cumbre Uritorco */}
          <circle cx="415" cy="170" r="4" fill="#e06d39" />
          <line x1="415" y1="170" x2="415" y2="148" stroke="#e06d39" strokeWidth="1.5" />
          <text x="415" y="142" textAnchor="middle" className="fill-primary-400 font-display font-black text-[11px]">
            Cumbre Uritorco · 1.979m
          </text>
        </g>
      </svg>

      {/* Overlay Superior de Telemetría Celeste */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pointer-events-none">
        <div className="bg-sand-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-sand-800 text-white">
          <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider block">
            {phase.timeLabel} · Cielos Bortle 3
          </span>
          <span className="font-display font-bold text-sm text-white">
            {visibleConstellation}
          </span>
        </div>

        <div className="hidden md:block bg-sand-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-sand-800 text-right">
          <span className="text-[11px] text-sand-400 font-medium block">Fenómeno visible:</span>
          <span className="text-xs text-sand-200 font-semibold">{celestialEvent}</span>
        </div>
      </div>
    </div>
  );
};
