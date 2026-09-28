import { useState, useEffect, useCallback } from 'react';
import { accommodationsService } from '../services/accommodations.service.ts';
import type { Accommodation, CreateAccommodationDto } from '../types/accommodation.types.ts';

export function useHostAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccommodations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await accommodationsService.getAll();
      setAccommodations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los alojamientos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  const createAccommodation = useCallback(async (dto: CreateAccommodationDto) => {
    const created = await accommodationsService.create(dto);
    setAccommodations((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateAccommodation = useCallback(async (id: string, dto: Partial<CreateAccommodationDto>) => {
    const updated = await accommodationsService.update(id, dto);
    setAccommodations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  const toggleActive = useCallback(async (id: string) => {
    const updated = await accommodationsService.toggleActive(id);
    setAccommodations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  return {
    accommodations,
    isLoading,
    error,
    refresh: fetchAccommodations,
    createAccommodation,
    updateAccommodation,
    toggleActive,
  };
}
