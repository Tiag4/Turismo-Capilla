import React, { useId } from 'react';
import type { NightPhase } from '../types';

interface NightSkyCanvasProps {
  phase: NightPhase;
}

const BACKGROUND_STARS = [
  { cx: 70, cy: 48, r: 1.2, op: 0.75 }, { cx: 135, cy: 82, r: 1.5, op: 0.9 },
  { cx: 198, cy: 36, r: 1.0, op: 0.65 }, { cx: 255, cy: 96, r: 1.7, op: 0.92 },
  { cx: 325, cy: 52, r: 1.1, op: 0.6 }, { cx: 388, cy: 38, r: 1.6, op: 0.88 },
  { cx: 452, cy: 78, r: 1.0, op: 0.78 }, { cx: 515, cy: 44, r: 1.3, op: 0.85 },
  { cx: 645, cy: 42, r: 1.2, op: 0.75 }, { cx: 718, cy: 74, r: 1.5, op: 0.9 },
  { cx: 762, cy: 34, r: 1.1, op: 0.68 }, { cx: 108, cy: 132, r: 1.3, op: 0.7 },
  { cx: 182, cy: 150, r: 1.0, op: 0.58 }, { cx: 292, cy: 138, r: 1.4, op: 0.8 },
  { cx: 422, cy: 112, r: 1.6, op: 0.88 }, { cx: 486, cy: 152, r: 1.1, op: 0.62 },
  { cx: 618, cy: 162, r: 1.3, op: 0.78 }, { cx: 696, cy: 132, r: 1.5, op: 0.85 },
  { cx: 46, cy: 98, r: 1.0, op: 0.6 }, { cx: 352, cy: 98, r: 1.2, op: 0.7 },
  { cx: 742, cy: 112, r: 1.1, op: 0.68 }, { cx: 672, cy: 86, r: 1.4, op: 0.88 },
];

export const NightSkyCanvas: React.FC<NightSkyCanvasProps> = ({ phase }) => {
  const uid = useId().replace(/:/g, '');
  const { skyColors, visualState, visibleConstellation, celestialEvent, recommendedActivity } = phase;

  const skyGradId = `sky-grad-${uid}`;
  const glowGradId = `horizon-glow-${uid}`;
  const milkyGradId = `milky-way-${uid}`;
  const glowCx =
    visualState.horizonGlowSide === 'west'
      ? '18%'
      : visualState.horizonGlowSide === 'east'
      ? '84%'
      : '50%';

  return (
    <figure className="rounded-2xl overflow-hidden border border-sand-800 bg-[#070b14] select-none">
      <div className="relative w-full h-[300px] sm:h-[380px]">
        <svg
          viewBox="0 0 800 400"
          role="img"
          aria-label={`Simulación del cielo nocturno sobre el Cerro Uritorco a las ${phase.timeLabel}: ${visibleConstellation}`}
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id={skyGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={skyColors.top} />
              <stop offset="55%" stopColor={skyColors.mid} />
              <stop offset="100%" stopColor={skyColors.horizon} />
            </linearGradient>

            <radialGradient id={glowGradId} cx={glowCx} cy="100%" r="70%">
              <stop offset="0%" stopColor={skyColors.glow} />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <linearGradient id={milkyGradId} x1="0.15" y1="0" x2="0.85" y2="1">
              <stop offset="0%" stopColor="rgba(224,242,254,0)" />
              <stop offset="50%" stopColor="rgba(224,242,254,0.22)" />
              <stop offset="100%" stopColor="rgba(224,242,254,0)" />
            </linearGradient>
          </defs>

          {/* Base Sky */}
          <rect width="800" height="400" fill={`url(#${skyGradId})`} />
          <rect width="800" height="400" fill={`url(#${glowGradId})`} />

          {/* Milky Way Arch */}
          <g
            className="motion-safe:transition-opacity motion-safe:duration-700 ease-out"
            style={{ opacity: visualState.milkyWayOpacity }}
          >
            <path
              d="M 110 0 Q 380 170 690 400"
              stroke={`url(#${milkyGradId})`}
              strokeWidth="120"
              fill="none"
            />
            <path
              d="M 120 0 Q 380 170 680 400"
              stroke="rgba(255, 250, 240, 0.08)"
              strokeWidth="44"
              fill="none"
            />
            {visualState.milkyWayOpacity >= 0.7 && (
              <text
                x="230"
                y="62"
                fill="#ded8cb"
                fontSize="11"
                fontWeight="600"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Arco de la Vía Láctea
              </text>
            )}
          </g>

          {/* Background Starfield */}
          <g
            className="motion-safe:transition-opacity motion-safe:duration-700 ease-out"
            style={{ opacity: visualState.starVisibility }}
          >
            {BACKGROUND_STARS.map((star, idx) => (
              <circle
                key={idx}
                cx={star.cx}
                cy={star.cy}
                r={star.r}
                fill="#faf8f5"
                opacity={star.op}
              />
            ))}
          </g>

          {/* Venus (Lucero Vespertino) at 20:30 */}
          <g
            className="motion-safe:transition-opacity motion-safe:duration-700 ease-out"
            style={{ opacity: visualState.venusVisible ? 1 : 0 }}
          >
            <circle cx="150" cy="215" r="14" fill="rgba(254, 240, 138, 0.16)" />
            <circle cx="150" cy="215" r="4.2" fill="#fef9c3" />
            <text
              x="150"
              y="194"
              textAnchor="middle"
              fill="#faf8f5"
              fontSize="11"
              fontWeight="700"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Venus (Lucero)
            </text>
          </g>

          {/* Southern Cross & Pointers */}
          <g
            className="motion-safe:transition-opacity motion-safe:duration-700 ease-out"
            style={{ opacity: visualState.southernCrossHighlight ? 1 : 0.2 }}
          >
            <line
              x1="560"
              y1="62"
              x2="560"
              y2="117"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="535"
              y1="87"
              x2="585"
              y2="87"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx="560" cy="62" r="2.6" fill="#ffffff" />
            <circle cx="560" cy="117" r="3.2" fill="#ffffff" />
            <circle cx="535" cy="87" r="2.4" fill="#ffffff" />
            <circle cx="585" cy="87" r="2.2" fill="#ffffff" />
            <ellipse cx="576" cy="108" rx="10" ry="7" fill="rgba(2, 4, 8, 0.55)" />
            <circle cx="626" cy="106" r="3.6" fill="#fef08a" />
            <circle cx="656" cy="116" r="2.8" fill="#e0f2fe" />

            {visualState.southernCrossHighlight && (
              <text
                x="595"
                y="42"
                textAnchor="middle"
                fill="#ece8df"
                fontSize="11"
                fontWeight="700"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Cruz del Sur y Punteros
              </text>
            )}
          </g>

          {/* Orion Setting at Pre-Dawn (05:30) */}
          <g
            className="motion-safe:transition-opacity motion-safe:duration-700 ease-out"
            style={{ opacity: visualState.orionVisible ? 1 : 0 }}
          >
            <circle cx="145" cy="145" r="2.8" fill="#fed7aa" />
            <circle cx="178" cy="152" r="2.4" fill="#e0f2fe" />
            <circle cx="155" cy="176" r="2.2" fill="#ffffff" />
            <circle cx="163" cy="179" r="2.2" fill="#ffffff" />
            <circle cx="171" cy="182" r="2.2" fill="#ffffff" />
            <circle cx="148" cy="206" r="2.5" fill="#e0f2fe" />
            <circle cx="182" cy="212" r="3.0" fill="#bae6fd" />
            <text
              x="164"
              y="128"
              textAnchor="middle"
              fill="#ece8df"
              fontSize="11"
              fontWeight="700"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Orión hacia el oeste
            </text>
          </g>

          {/* Cerro Uritorco Silhouette (1.979m) */}
          <path
            d="M 0 400 L 0 336 Q 80 326 140 316 L 220 292 Q 260 278 310 232 Q 340 202 380 174 Q 400 160 415 165 Q 435 180 470 236 L 530 274 Q 580 284 640 308 Q 720 322 800 342 L 800 400 Z"
            fill="#070a10"
          />

          {/* Summit Marker */}
          <g>
            {visualState.summitBeaconVisible && (
              <circle cx="415" cy="165" r="11" fill="rgba(224, 109, 57, 0.28)" />
            )}
            <circle cx="415" cy="165" r="4" fill="#e06d39" />
            <line x1="415" y1="165" x2="415" y2="144" stroke="#ebb593" strokeWidth="1.5" />
            <text
              x="415"
              y="136"
              textAnchor="middle"
              fill="#f4d4be"
              fontSize="12"
              fontWeight="700"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Cumbre Uritorco · 1.979 m
            </text>
          </g>
        </svg>
      </div>

      {/* Integrated Solid Caption Bar (Single Unified Visual Frame, Zero Floating Cards) */}
      <figcaption className="bg-[#0b101b] border-t border-sand-800 px-5 sm:px-7 py-5 space-y-3 text-white">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div className="space-y-0.5">
            <span className="block text-xs font-semibold text-terracotta-300 tabular-nums">
              {phase.timeLabel} · {phase.darknessLevel}
            </span>
            <p className="font-display font-bold text-base sm:text-lg text-white">
              {visibleConstellation}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-sand-300 sm:text-right max-w-md">
            {celestialEvent}
          </p>
        </div>

        <p className="text-xs text-sand-300 border-t border-sand-800/80 pt-3 leading-relaxed">
          <strong className="font-semibold text-white">Recomendación en horario:</strong>{' '}
          {recommendedActivity}
        </p>
      </figcaption>
    </figure>
  );
};
