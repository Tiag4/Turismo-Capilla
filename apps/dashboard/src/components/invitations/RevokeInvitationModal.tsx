import React, { useState } from 'react';
import { AlertOctagon, Ban } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import type { InvitationToken } from '../../types/invitation.types.ts';

export interface RevokeInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: InvitationToken | null;
  onRevoke: (id: string, reason: string) => Promise<void>;
  isLoading: boolean;
}

export const RevokeInvitationModal: React.FC<RevokeInvitationModalProps> = ({
  isOpen,
  onClose,
  invitation,
  onRevoke,
  isLoading,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!invitation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Por favor ingresá un motivo formal para la revocación.');
      return;
    }
    setError(null);
    await onRevoke(invitation.id, reason.trim());
    setReason('');
    onClose();
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Revocar Invitación de Prestador"
      subtitle="Acción irrevocable de la Secretaría de Turismo"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Institutional Alert */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-950">
            <span className="font-bold block mb-0.5">Atención Operador Municipal</span>
            Al revocar esta invitación, el prestador no podrá utilizar el enlace ni registrar su establecimiento en el portal.
          </div>
        </div>

        {/* Invitation details */}
        <div className="bg-sand-100 p-3 rounded-xl flex flex-col gap-1.5 text-xs text-sand-800">
          <div className="flex justify-between">
            <span className="font-medium text-sand-500">Código de Enlace:</span>
            <span className="font-mono font-bold text-sand-900">{invitation.token}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sand-500">Prestador Convocado:</span>
            <span className="font-semibold text-sand-900">{invitation.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-sand-500">Vence:</span>
            <span>{new Date(invitation.expiresAt).toLocaleDateString('es-AR')}</span>
          </div>
        </div>

        {/* Revocation Reason input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="revoke-reason" className="text-xs font-semibold uppercase tracking-wider text-sand-800">
            Motivo de Revocación Municipal <span className="text-rose-700">*</span>
          </label>
          <textarea
            id="revoke-reason"
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Ej: Prestador no presentó póliza de responsabilidad civil al día o expediente rechazado..."
            className="w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-xs text-sand-900 focus:outline-none focus:border-rose-700 shadow-xs"
          />
          {error && <span className="text-xs text-rose-700 font-semibold">{error}</span>}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="danger" isLoading={isLoading} className="font-bold">
            <Ban className="w-4 h-4 mr-1.5" />
            <span>Confirmar Revocación</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
