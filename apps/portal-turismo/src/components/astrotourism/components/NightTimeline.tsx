import React, { useRef } from 'react';
import type { NightPhase } from '../types';

interface NightTimelineProps {
  phases: NightPhase[];
  currentIndex: number;
  onSelectPhase: (index: number) => void;
}

export const NightTimeline: React.FC<NightTimelineProps> = ({
  phases,
  currentIndex,
  onSelectPhase,
}) => {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const activateTab = (idx: number) => {
    onSelectPhase(idx);
    tabRefs.current[idx]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let nextIdx: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIdx = (idx + 1) % phases.length;
    } else if (e.key === 'ArrowLeft') {
      nextIdx = (idx - 1 + phases.length) % phases.length;
    } else if (e.key === 'Home') {
      nextIdx = 0;
    } else if (e.key === 'End') {
      nextIdx = phases.length - 1;
    }

    if (nextIdx !== null) {
      e.preventDefault();
      activateTab(nextIdx);
      tabRefs.current[nextIdx]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Franjas horarias del simulador nocturno"
      className="flex overflow-x-auto border-b border-sand-300 gap-6 sm:gap-8"
    >
      {phases.map((phase, idx) => {
        const isActive = currentIndex === idx;
        return (
          <button
            key={phase.id}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            id={`astro-phase-tab-${phase.id}`}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => activateTab(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`relative flex-none min-h-[48px] pb-3 pt-1 text-left transition-colors cursor-pointer border-b-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700 ${
              isActive
                ? 'border-terracotta-700 text-sand-900'
                : 'border-transparent text-sand-600 hover:text-sand-900 hover:border-sand-300'
            }`}
          >
            <span
              className={`block font-display font-bold text-xs tabular-nums ${
                isActive ? 'text-terracotta-700' : 'text-sand-600'
              }`}
            >
              {phase.timeLabel}
            </span>
            <span className="block font-display font-bold text-sm leading-snug mt-0.5 whitespace-nowrap">
              {phase.title}
            </span>
          </button>
        );
      })}
    </div>
  );
};
