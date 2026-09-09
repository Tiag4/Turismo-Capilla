import { useState, useEffect, useCallback } from 'react';
import { dateBlocksService } from '../services/date-blocks.service.ts';
import type { DateBlock, CreateDateBlockDto } from '../types/date-block.types.ts';

export function useDateBlock() {
  const [blocks, setBlocks] = useState<DateBlock[]>([]);

  const refreshBlocks = useCallback(() => {
    setBlocks(dateBlocksService.getAll());
  }, []);

  useEffect(() => {
    refreshBlocks();
  }, [refreshBlocks]);

  const createBlock = useCallback((dto: CreateDateBlockDto) => {
    const created = dateBlocksService.create(dto);
    setBlocks((prev) => [...prev, created]);
    return created;
  }, []);

  const deleteBlock = useCallback((id: string) => {
    dateBlocksService.delete(id);
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    blocks,
    createBlock,
    deleteBlock,
    refreshBlocks,
  };
}
