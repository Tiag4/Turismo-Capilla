export interface InvitationToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
  createdBy?: {
    name: string;
    lastName: string;
  };
}

export interface CreateInvitationDto {
  email: string;
  expiresInDays?: number;
}
