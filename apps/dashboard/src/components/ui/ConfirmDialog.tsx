import React, { useEffect, useState, useCallback } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button.tsx';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'primary' | 'emerald';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  isLoading = false,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (isLoading) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      onClose();
    }, 180);
  }, [isLoading, onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    } else if (shouldRender && !isClosing) {
      handleClose();
    }
  }, [isOpen, shouldRender, isClosing, handleClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && shouldRender && !isLoading) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isLoading, handleClose]);

  if (!shouldRender) return null;

  const iconMap = {
    danger: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
    primary: <CheckCircle2 className="w-5 h-5 text-[var(--color-terracotta-600)]" />,
    emerald: <CheckCircle2 className="w-5 h-5 text-[#005530]" />,
  };

  const buttonVariantMap = {
    danger: 'danger' as const,
    warning: 'terracotta' as const,
    primary: 'terracotta' as const,
    emerald: 'emerald' as const,
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#22201E]/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Surface */}
      <div
        className={`relative w-full max-w-md bg-white border border-[var(--color-sand-300)] rounded-2xl shadow-xl overflow-hidden z-10 transition-all duration-200 transform ${
          isClosing ? 'scale-95 translate-y-1 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)] flex items-center justify-center shrink-0">
                {iconMap[variant]}
              </div>
              <h3
                id="confirm-dialog-title"
                className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']"
              >
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              aria-label="Cerrar confirmación"
              className="p-1 rounded-lg text-[var(--color-sand-400)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p
            id="confirm-dialog-desc"
            className="text-xs text-[var(--color-sand-600)] leading-relaxed pl-1"
          >
            {description}
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-sand-200)] mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isLoading}
              className="text-xs"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant={buttonVariantMap[variant]}
              size="sm"
              onClick={onConfirm}
              isLoading={isLoading}
              className="text-xs font-bold shadow-xs"
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
