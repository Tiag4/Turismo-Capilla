import type { AccommodationPricingScheme } from '../types/pricing.types.ts';

const STORAGE_KEY = 'turismo_capilla_pricing_schemes';

const DEFAULT_SCHEMES: Record<string, AccommodationPricingScheme> = {
  'acc-1': {
    accommodationId: 'acc-1',
    basePricePerNight: 85000,
    highSeasonPricePerNight: 125000,
    longWeekendPricePerNight: 110000,
    minNightsBase: 2,
    minNightsHighSeason: 4,
    minNightsLongWeekend: 3,
    highSeasonStartMonth: 12, // Diciembre
    highSeasonEndMonth: 2, // Febrero
    updatedAt: new Date().toISOString(),
  },
  'acc-2': {
    accommodationId: 'acc-2',
    basePricePerNight: 120000,
    highSeasonPricePerNight: 175000,
    longWeekendPricePerNight: 155000,
    minNightsBase: 2,
    minNightsHighSeason: 3,
    minNightsLongWeekend: 3,
    highSeasonStartMonth: 12,
    highSeasonEndMonth: 2,
    updatedAt: new Date().toISOString(),
  },
  'acc-3': {
    accommodationId: 'acc-3',
    basePricePerNight: 65000,
    highSeasonPricePerNight: 95000,
    longWeekendPricePerNight: 85000,
    minNightsBase: 1,
    minNightsHighSeason: 3,
    minNightsLongWeekend: 3,
    highSeasonStartMonth: 12,
    highSeasonEndMonth: 2,
    updatedAt: new Date().toISOString(),
  },
};

export const pricingService = {
  getAll(): Record<string, AccommodationPricingScheme> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback a defaults si hay error de parseo o SSR
    }
    return { ...DEFAULT_SCHEMES };
  },

  getByAccommodationId(accommodationId: string): AccommodationPricingScheme {
    const all = this.getAll();
    if (all[accommodationId]) {
      return all[accommodationId];
    }

    // Si no existe esquema personalizado, generamos uno base a partir del precio base estándar
    const fallback: AccommodationPricingScheme = {
      accommodationId,
      basePricePerNight: 75000,
      highSeasonPricePerNight: 110000,
      longWeekendPricePerNight: 95000,
      minNightsBase: 2,
      minNightsHighSeason: 4,
      minNightsLongWeekend: 3,
      highSeasonStartMonth: 12,
      highSeasonEndMonth: 2,
      updatedAt: new Date().toISOString(),
    };
    return fallback;
  },

  save(scheme: AccommodationPricingScheme): AccommodationPricingScheme {
    const all = this.getAll();
    const updated = {
      ...scheme,
      updatedAt: new Date().toISOString(),
    };
    all[scheme.accommodationId] = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // Ignorar quota errors
    }
    return updated;
  },
};
