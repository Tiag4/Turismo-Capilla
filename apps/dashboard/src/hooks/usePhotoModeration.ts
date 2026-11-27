import { useState, useEffect, useCallback } from 'react';
import { moderationService } from '../services/moderation.service.ts';
import type { ModerationItem, ModerationStatus } from '../types/moderation.types.ts';

export function usePhotoModeration() {
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<ModerationStatus | 'ALL'>('PENDING');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await moderationService.getItems(filter);
      setItems(data);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const approvePhoto = useCallback(async (id: string) => {
    const updated = await moderationService.approve(id);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }, []);

  const requestChanges = useCallback(async (id: string, notes: string) => {
    const updated = await moderationService.requestChanges(id, notes);
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
  }, []);

  return {
    items,
    isLoading,
    filter,
    setFilter,
    approvePhoto,
    requestChanges,
    refresh: fetchItems,
  };
}
