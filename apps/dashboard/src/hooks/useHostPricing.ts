import { useState, useEffect, useCallback } from 'react';
import { useHostAccommodations } from './useHostAccommodations.ts';
import { pricingService } from '../services/pricing.service.ts';
import type { AccommodationPricingScheme } from '../types/pricing.types.ts';

export function formatCurrencyARS(value: number | string): string {
  const numeric = typeof value === 'number' ? value : Number(String(value).replace(/\D/g, '')) || 0;
  return `$${numeric.toLocaleString('es-AR')}`;
}

export function parseCurrencyARS(value: string): number {
  const clean = value.replace(/\D/g, '');
  return Number(clean) || 0;
}

export function useHostPricing() {
  const { accommodations, isLoading: isLoadingAccommodations } = useHostAccommodations();
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string>('');
  
  // Scheme state
  const [currentScheme, setCurrentScheme] = useState<AccommodationPricingScheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form states
  const [basePrice, setBasePrice] = useState<number>(75000);
  const [highSeasonPrice, setHighSeasonPrice] = useState<number>(110000);
  const [longWeekendPrice, setLongWeekendPrice] = useState<number>(95000);

  const [minNightsBase, setMinNightsBase] = useState<number>(2);
  const [minNightsHighSeason, setMinNightsHighSeason] = useState<number>(4);
  const [minNightsLongWeekend, setMinNightsLongWeekend] = useState<number>(3);

  // Initialize selected accommodation when list loads
  useEffect(() => {
    if (accommodations.length > 0 && !selectedAccommodationId) {
      setSelectedAccommodationId(accommodations[0].id);
    }
  }, [accommodations, selectedAccommodationId]);

  // Load scheme when selected accommodation changes
  useEffect(() => {
    if (selectedAccommodationId) {
      const scheme = pricingService.getByAccommodationId(selectedAccommodationId);
      setCurrentScheme(scheme);
      setBasePrice(scheme.basePricePerNight);
      setHighSeasonPrice(scheme.highSeasonPricePerNight);
      setLongWeekendPrice(scheme.longWeekendPricePerNight);
      setMinNightsBase(scheme.minNightsBase);
      setMinNightsHighSeason(scheme.minNightsHighSeason);
      setMinNightsLongWeekend(scheme.minNightsLongWeekend);
      setSavedSuccess(false);
    }
  }, [selectedAccommodationId]);

  const handleSaveScheme = useCallback(async () => {
    if (!selectedAccommodationId) return;

    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const schemeToSave: AccommodationPricingScheme = {
        accommodationId: selectedAccommodationId,
        basePricePerNight: basePrice,
        highSeasonPricePerNight: highSeasonPrice,
        longWeekendPricePerNight: longWeekendPrice,
        minNightsBase,
        minNightsHighSeason,
        minNightsLongWeekend,
        highSeasonStartMonth: currentScheme?.highSeasonStartMonth || 12,
        highSeasonEndMonth: currentScheme?.highSeasonEndMonth || 2,
        updatedAt: new Date().toISOString(),
      };

      const saved = pricingService.save(schemeToSave);
      setCurrentScheme(saved);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  }, [
    selectedAccommodationId,
    basePrice,
    highSeasonPrice,
    longWeekendPrice,
    minNightsBase,
    minNightsHighSeason,
    minNightsLongWeekend,
    currentScheme,
  ]);

  const selectedAccommodation = accommodations.find((a) => a.id === selectedAccommodationId) || null;

  return {
    accommodations,
    selectedAccommodationId,
    setSelectedAccommodationId,
    selectedAccommodation,
    isLoadingAccommodations,
    currentScheme,
    // Form fields
    basePrice,
    setBasePrice,
    highSeasonPrice,
    setHighSeasonPrice,
    longWeekendPrice,
    setLongWeekendPrice,
    minNightsBase,
    setMinNightsBase,
    minNightsHighSeason,
    setMinNightsHighSeason,
    minNightsLongWeekend,
    setMinNightsLongWeekend,
    // Actions & feedback
    handleSaveScheme,
    isSaving,
    savedSuccess,
  };
}
