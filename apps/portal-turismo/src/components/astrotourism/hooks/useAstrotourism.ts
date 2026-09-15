import { useState, useCallback, useMemo } from 'react';
import { NIGHT_PHASES, STARGAZING_SPOTS } from '../data/astrotourism-data';
import type { NightPhase, StargazingSpot } from '../types';

export function useAstrotourism() {
  const [phaseIndex, setPhaseIndex] = useState<number>(1); // Default to 23:00 hs (Milky Way)
  const [activeSpotId, setActiveSpotId] = useState<string>('alazanes');

  const activePhase: NightPhase = useMemo(() => {
    return NIGHT_PHASES[phaseIndex] ?? NIGHT_PHASES[0];
  }, [phaseIndex]);

  const activeSpot: StargazingSpot = useMemo(() => {
    return STARGAZING_SPOTS.find((s) => s.id === activeSpotId) ?? STARGAZING_SPOTS[0];
  }, [activeSpotId]);

  const selectPhase = useCallback((idx: number) => {
    if (idx >= 0 && idx < NIGHT_PHASES.length) {
      setPhaseIndex(idx);
    }
  }, []);

  const selectSpot = useCallback((id: string) => {
    setActiveSpotId(id);
  }, []);

  return {
    phases: NIGHT_PHASES,
    spots: STARGAZING_SPOTS,
    activePhase,
    activeSpot,
    phaseIndex,
    selectPhase,
    selectSpot,
  };
}
