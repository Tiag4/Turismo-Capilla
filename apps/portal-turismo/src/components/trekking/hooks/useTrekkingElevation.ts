import { useState, useMemo, useCallback } from 'react';
import { CHECKPOINTS, TRAIL_ELEVATION_PROFILE } from '../data/trekking-trail';
import type { HikerPace, Checkpoint, TrekkingTelemetry } from '../types';

const BASE_TEMP_CELSIUS = 24;
const LAPSE_RATE_PER_100M = 0.65;
const MAX_TRAIL_KM = 5.8;

const PACE_TOTAL_HOURS: Record<HikerPace, number> = {
  relaxed: 4.5,
  moderate: 3.5,
  sport: 2.5,
};

function interpolateElevation(km: number): number {
  const profile = TRAIL_ELEVATION_PROFILE;
  if (km <= profile[0].distanceKm) return profile[0].elevationMsnm;
  if (km >= profile[profile.length - 1].distanceKm) {
    return profile[profile.length - 1].elevationMsnm;
  }

  for (let i = 0; i < profile.length - 1; i++) {
    const p1 = profile[i];
    const p2 = profile[i + 1];
    if (km >= p1.distanceKm && km <= p2.distanceKm) {
      const ratio = (km - p1.distanceKm) / (p2.distanceKm - p1.distanceKm);
      return Math.round(p1.elevationMsnm + ratio * (p2.elevationMsnm - p1.elevationMsnm));
    }
  }

  return 1000;
}

function findActiveCheckpoint(km: number): Checkpoint {
  let matched = CHECKPOINTS[0];
  for (const cp of CHECKPOINTS) {
    if (km >= cp.distanceKm - 0.2) {
      matched = cp;
    }
  }
  return matched;
}

export function useTrekkingElevation() {
  const [currentKm, setCurrentKm] = useState<number>(0);
  const [pace, setPace] = useState<HikerPace>('moderate');

  const setKm = useCallback((km: number) => {
    const clamped = Math.max(0, Math.min(MAX_TRAIL_KM, km));
    setCurrentKm(Math.round(clamped * 10) / 10);
  }, []);

  const selectCheckpoint = useCallback((id: string) => {
    const cp = CHECKPOINTS.find((c) => c.id === id);
    if (cp) {
      setCurrentKm(cp.distanceKm);
    }
  }, []);

  const telemetry: TrekkingTelemetry = useMemo(() => {
    const elevationMsnm = interpolateElevation(currentKm);
    const elevationGainM = Math.max(0, elevationMsnm - 1000);
    const tempDrop = (elevationGainM / 100) * LAPSE_RATE_PER_100M;
    const estimatedTempC = Math.round((BASE_TEMP_CELSIUS - tempDrop) * 10) / 10;

    const totalHours = PACE_TOTAL_HOURS[pace] ?? 3.5;
    const fraction = currentKm / MAX_TRAIL_KM;
    const totalMinutes = Math.round(fraction * totalHours * 60);
    const ascentTimeHours = Math.floor(totalMinutes / 60);
    const ascentTimeMinutes = totalMinutes % 60;

    const activeCheckpoint = findActiveCheckpoint(currentKm);
    const isCutoffZone = currentKm >= 4.2;

    return {
      currentKm,
      elevationMsnm,
      elevationGainM,
      estimatedTempC,
      ascentTimeHours,
      ascentTimeMinutes,
      activeCheckpoint,
      isCutoffZone,
    };
  }, [currentKm, pace]);

  return {
    currentKm,
    pace,
    telemetry,
    checkpoints: CHECKPOINTS,
    trailProfile: TRAIL_ELEVATION_PROFILE,
    maxKm: MAX_TRAIL_KM,
    setKm,
    selectCheckpoint,
    setPace,
  };
}
