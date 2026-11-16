import { API_BASE_URL } from './api';
import type { DateBlockRange } from '../types/date-block.types';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const dateBlocksService = {
  async getByAccommodation(accommodationId: string): Promise<DateBlockRange[]> {
    if (!UUID_PATTERN.test(accommodationId)) {
      return [];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(
        `${API_BASE_URL}/accommodations/${accommodationId}/date-blocks`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
