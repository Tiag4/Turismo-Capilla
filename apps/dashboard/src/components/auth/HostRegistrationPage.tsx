import React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { HostRegistrationForm } from './host-registration/HostRegistrationForm.tsx';
import { useHostRegistration } from './host-registration/useHostRegistration.ts';

function goToDashboard(): void {
  window.location.assign('/');
}

export const HostRegistrationPage: React.FC = () => {
  const {
    status,
    invitation,
    form,
    errors,
    submitError,
    isSubmitting,
    updateField,
    submit,
  } = useHostRegistration();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF8F5]">
      <div className="w-full max-w-lg bg-white border border-[var(--color-sand-200)] rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-7">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white mx-auto shadow-xs mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Registro de Prestador
          </h1>
          <p className="mt-1 text-xs text-[var(--color-sand-400)] font-medium">
            Cámara de Turismo de Capilla del Monte — Invitación oficial
          </p>
        </div>

        {status === 'validating' && (
          <div className="py-12 flex flex-col items-center gap-3 text-center">
            <Loader2 className="w-8 h-8 text-[var(--color-emerald-portal-600)] animate-spin" />
            <p className="text-sm font-semibold text-[var(--color-sand-700)]">
              Verificando la invitación...
            </p>
          </div>
        )}

        {status === 'invalid' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Invitación no válida
              </h2>
              <p className="text-sm text-[var(--color-sand-500)] max-w-sm">
                {submitError || 'El enlace es inválido, expiró o ya fue utilizado.'}
              </p>
            </div>
            <Button type="button" variant="outline" onClick={goToDashboard}>
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al acceso</span>
            </Button>
          </div>
        )}

        {status === 'ready' && (
          <div className="space-y-5">
            {invitation && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 flex items-start gap-3">
                <CalendarDays className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">Invitación verificada</span>
                  <span>
                    Autorizada para {invitation.email}. Vence el{' '}
                    {new Date(invitation.expiresAt).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    .
                  </span>
                </div>
              </div>
            )}

            <HostRegistrationForm
              form={form}
              errors={errors}
              submitError={submitError}
              isSubmitting={isSubmitting}
              onChange={updateField}
              onSubmit={submit}
            />
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Cuenta creada correctamente
              </h2>
              <p className="text-sm text-[var(--color-sand-500)] max-w-sm">
                Ya podés administrar tus alojamientos, reservas y tarifas desde el panel de prestadores.
              </p>
            </div>
            <Button type="button" variant="emerald" onClick={goToDashboard} className="font-bold">
              <span>Ingresar al panel</span>
            </Button>
          </div>
        )}

        <div className="mt-7 pt-5 border-t border-[var(--color-sand-200)] text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-sand-500)] hover:text-[var(--color-sand-900)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al acceso de prestadores</span>
          </a>
        </div>
      </div>
    </div>
  );
};
