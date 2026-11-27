import React from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import type {
  HostRegistrationErrors,
  HostRegistrationFormState,
} from './useHostRegistration.ts';

export interface HostRegistrationFormProps {
  form: HostRegistrationFormState;
  errors: HostRegistrationErrors;
  submitError: string | null;
  isSubmitting: boolean;
  onChange: (field: keyof HostRegistrationFormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const HostRegistrationForm: React.FC<HostRegistrationFormProps> = ({
  form,
  errors,
  submitError,
  isSubmitting,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Nombre"
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="María"
          autoComplete="given-name"
          error={errors.name}
          required
        />
        <Input
          label="Apellido"
          value={form.lastName}
          onChange={(event) => onChange('lastName', event.target.value)}
          placeholder="Gómez"
          autoComplete="family-name"
          error={errors.lastName}
          required
        />
      </div>

      <Input
        label="Correo Electrónico Autorizado"
        type="email"
        value={form.email}
        readOnly
        helperText="Este correo fue verificado en la invitación oficial."
        error={errors.email}
        required
      />

      <Input
        label="Teléfono"
        type="tel"
        value={form.phone}
        onChange={(event) => onChange('phone', event.target.value)}
        placeholder="+54 9 3548 000000"
        autoComplete="tel"
        error={errors.phone}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(event) => onChange('password', event.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          error={errors.password}
          required
        />
        <Input
          label="Repetir Contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(event) => onChange('confirmPassword', event.target.value)}
          placeholder="Repetí tu contraseña"
          autoComplete="new-password"
          error={errors.confirmPassword}
          required
        />
      </div>

      {submitError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-semibold text-rose-800"
        >
          {submitError}
        </div>
      )}

      <div className="flex items-center gap-2 text-[11px] text-sand-500 font-medium">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>Tu cuenta quedará habilitada con rol de prestador turístico.</span>
      </div>

      <Button
        type="submit"
        variant="emerald"
        size="lg"
        isLoading={isSubmitting}
        className="w-full mt-1 font-bold"
      >
        <span>Crear Cuenta de Prestador</span>
        <ArrowRight className="w-4 h-4" />
      </Button>

      <div className="flex items-center justify-center gap-2 text-[11px] text-sand-400">
        <Mail className="w-3.5 h-3.5" />
        <span>Los datos ingresados deben coincidir con la habilitación municipal.</span>
      </div>
    </form>
  );
};
