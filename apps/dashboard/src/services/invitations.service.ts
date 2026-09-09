import { apiClient } from './api.client.ts';
import type { CreateInvitationDto, InvitationToken } from '../types/invitation.types.ts';

const MOCK_INVITATIONS: InvitationToken[] = [
  {
    id: 'inv-1',
    token: 'CAP-INV-9921-X8F',
    email: 'complejo.lasgemelas@gmail.com',
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    usedAt: null,
    createdAt: new Date().toISOString(),
    createdBy: {
      name: 'Comisión',
      lastName: 'Turismo',
    },
  },
  {
    id: 'inv-2',
    token: 'CAP-INV-1104-B3Q',
    email: 'roberto.uritorco@hotmail.com',
    expiresAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    usedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    createdBy: {
      name: 'Comisión',
      lastName: 'Turismo',
    },
  },
];

let localInvitations = [...MOCK_INVITATIONS];

export const invitationsService = {
  async getAll(): Promise<InvitationToken[]> {
    try {
      const response = await apiClient.get<any>('/invitations');
      const items = Array.isArray(response) ? response : response.data || [];
      if (items.length > 0) return items;
      return localInvitations;
    } catch {
      return localInvitations;
    }
  },

  async create(dto: CreateInvitationDto): Promise<InvitationToken> {
    try {
      return await apiClient.post<InvitationToken>('/invitations', dto);
    } catch {
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      const numPart = Math.floor(1000 + Math.random() * 9000);
      const days = dto.expiresInDays || 7;

      const newInv: InvitationToken = {
        id: `inv-${Date.now()}`,
        token: `CAP-INV-${numPart}-${randomPart}`,
        email: dto.email,
        expiresAt: new Date(Date.now() + 86400000 * days).toISOString(),
        usedAt: null,
        createdAt: new Date().toISOString(),
        createdBy: {
          name: 'Comisión',
          lastName: 'Turismo',
        },
      };
      localInvitations = [newInv, ...localInvitations];
      return newInv;
    }
  },

  async revoke(id: string, reason: string): Promise<InvitationToken> {
    try {
      return await apiClient.patch<InvitationToken>(`/invitations/${id}/revoke`, { reason });
    } catch {
      const index = localInvitations.findIndex((inv) => inv.id === id);
      if (index === -1) throw new Error('Invitación no encontrada');
      const updated: InvitationToken = {
        ...localInvitations[index],
        isRevoked: true,
        revokedAt: new Date().toISOString(),
        revokedReason: reason,
      };
      localInvitations[index] = updated;
      return updated;
    }
  },
};
