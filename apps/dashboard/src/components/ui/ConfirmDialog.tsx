import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
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

const ICON_MAP = {
  danger: <AlertTriangle className="w-5 h-5 text-rose-600" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-600" />,
  primary: <CheckCircle2 className="w-5 h-5 text-terracotta-600" />,
  emerald: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
};

const BUTTON_VARIANT_MAP: Record<ConfirmDialogVariant, 'danger' | 'terracotta' | 'emerald'> = {
  danger: 'danger',
  warning: 'terracotta',
  primary: 'terracotta',
  emerald: 'emerald',
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, description,
  confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'warning', isLoading = false,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isOpen) {
      setShouldRender(true);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const rAF = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
      return () => {
        cancelAnimationFrame(rAF);
        document.body.style.overflow = prevOverflow;
      };
    } else {
      setIsVisible(false);
      timerRef.current = setTimeout(() => setShouldRender(false), 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#22201E]/60 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => { if (!isLoading) onClose(); }}
        aria-hidden="true"
      />

      {/* Surface */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-white border border-sand-300 rounded-2xl shadow-2xl overflow-hidden z-10 transition-all duration-200 ease-out transform ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-1 opacity-0'
        }`}
      >
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-center shrink-0">
                {ICON_MAP[variant]}
              </div>
              <h3 id="confirm-dialog-title" className="text-base font-bold text-sand-900 font-['Outfit']">
                {title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => { if (!isLoading) onClose(); }}
              disabled={isLoading}
              aria-label="Cerrar confirmación"
              className="p-1 rounded-lg text-sand-400 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p id="confirm-dialog-desc" className="text-xs text-sand-600 leading-relaxed pl-1">
            {description}
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-sand-200 mt-1">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isLoading} className="text-xs">
              {cancelLabel}
            </Button>
            <Button type="button" variant={BUTTON_VARIANT_MAP[variant]} size="sm" onClick={onConfirm} isLoading={isLoading} className="text-xs font-bold shadow-xs">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
