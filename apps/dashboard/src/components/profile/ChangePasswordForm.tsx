import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { ChangePasswordPayload } from '../../types/auth.types.ts';

export interface ChangePasswordFormProps {
  onSubmit: (payload: ChangePasswordPayload) => Promise<unknown>;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setFeedback({ type: 'error', message: 'Ingresá tu contraseña actual.' });
      return;
    }
    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'La nueva contraseña debe tener al menos 8 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);
    try {
      await onSubmit({ currentPassword, newPassword });
      setFeedback({ type: 'success', message: 'Tu contraseña fue modificada exitosamente.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Error al cambiar la contraseña.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-sand-200)] shadow-xs p-6 space-y-5">
      <div className="pb-3 border-b border-[var(--color-sand-200)]">
        <h3 className="text-base font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
          Seguridad & Contraseña
        </h3>
        <p className="text-xs text-[var(--color-sand-500)] mt-0.5">
          Actualizá tu clave de acceso para mayor seguridad.
        </p>
      </div>

      {feedback && (
        <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${
          feedback.type === 'success'
            ? 'bg-[var(--color-emerald-portal-50)] text-[var(--color-emerald-portal-700)] border border-[var(--color-emerald-portal-200)]'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-[var(--color-emerald-portal-600)] shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div>
        <label htmlFor="p-current-pass" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">
          Contraseña Actual *
        </label>
        <div className="relative">
          <input
            id="p-current-pass"
            type={showCurrent ? 'text' : 'password'}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-sand-400)] hover:text-[var(--color-sand-600)] cursor-pointer"
            aria-label={showCurrent ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p-new-pass" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">
            Nueva Contraseña *
          </label>
          <div className="relative">
            <input
              id="p-new-pass"
              type={showNew ? 'text' : 'password'}
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-sand-400)] hover:text-[var(--color-sand-600)] cursor-pointer"
              aria-label={showNew ? 'Ocultar nueva contraseña' : 'Ver nueva contraseña'}
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="p-confirm-pass" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">
            Confirmar Nueva Contraseña *
          </label>
          <input
            id="p-confirm-pass"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
            placeholder="Repetí la nueva clave"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-[var(--color-sand-100)]">
        <Button
          type="submit"
          variant="terracotta"
          size="md"
          isLoading={isLoading}
          className="font-bold cursor-pointer"
        >
          Actualizar Contraseña
        </Button>
      </div>
    </form>
  );
};
