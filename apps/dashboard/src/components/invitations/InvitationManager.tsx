import React, { useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { useAdminInvitations } from '../../hooks/useAdminInvitations.ts';
import { InvitationList } from './InvitationList.tsx';
import { GenerateInvitationModal } from './GenerateInvitationModal.tsx';
import { Button } from '../ui/Button.tsx';
import type { CreateInvitationDto } from '../../types/invitation.types.ts';

export const InvitationManager: React.FC = () => {
  const { invitations, isLoading, createInvitation } = useAdminInvitations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (dto: CreateInvitationDto) => {
    setIsSubmitting(true);
    try {
      await createInvitation(dto);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Tokens de Invitación y Adhesión
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Solo los prestadores que reciben un token seguro emitido por la Comisión pueden registrarse
          </p>
        </div>
        <Button variant="emerald" onClick={() => setIsModalOpen(true)} size="md">
          <Plus className="w-4 h-4" />
          <span>Emitir Token Prestador</span>
        </Button>
      </div>

      {/* Institutional Security Notice */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex items-start gap-3 text-xs text-[var(--color-sand-800)]">
        <ShieldAlert className="w-5 h-5 text-[var(--color-emerald-portal-600)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--color-sand-900)] block mb-0.5">
            Garantía Institucional Anti-Estafas
          </span>
          Cada token es de uso único y valida que la propiedad fue formalmente inspeccionada y habilitada por la Secretaría de Turismo de Capilla del Monte antes de recibir pagos o reservas.
        </div>
      </div>

      {/* List */}
      <InvitationList invitations={invitations} isLoading={isLoading} />

      {/* Modal */}
      <GenerateInvitationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />
    </div>
  );
};
