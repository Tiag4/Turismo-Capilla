import { apiClient } from './api.client.ts';
import type { ModerationItem, ModerationStatus } from '../types/moderation.types.ts';

export const moderationService = {
  async getItems(statusFilter?: ModerationStatus | 'ALL'): Promise<ModerationItem[]> {
    const query = statusFilter && statusFilter !== 'ALL' ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const response = await apiClient.get<ModerationItem[] | { data: ModerationItem[] }>(`/moderation/images${query}`);
    return Array.isArray(response) ? response : response.data || [];
  },

  async approve(id: string): Promise<ModerationItem> {
    return apiClient.patch<ModerationItem>(`/moderation/items/${id}/approve`, {});
  },

  async requestChanges(id: string, notes: string): Promise<ModerationItem> {
    return apiClient.patch<ModerationItem>(`/moderation/items/${id}/reject`, { notes });
  },
};
