import { apiClient } from './api.client.ts';
import type { ProviderUser } from '../types/provider.types.ts';
import type { Accommodation } from '../types/accommodation.types.ts';

export const providersService = {
  async getAll(search?: string): Promise<ProviderUser[]> {
    const trimmedSearch = search?.trim();
    const path = trimmedSearch
      ? `/users?role=HOST&search=${encodeURIComponent(trimmedSearch)}`
      : '/users?role=HOST';

    return apiClient.get<ProviderUser[]>(path);
  },

  async toggleStatus(id: string, currentStatus: boolean): Promise<ProviderUser> {
    const nextStatus = !currentStatus;
    return apiClient.patch<ProviderUser>(
      `/users/${id}/status?isActive=${nextStatus}`,
      {}
    );
  },

  async getAccommodationsByHost(host: ProviderUser): Promise<Accommodation[]> {
    return apiClient.get<Accommodation[]>(`/users/${host.id}/accommodations`);
  },
};
