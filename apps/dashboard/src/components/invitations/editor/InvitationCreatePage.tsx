import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Select } from '../../ui/Select.tsx';
import { invitationsService } from '../../../services/invitations.service.ts';
import type { CreateInvitationDto } from '../../../types/invitation.types.ts';

export interface InvitationCreatePageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const InvitationCreatePage: React.FC<InvitationCreatePageProps> = ({
  onBack,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresá el correo electrónico del titular del establecimiento.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const dto: CreateInvitationDto = {
        email: email.trim(),
        expiresInDays: Number(expiresInDays),
      };
      await invitationsService.create(dto);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al emitir la invitación oficial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              <Mail className="w-4 h-4" />
              <span>Invitaciones Oficiales a Prestadores</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              Emitir Invitación a Prestador Habilitado
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="emerald"
            isLoading={isSubmitting}
            onClick={handleSubmit}
            className="font-bold shadow-xs"
          >
            <Send className="w-4 h-4 mr-1.5" />
            <span>Generar y Enviar</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Security notice */}
      <div className="border-l-4 border-emerald-600 bg-sand-100/50 p-4 rounded-r-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs font-bold text-sand-900 uppercase tracking-wider">
            Garantía Institucional de Seguridad y Verificación
          </h2>
          <p className="text-xs text-sand-600 leading-relaxed">
            Cada enlace de invitación emitido es de uso único y valida que el alojamiento fue inspeccionado y habilitado por la Secretaría de Turismo de Capilla del Monte antes de quedar visible para turistas.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 shadow-xs space-y-5">
        <Input
          label="Correo Electrónico del Titular / Administrador"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="titular.cabanas@gmail.com"
          helperText="El prestador recibirá este enlace de acceso único para registrar sus establecimientos y tarifas."
          required
        />

        <div>
          <Select
            label="Plazo de Validez del Enlace"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            options={[
              { value: '3', label: '3 días corridos' },
              { value: '7', label: '7 días corridos (Recomendado por la Secretaría)' },
              { value: '14', label: '14 días corridos' },
              { value: '30', label: '30 días corridos' },
            ]}
          />
          <p className="text-[11px] text-sand-500 mt-1">
            Una vez vencido el plazo, el enlace quedará inhabilitado automáticamente.
          </p>
        </div>
      </form>
    </div>
  );
};
