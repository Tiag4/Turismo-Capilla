/**
 * Haversine formula and distance formatting utilities
 * for spatial calculation between accommodations and territory landmarks.
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calculates great-circle distance in kilometers between two geo-coordinates.
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  if (
    typeof lat1 !== 'number' ||
    typeof lon1 !== 'number' ||
    typeof lat2 !== 'number' ||
    typeof lon2 !== 'number' ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 0;
  }

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export interface FormattedDistance {
  distanceText: string;
  timeEstimate: string;
  isWalking: boolean;
}

/**
 * Converts distance in kilometers to user-friendly text and mountain travel time estimates.
 */
export function formatDistanceHuman(distanceKm: number): FormattedDistance {
  if (distanceKm <= 0 || isNaN(distanceKm)) {
    return {
      distanceText: 'En el lugar',
      timeEstimate: 'Inmediato',
      isWalking: true,
    };
  }

  if (distanceKm < 1) {
    const meters = Math.max(50, Math.round((distanceKm * 1000) / 10) * 10);
    const walkMinutes = Math.max(1, Math.round((distanceKm * 1000) / 80)); // ~4.8 km/h walking speed
    return {
      distanceText: `A ${meters} m`,
      timeEstimate: `${walkMinutes} min caminando`,
      isWalking: true,
    };
  }

  const formattedKm = distanceKm < 10 ? distanceKm.toFixed(1) : Math.round(distanceKm).toString();
  // Mountain/urban serrano drive estimate: ~25-35 km/h avg speed plus margin
  const driveMinutes = Math.max(2, Math.round(distanceKm * 2.2));
  return {
    distanceText: `A ${formattedKm} km`,
    timeEstimate: `${driveMinutes} min en auto`,
    isWalking: false,
  };
}
