import { apiClient } from './api.client.ts';
import type { DashboardReview, ReviewStatus } from '../types/review.types.ts';

export const reviewsModerationService = {
  getReviews(status?: ReviewStatus): Promise<DashboardReview[]> {
    const query = status ? `?status=${status}` : '';
    return apiClient.get<DashboardReview[]>(`/reviews${query}`);
  },

  approve(id: string): Promise<DashboardReview> {
    return apiClient.patch<DashboardReview>(`/reviews/${id}/approve`, {});
  },

  reject(id: string, notes: string): Promise<DashboardReview> {
    return apiClient.patch<DashboardReview>(`/reviews/${id}/reject`, { notes });
  },
};
