import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { authService } from '../../../services/auth.service.ts';
import { invitationsService } from '../../../services/invitations.service.ts';
import type { ValidateInvitationResponse } from '../../../types/invitation.types.ts';

export interface HostRegistrationFormState {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type HostRegistrationErrors = Partial<Record<keyof HostRegistrationFormState, string>>;

export type HostRegistrationStatus = 'validating' | 'ready' | 'invalid' | 'success';

const INITIAL_FORM: HostRegistrationFormState = {
  name: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

function validateForm(form: HostRegistrationFormState): HostRegistrationErrors {
  const errors: HostRegistrationErrors = {};

  if (form.name.trim().length < 2) {
    errors.name = 'Ingresá tu nombre (mínimo 2 caracteres).';
  }
  if (form.lastName.trim().length < 2) {
    errors.lastName = 'Ingresá tu apellido (mínimo 2 caracteres).';
  }
  if (!form.email.trim()) {
    errors.email = 'La invitación no tiene un correo asociado.';
  }
  if (form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

export function useHostRegistration() {
  const token = useMemo(
    () => new URLSearchParams(window.location.search).get('token')?.trim() ?? '',
    []
  );

  const [status, setStatus] = useState<HostRegistrationStatus>('validating');
  const [invitation, setInvitation] = useState<ValidateInvitationResponse | null>(null);
  const [form, setForm] = useState<HostRegistrationFormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<HostRegistrationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      setSubmitError('El enlace no incluye un token de invitación válido.');
      return;
    }

    let isActive = true;

    invitationsService
      .validate(token)
      .then((response) => {
        if (!isActive) return;

        if (!response.valid) {
          setStatus('invalid');
          setSubmitError(response.message || 'La invitación no es válida o ya fue utilizada.');
          return;
        }

        setInvitation(response);
        setForm((current) => ({ ...current, email: response.email }));
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        setStatus('invalid');
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'No se pudo validar la invitación. Intentá nuevamente.'
        );
      });

    return () => {
      isActive = false;
    };
  }, [token]);

  const updateField = useCallback(
    (field: keyof HostRegistrationFormState, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
      setErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
      setSubmitError(null);
    },
    []
  );

  const submit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextErrors = validateForm(form);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await authService.registerHost({
          token,
          email: form.email.trim(),
          password: form.password,
          name: form.name.trim(),
          lastName: form.lastName.trim(),
          phone: form.phone.trim() || undefined,
        });
        setStatus('success');
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'No se pudo crear la cuenta. Intentá nuevamente.'
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, token]
  );

  return {
    token,
    status,
    invitation,
    form,
    errors,
    submitError,
    isSubmitting,
    updateField,
    submit,
  };
}
