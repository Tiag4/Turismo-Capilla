import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAdminInvitations } from '../../hooks/useAdminInvitations.ts';
import { InvitationList } from './InvitationList.tsx';
import { GenerateInvitationModal } from './GenerateInvitationModal.tsx';
import { RevokeInvitationModal } from './RevokeInvitationModal.tsx';
import { Button } from '../ui/Button.tsx';
import type { CreateInvitationDto, InvitationToken } from '../../types/invitation.types.ts';

export const InvitationManager: React.FC = () => {
  const { invitations, isLoading, createInvitation, revokeInvitation } = useAdminInvitations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Revoke state
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokingInvitation, setRevokingInvitation] = useState<InvitationToken | null>(null);
  const [isRevoking, setIsRevoking] = useState(false);

  const handleCreate = async (dto: CreateInvitationDto) => {
    setIsSubmitting(true);
    try {
      await createInvitation(dto);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRevoke = (invitation: InvitationToken) => {
    setRevokingInvitation(invitation);
    setIsRevokeModalOpen(true);
  };

  const handleRevoke = async (id: string, reason: string) => {
    setIsRevoking(true);
    try {
      await revokeInvitation(id, reason);
      setIsRevokeModalOpen(false);
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-sand-900 font-['Outfit']">
            Tokens de Invitación y Adhesión
          </h2>
          <p className="text-xs text-sand-500 font-medium">
            Solo los prestadores que reciben un token seguro emitido por la Comisión pueden registrarse
          </p>
        </div>
        <Button variant="emerald" onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="w-4 h-4" />
          <span>Emitir Token Prestador</span>
        </Button>
      </div>

      {/* Institutional Security Notice */}
      <div className="border-l-2 border-emerald-600 pl-3.5 py-1 text-xs text-sand-700 leading-relaxed">
        <span className="font-bold text-sand-900 mr-1">
          Garantía Institucional:
        </span>
        Cada token es de uso único y valida que la propiedad fue formalmente inspeccionada y habilitada por la Secretaría de Turismo de Capilla del Monte antes de recibir pagos o reservas.
      </div>

      {/* List */}
      <InvitationList
        invitations={invitations}
        isLoading={isLoading}
        onOpenRevoke={handleOpenRevoke}
      />

      {/* Generate Modal */}
      <GenerateInvitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      {/* Revoke Modal */}
      <RevokeInvitationModal
        isOpen={isRevokeModalOpen}
        onClose={() => setIsRevokeModalOpen(false)}
        invitation={revokingInvitation}
        onRevoke={handleRevoke}
        isLoading={isRevoking}
      />
    </div>
  );
};
