import { useCallback, useEffect, useState } from 'react';
import { reviewsModerationService } from '../services/reviews.service.ts';
import type { DashboardReview, ReviewStatus } from '../types/review.types.ts';

export function useReviewModeration() {
  const [items, setItems] = useState<DashboardReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewStatus | 'ALL'>('PENDING');

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewsModerationService.getReviews(
        filter === 'ALL' ? undefined : filter,
      );
      setItems(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'No se pudieron cargar las reseñas para moderación.',
      );
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const approve = useCallback(
    async (id: string) => {
      const updated = await reviewsModerationService.approve(id);
      setItems((current) =>
        filter === 'ALL'
          ? current.map((item) => (item.id === id ? updated : item))
          : current.filter((item) => item.id !== id),
      );
    },
    [filter],
  );

  const reject = useCallback(
    async (id: string, notes: string) => {
      const updated = await reviewsModerationService.reject(id, notes);
      setItems((current) =>
        filter === 'ALL'
          ? current.map((item) => (item.id === id ? updated : item))
          : current.filter((item) => item.id !== id),
      );
    },
    [filter],
  );

  return {
    items,
    isLoading,
    error,
    filter,
    setFilter,
    approve,
    reject,
    refresh: fetchItems,
  };
}
