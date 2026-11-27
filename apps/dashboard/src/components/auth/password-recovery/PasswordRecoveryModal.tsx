import React from 'react';
import { Mail, KeyRound, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Modal } from '../../ui/Modal.tsx';
import { Input } from '../../ui/Input.tsx';
import { Button } from '../../ui/Button.tsx';
import { usePasswordRecovery } from './usePasswordRecovery.ts';

export interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    infoMessage,
    handleRequestCode,
    handleResetPassword,
    handleFinish,
    resetFlow,
  } = usePasswordRecovery(() => {
    onClose();
  });

  const handleModalClose = () => {
    resetFlow();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        step === 'SUCCESS'
          ? 'Contraseña Restablecida'
          : step === 'ENTER_OTP'
          ? 'Ingresá el Código de Seguridad'
          : 'Recuperar Contraseña'
      }
      subtitle={
        step === 'SUCCESS'
          ? 'Tu acceso ha sido actualizado satisfactoriamente'
          : step === 'ENTER_OTP'
          ? `Te enviamos un código de 6 dígitos a ${email}`
          : 'Ingresá tu correo oficial para recibir un código de verificación'
      }
      maxWidth="md"
    >
      <div className="py-2">
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700"
          >
            {error}
          </div>
        )}

        {infoMessage && step !== 'SUCCESS' && (
          <div className="mb-4 rounded-xl border border-[var(--color-emerald-portal-200)] bg-[var(--color-emerald-portal-50)] p-3 text-xs text-[var(--color-emerald-portal-800)] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[var(--color-emerald-portal-600)] mt-0.5" />
            <span>{infoMessage}</span>
          </div>
        )}

        {step === 'REQUEST_CODE' && (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
            <p className="text-sm text-[var(--color-sand-600)] leading-relaxed">
              Enviaremos un código numérico temporal de 6 dígitos válido por 15 minutos para que puedas definir una nueva contraseña.
            </p>

            <Input
              label="Correo Electrónico Registrado"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-email@capillaturismo.com.ar"
              autoComplete="email"
              autoFocus
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="terracotta" size="sm" isLoading={isLoading}>
                <Mail className="w-4 h-4" />
                <span>Enviar Código</span>
              </Button>
            </div>
          </form>
        )}

        {step === 'ENTER_OTP' && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <Input
                label="Código OTP (6 Dígitos)"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="text-center font-mono tracking-widest text-lg font-bold"
                autoFocus
                required
              />
              <span className="block text-[11px] text-[var(--color-sand-400)] mt-1">
                Verificá tu casilla de correo o spam (expira en 15 minutos).
              </span>
            </div>

            <Input
              label="Nueva Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              required
            />

            <Input
              label="Confirmar Nueva Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí la nueva contraseña"
              autoComplete="new-password"
              required
            />

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => resetFlow()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-sand-500)] hover:text-[var(--color-sand-800)] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cambiar correo</span>
              </button>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleModalClose}>
                  Cancelar
                </Button>
                <Button type="submit" variant="terracotta" size="sm" isLoading={isLoading}>
                  <KeyRound className="w-4 h-4" />
                  <span>Restablecer</span>
                </Button>
              </div>
            </div>
          </form>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-4 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--color-emerald-portal-50)] text-[var(--color-emerald-portal-600)] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-lg text-[var(--color-sand-900)] font-['Outfit']">
              ¡Contraseña Actualizada!
            </h3>
            <p className="text-sm text-[var(--color-sand-600)] max-w-sm">
              Tu contraseña fue restablecida con éxito. Ya podés ingresar a tu panel con tus nuevas credenciales.
            </p>

            <Button
              type="button"
              variant="terracotta"
              size="md"
              onClick={handleFinish}
              className="mt-2 w-full max-w-xs"
            >
              Iniciar Sesión Ahora
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
