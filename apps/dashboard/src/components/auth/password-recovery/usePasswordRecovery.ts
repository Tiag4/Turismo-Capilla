import { useState } from 'react';
import { authService } from '../../../services/auth.service.ts';

export type RecoveryStep = 'REQUEST_CODE' | 'ENTER_OTP' | 'SUCCESS';

export function usePasswordRecovery(onSuccessClose?: () => void) {
  const [step, setStep] = useState<RecoveryStep>('REQUEST_CODE');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFlow = () => {
    setStep('REQUEST_CODE');
    setEmail('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setInfoMessage(null);
    setIsLoading(false);
  };

  const handleRequestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Por favor ingresá tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword({ email: cleanEmail });
      setInfoMessage(response.message);
      setStep('ENTER_OTP');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al procesar la solicitud. Intentá nuevamente.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const cleanCode = code.trim();
    if (!/^\d{6}$/.test(cleanCode)) {
      setError('El código de recuperación debe ser de 6 dígitos numéricos');
      return;
    }

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        email: email.trim(),
        code: cleanCode,
        newPassword,
      });
      setInfoMessage(response.message);
      setStep('SUCCESS');
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Código incorrecto o expirado. Verificá e intentá nuevamente.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    resetFlow();
    if (onSuccessClose) {
      onSuccessClose();
    }
  };

  return {
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
  };
}
