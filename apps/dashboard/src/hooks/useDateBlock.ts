import { useState, useEffect, useCallback, useMemo } from 'react';
import { dateBlocksService } from '../services/date-blocks.service.ts';
import type { DateBlock, CreateDateBlockDto } from '../types/date-block.types.ts';

export function useDateBlock(accommodationIds: string[]) {
  const [blocks, setBlocks] = useState<DateBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLocalFallback, setIsUsingLocalFallback] = useState<boolean>(false);

  const idsKey = useMemo(
    () => accommodationIds.filter(Boolean).join(','),
    [accommodationIds],
  );

  const refreshBlocks = useCallback(async () => {
    const ids = idsKey ? idsKey.split(',') : [];
    setIsLoading(true);
    setError(null);

    try {
      const data = await dateBlocksService.getAll(ids);
      setBlocks(data);
      setIsUsingLocalFallback(dateBlocksService.getLastSource() === 'local');
    } catch (refreshError) {
      setError(
        refreshError instanceof Error
          ? refreshError.message
          : 'No se pudieron cargar los bloqueos de fechas.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [idsKey]);

  useEffect(() => {
    refreshBlocks();
  }, [refreshBlocks]);

  const createBlock = useCallback(async (dto: CreateDateBlockDto) => {
    const created = await dateBlocksService.create(dto);
    setBlocks((prev) => [...prev, created].sort((a, b) => a.startDate.localeCompare(b.startDate)));
    return created;
  }, []);

  const deleteBlock = useCallback(async (id: string) => {
    await dateBlocksService.delete(id);
    setBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

  return {
    blocks,
    isLoading,
    error,
    isUsingLocalFallback,
    createBlock,
    deleteBlock,
    refreshBlocks,
  };
}
