import { apiClient } from './api.client.ts';
import type { DateBlock, CreateDateBlockDto, DateBlockReason } from '../types/date-block.types.ts';

interface ApiDateBlock {
  id: string;
  accommodationId: string;
  accommodationName?: string | null;
  roomTypeId?: string | null;
  roomTypeName?: string | null;
  unitsBlocked?: number | null;
  startDate: string;
  endDate: string;
  reason?: DateBlockReason | null;
  notes?: string | null;
  createdAt: string;
}

interface ApiCreateDateBlockBody {
  startDate: string;
  endDate: string;
  roomTypeId?: string;
  unitsBlocked?: number;
  reason: DateBlockReason;
  notes?: string;
}

type DataSource = 'remote' | 'local';

class DateBlocksService {
  private lastSource: DataSource = 'remote';

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
      this.lastSource = 'remote';
      return [];
    }

    this.lastSource = 'remote';
    return fulfilled
      .flatMap((result) => result.value)
      .map((block) => this.mapFromApi(block));
  }

  async create(dto: CreateDateBlockDto): Promise<DateBlock> {
    const body: ApiCreateDateBlockBody = {
      startDate: dto.startDate,
      endDate: dto.endDate,
      roomTypeId: dto.roomTypeId,
      unitsBlocked: dto.unitsBlocked,
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
      roomTypeId: block.roomTypeId || undefined,
      roomTypeName: block.roomTypeName || undefined,
      unitsBlocked: block.unitsBlocked || 1,
      startDate: block.startDate,
      endDate: block.endDate,
      reason: block.reason || 'MAINTENANCE',
      notes: block.notes || undefined,
      createdAt: block.createdAt,
    };
  }
}

export const dateBlocksService = new DateBlocksService();
