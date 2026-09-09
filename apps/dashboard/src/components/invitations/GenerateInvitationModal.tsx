import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import type { CreateInvitationDto } from '../../types/invitation.types.ts';

export interface GenerateInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateInvitationDto) => Promise<void>;
  isLoading: boolean;
}

export const GenerateInvitationModal: React.FC<GenerateInvitationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [email, setEmail] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await onSubmit({
      email,
      expiresInDays: Number(expiresInDays),
    });
    setEmail('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Emitir Token de Adhesión para Prestador"
      subtitle="Exclusivo Comisión de Turismo de Capilla del Monte (Anti-Estafas)"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Correo Electrónico del Prestador Habilitado"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="titular.cabanas@gmail.com"
          helperText="El prestador usará este correo para registrarse con el token emitido."
          required
        />

        <Select
          label="Vencimiento del Token de Registro"
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
          options={[
            { value: '3', label: '3 días' },
            { value: '7', label: '7 días (Recomendado)' },
            { value: '14', label: '14 días' },
            { value: '30', label: '30 días' },
          ]}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="emerald" isLoading={isLoading}>
            <KeyRound className="w-4 h-4" />
            <span>Generar Token Seguro</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
