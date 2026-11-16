import { apiClient } from './api.client.ts';
import type { DateBlock, CreateDateBlockDto, DateBlockReason } from '../types/date-block.types.ts';

const STORAGE_KEY = 'turismo_capilla_date_blocks';

interface ApiDateBlock {
  id: string;
  accommodationId: string;
  accommodationName?: string | null;
  startDate: string;
  endDate: string;
  reason?: DateBlockReason | null;
  notes?: string | null;
  createdAt: string;
}

interface ApiCreateDateBlockBody {
  startDate: string;
  endDate: string;
  reason: DateBlockReason;
  notes?: string;
}

type DataSource = 'remote' | 'local';

class DateBlocksService {
  private lastSource: DataSource = 'remote';

  private getStorage(): DateBlock[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private setStorage(blocks: DateBlock[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch {
      // Ignorar errores de almacenamiento
    }
  }

  getLastSource(): DataSource {
    return this.lastSource;
  }

  async getAll(accommodationIds: string[]): Promise<DateBlock[]> {
    if (accommodationIds.length === 0) {
      this.lastSource = 'remote';
      return [];
    }

    const responses = await Promise.allSettled(
      accommodationIds.map((accommodationId) =>
        apiClient.get<ApiDateBlock[]>(`/accommodations/${accommodationId}/date-blocks`),
      ),
    );

    const fulfilled = responses.filter(
      (result): result is PromiseFulfilledResult<ApiDateBlock[]> => result.status === 'fulfilled',
    );

    if (fulfilled.length === 0) {
      this.lastSource = 'local';
      const localBlocks = this.getStorage();
      return localBlocks.filter((block) => accommodationIds.includes(block.accommodationId));
    }

    this.lastSource = 'remote';
    const blocks = fulfilled
      .flatMap((result) => result.value)
      .map((block) => this.mapFromApi(block));
    this.setStorage(blocks);
    return blocks;
  }

  async create(dto: CreateDateBlockDto): Promise<DateBlock> {
    const body: ApiCreateDateBlockBody = {
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      notes: dto.notes,
    };

    const response = await apiClient.post<ApiDateBlock>(
      `/accommodations/${dto.accommodationId}/date-blocks`,
      body,
    );

    return this.mapFromApi({
      ...response,
      accommodationId: response.accommodationId || dto.accommodationId,
      accommodationName: response.accommodationName || dto.accommodationName,
    });
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/date-blocks/${id}`);
  }

  private mapFromApi(block: ApiDateBlock): DateBlock {
    return {
      id: block.id,
      accommodationId: block.accommodationId,
      accommodationName: block.accommodationName || 'Alojamiento',
      startDate: block.startDate,
      endDate: block.endDate,
      reason: block.reason || 'MAINTENANCE',
      notes: block.notes || undefined,
      createdAt: block.createdAt,
    };
  }
}

export const dateBlocksService = new DateBlocksService();
