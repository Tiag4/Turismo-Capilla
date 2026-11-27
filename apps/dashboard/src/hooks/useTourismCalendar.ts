import { useState, useEffect, useCallback } from 'react';
import { seasonsService } from '../services/seasons.service.ts';
import type { TourismSeason, CreateSeasonDto } from '../types/season.types.ts';

export function useTourismCalendar() {
  const [seasons, setSeasons] = useState<TourismSeason[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSeasons = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await seasonsService.getAll();
      setSeasons(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeasons();
  }, [fetchSeasons]);

  const createSeason = useCallback(async (dto: CreateSeasonDto) => {
    const created = await seasonsService.create(dto);
    setSeasons((prev) => [created, ...prev]);
  }, []);

  const updateSeason = useCallback(async (id: string, dto: Partial<CreateSeasonDto>) => {
    const updated = await seasonsService.update(id, dto);
    setSeasons((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }, []);

  const toggleSeasonActive = useCallback(async (id: string) => {
    const updated = await seasonsService.toggleActive(id);
    setSeasons((prev) => prev.map((s) => (s.id === id ? updated : s)));
  }, []);

  return {
    seasons,
    isLoading,
    createSeason,
    updateSeason,
    toggleSeasonActive,
    refresh: fetchSeasons,
  };
}
