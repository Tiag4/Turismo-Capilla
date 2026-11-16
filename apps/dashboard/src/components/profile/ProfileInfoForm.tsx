import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { User, UpdateProfilePayload } from '../../types/auth.types.ts';

export interface ProfileInfoFormProps {
  user: User;
  onSubmit: (payload: UpdateProfilePayload) => Promise<unknown>;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState<UpdateProfilePayload>({
    name: user.name ?? '',
    lastName: user.lastName ?? '',
    phone: user.phone ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.lastName.trim()) {
      setFeedback({ type: 'error', message: 'El nombre y apellido son obligatorios.' });
      return;
    }
    setIsLoading(true);
    setFeedback(null);
    try {
      await onSubmit({
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone?.trim() || undefined,
      });
      setFeedback({ type: 'success', message: 'Tus datos personales fueron actualizados correctamente.' });
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Error al actualizar perfil.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-sand-200)] shadow-xs p-6 space-y-5">
      <div className="pb-3 border-b border-[var(--color-sand-200)]">
        <h3 className="text-base font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
          Información de Contacto
        </h3>
        <p className="text-xs text-[var(--color-sand-500)] mt-0.5">
          Datos personales visibles en la gestión del establecimiento.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p-name" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">Nombre *</label>
          <input
            id="p-name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label htmlFor="p-lastname" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">Apellido *</label>
          <input
            id="p-lastname"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
            placeholder="Tu apellido"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="p-email" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">
            Correo Electrónico (Oficial)
          </label>
          <input
            id="p-email"
            type="email"
            disabled
            value={user.email}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-xs font-medium text-[var(--color-sand-600)] cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="p-phone" className="block text-xs font-bold text-[var(--color-sand-700)] mb-1.5">Teléfono de Contacto</label>
          <input
            id="p-phone"
            name="phone"
            type="tel"
            value={formData.phone ?? ''}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-sand-300)] bg-white text-xs font-medium text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
            placeholder="+54 3548 ..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-[var(--color-sand-100)]">
        <Button
          type="submit"
          variant="terracotta"
          size="md"
          isLoading={isLoading}
        >
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
};
