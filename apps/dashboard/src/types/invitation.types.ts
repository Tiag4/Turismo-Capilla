export interface InvitationToken {
  id: string;
  token: string;
  email: string;
  expiresAt: string;
  usedAt?: string | null;
  createdAt: string;
  isRevoked?: boolean;
  revokedAt?: string | null;
  revokedReason?: string | null;
  createdBy?: {
    name: string;
    lastName: string;
  };
}

export interface CreateInvitationDto {
  email: string;
  expiresInDays?: number;
}

export interface RevokeInvitationDto {
  reason: string;
}
