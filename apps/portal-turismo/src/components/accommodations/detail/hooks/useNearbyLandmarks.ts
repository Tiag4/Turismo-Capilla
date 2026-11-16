import { useState, useEffect, useMemo } from 'react';
import { api, type Attraction } from '../../../../services/api';
import { ATTRACTIONS_DATA } from '../../../attractions/data/attractions-data';
import { calculateHaversineDistanceKm, formatDistanceHuman } from '../utils/geoDistance';

export interface CalculatedLandmark {
  id: string;
  name: string;
  categoryLabel: string;
  distanceKm: number;
  distanceText: string;
  timeEstimate: string;
  isWalking: boolean;
  ctaUrl?: string;
  isKeyCivicHub?: boolean;
}

interface UseNearbyLandmarksProps {
  lat?: number | null;
  lng?: number | null;
  limit?: number;
}

interface LandmarkCandidate {
  id: string;
  name: string;
  categoryLabel: string;
  lat: number;
  lng: number;
  ctaUrl?: string;
  isKeyCivicHub?: boolean;
  isOpen: boolean;
}

// Capilla del Monte central civic & commercial hub (universal reference)
const CIVIC_CENTER_LANDMARK: LandmarkCandidate = {
  id: 'civic-center-calle-techada',
  name: 'Centro y Calle Techada',
  categoryLabel: 'Centro Cívico y Gastronómico',
  lat: -30.8654,
  lng: -64.5241,
  isKeyCivicHub: true,
  isOpen: true,
};

export function useNearbyLandmarks({
  lat,
  lng,
  limit = 3,
}: UseNearbyLandmarksProps) {
  const [apiAttractions, setApiAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    async function fetchAttractions() {
      try {
        setIsLoading(true);
        const data = await api.getAttractions();
        if (active && Array.isArray(data) && data.length > 0) {
          setApiAttractions(data);
        }
      } catch {
        // Fallback transparent to local ATTRACTIONS_DATA
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchAttractions();
    return () => {
      active = false;
    };
  }, []);

  const hasValidCoordinates = typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

  const nearbyLandmarks = useMemo<CalculatedLandmark[]>(() => {
    if (!hasValidCoordinates) {
      return [];
    }

    const originLat = lat as number;
    const originLng = lng as number;

    const candidates: LandmarkCandidate[] = [];

    // Always include the downtown civic center
    candidates.push(CIVIC_CENTER_LANDMARK);

    // If API returned attractions managed by Admin
    if (apiAttractions.length > 0) {
      apiAttractions.forEach((att) => {
        if (att.latitude != null && att.longitude != null) {
          candidates.push({
            id: att.id,
            name: att.name,
            categoryLabel: att.category === 'HILL' ? 'Trekking & Cumbre' : att.category === 'RIVER_BEACH' ? 'Balneario Serrano' : 'Paseo Turístico',
            lat: att.latitude,
            lng: att.longitude,
            ctaUrl: `/atractivos`,
            isOpen: att.status !== 'CLOSED',
          });
        }
      });
    } else {
      // Fallback to ATTRACTIONS_DATA
      ATTRACTIONS_DATA.forEach((att) => {
        candidates.push({
          id: att.id,
          name: att.title,
          categoryLabel: att.categoryLabel,
          lat: att.coordinates.lat,
          lng: att.coordinates.lng,
          ctaUrl: `/atractivos/${att.slug}`,
          isOpen: true,
        });
      });
    }

    // Filter valid open candidates and eliminate duplicates by name
    const seenNames = new Set<string>();
    const calculated: CalculatedLandmark[] = [];

    for (const c of candidates) {
      if (!c.isOpen) continue;
      const normalizedName = c.name.toLowerCase().trim();
      if (seenNames.has(normalizedName)) continue;
      seenNames.add(normalizedName);

      const distanceKm = calculateHaversineDistanceKm(originLat, originLng, c.lat, c.lng);
      const { distanceText, timeEstimate, isWalking } = formatDistanceHuman(distanceKm);

      calculated.push({
        id: c.id,
        name: c.name,
        categoryLabel: c.categoryLabel,
        distanceKm,
        distanceText,
        timeEstimate,
        isWalking,
        ctaUrl: c.ctaUrl,
        isKeyCivicHub: c.isKeyCivicHub,
      });
    }

    // Sort by proximity ascending
    calculated.sort((a, b) => a.distanceKm - b.distanceKm);

    // Ensure the civic center is included in top recommendations
    const hasCivicHub = calculated.slice(0, limit).some((item) => item.isKeyCivicHub);
    if (!hasCivicHub && calculated.some((item) => item.isKeyCivicHub)) {
      const civicItem = calculated.find((item) => item.isKeyCivicHub)!;
      const others = calculated.filter((item) => !item.isKeyCivicHub);
      return [civicItem, ...others.slice(0, limit - 1)].sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return calculated.slice(0, limit);
  }, [hasValidCoordinates, lat, lng, apiAttractions, limit]);

  return {
    nearbyLandmarks,
    isLoading,
    hasValidCoordinates,
  };
}
