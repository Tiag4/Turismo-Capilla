import { useState, useCallback, useMemo } from 'react';
import {
  ASTRO_KEY_FACTS,
  ASTRO_PREPARATION_TIPS,
  NIGHT_PHASES,
  STARGAZING_SPOTS,
} from '../data/astrotourism-data';
import type { NightPhase } from '../types';

export function useAstrotourism() {
  const [phaseIndex, setPhaseIndex] = useState<number>(1); // Default to 23:00 hs (Milky Way zenith)

  const activePhase: NightPhase = useMemo(() => {
    return NIGHT_PHASES[phaseIndex] ?? NIGHT_PHASES[0];
  }, [phaseIndex]);

  const selectPhase = useCallback((idx: number) => {
    if (idx >= 0 && idx < NIGHT_PHASES.length) {
      setPhaseIndex(idx);
    }
  }, []);

  return {
    keyFacts: ASTRO_KEY_FACTS,
    phases: NIGHT_PHASES,
    spots: STARGAZING_SPOTS,
    preparationTips: ASTRO_PREPARATION_TIPS,
    activePhase,
    phaseIndex,
    selectPhase,
  };
}
