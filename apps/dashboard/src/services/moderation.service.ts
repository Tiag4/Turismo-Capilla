import { apiClient } from './api.client.ts';
import type { ModerationItem, ModerationStatus } from '../types/moderation.types.ts';

const MOCK_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: 'mod-1',
    accommodationId: 'acc-1',
    accommodationName: 'Cabañas Pircas del Uritorco',
    hostName: 'Carlos Benítez',
    hostEmail: 'carlos.pircas@gmail.com',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vista panorámica al cerro desde la piscina climatizada',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'mod-2',
    accommodationId: 'acc-2',
    accommodationName: 'Casona Histórica San Esteban',
    hostName: 'Roberto Uritorco',
    hostEmail: 'roberto.uritorco@hotmail.com',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    caption: 'Galería colonial con vista al jardín de hierbas medicinales',
    status: 'PENDING',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: 'mod-3',
    accommodationId: 'acc-3',
    accommodationName: 'Refugio Los Alazanes',
    hostName: 'Esteban D’Agostino',
    hostEmail: 'esteban.dagostino@outlook.com',
    imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
    caption: 'Deck exterior con parrilla individual y vista al atardecer',
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    moderatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 'mod-4',
    accommodationId: 'acc-4',
    accommodationName: 'Hostería Del Pinar',
    hostName: 'Marcos Galván',
    hostEmail: 'hosteria.pinar@gmail.com',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    caption: 'Foto de fachada exterior con marquesina promocional',
    status: 'REJECTED',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    moderatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    feedbackNotes: 'La imagen contiene marcas de agua comerciales y banners de ofertas no permitidos por la ordenanza municipal.',
  },
];

let localItems = [...MOCK_MODERATION_ITEMS];

export const moderationService = {
  async getItems(statusFilter?: ModerationStatus | 'ALL'): Promise<ModerationItem[]> {
    try {
      const response = await apiClient.get<any>('/moderation/items');
      const items = Array.isArray(response) ? response : response.data || [];
      if (items.length > 0) return filterItems(items, statusFilter);
      return filterItems(localItems, statusFilter);
    } catch {
      return filterItems(localItems, statusFilter);
    }
  },

  async approve(id: string): Promise<ModerationItem> {
    try {
      return await apiClient.patch<ModerationItem>(`/moderation/items/${id}/approve`, {});
    } catch {
      const index = localItems.findIndex((i) => i.id === id);
      if (index === -1) throw new Error('Foto no encontrada');
      const updated: ModerationItem = {
        ...localItems[index],
        status: 'APPROVED',
        moderatedAt: new Date().toISOString(),
        feedbackNotes: undefined,
      };
      localItems[index] = updated;
      return updated;
    }
  },

  async requestChanges(id: string, notes: string): Promise<ModerationItem> {
    try {
      return await apiClient.patch<ModerationItem>(`/moderation/items/${id}/reject`, { notes });
    } catch {
      const index = localItems.findIndex((i) => i.id === id);
      if (index === -1) throw new Error('Foto no encontrada');
      const updated: ModerationItem = {
        ...localItems[index],
        status: 'REJECTED',
        moderatedAt: new Date().toISOString(),
        feedbackNotes: notes,
      };
      localItems[index] = updated;
      return updated;
    }
  },
};

function filterItems(items: ModerationItem[], filter?: ModerationStatus | 'ALL'): ModerationItem[] {
  if (!filter || filter === 'ALL') return items;
  return items.filter((item) => item.status === filter);
}
