import type { DateBlock, CreateDateBlockDto } from '../types/date-block.types.ts';

const STORAGE_KEY = 'turismo_capilla_date_blocks';

class DateBlocksService {
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

  getAll(): DateBlock[] {
    return this.getStorage();
  }

  create(dto: CreateDateBlockDto): DateBlock {
    const blocks = this.getStorage();
    const newBlock: DateBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      accommodationId: dto.accommodationId,
      accommodationName: dto.accommodationName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      reason: dto.reason,
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };
    blocks.push(newBlock);
    this.setStorage(blocks);
    return newBlock;
  }

  delete(id: string): void {
    const blocks = this.getStorage().filter((b) => b.id !== id);
    this.setStorage(blocks);
  }
}

export const dateBlocksService = new DateBlocksService();
