import { apiClient } from './api.client.ts';
import type {
  CreateInvitationDto,
  InvitationToken,
  ValidateInvitationResponse,
} from '../types/invitation.types.ts';

export const invitationsService = {
  async getAll(): Promise<InvitationToken[]> {
    return apiClient.get<InvitationToken[]>('/invitations');
  },

  async create(dto: CreateInvitationDto): Promise<InvitationToken> {
    return apiClient.post<InvitationToken>('/invitations', dto);
  },

  async revoke(id: string, _reason: string): Promise<void> {
    await apiClient.delete<void>(`/invitations/${id}`);
  },

  async validate(token: string): Promise<ValidateInvitationResponse> {
    return apiClient.get<ValidateInvitationResponse>(
      `/invitations/validate/${encodeURIComponent(token)}`
    );
  },
};
