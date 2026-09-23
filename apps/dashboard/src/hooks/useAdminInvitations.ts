import { useState, useEffect, useCallback } from 'react';
import { invitationsService } from '../services/invitations.service.ts';
import type { CreateInvitationDto, InvitationToken } from '../types/invitation.types.ts';

export function useAdminInvitations() {
  const [invitations, setInvitations] = useState<InvitationToken[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invitationsService.getAll();
      setInvitations(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las invitaciones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const createInvitation = useCallback(async (dto: CreateInvitationDto) => {
    const created = await invitationsService.create(dto);
    setInvitations((prev) => [created, ...prev]);
    return created;
  }, []);

  const revokeInvitation = useCallback(async (id: string, reason: string) => {
    const updated = await invitationsService.revoke(id, reason);
    setInvitations((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  }, []);

  return {
    invitations,
    isLoading,
    error,
    refresh: fetchInvitations,
    createInvitation,
    revokeInvitation,
  };
}
