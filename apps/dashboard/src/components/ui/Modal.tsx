import React, { useEffect, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShouldRender(false);
      onClose();
    }, 200); // 200ms transition time for smooth fade/slide out
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      // Mandatory scroll lock
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
      if (e.key === 'Escape' && shouldRender) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, handleClose]);

  if (!shouldRender) return null;

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with real overlay layer */}
      <div
        className="fixed inset-0 bg-[#22201E]/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Surface with animated slide-in and slide-out */}
      <div
        className={`relative w-full ${maxWidthStyles} bg-[#FAF8F5] border border-[var(--color-sand-300)] rounded-2xl shadow-xl overflow-hidden z-10 transition-all duration-200 transform ${
          isClosing ? 'scale-95 translate-y-2 opacity-0' : 'scale-100 translate-y-0 opacity-100'
        }`}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[var(--color-sand-200)] bg-white">
          <div>
            <h3 className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-[var(--color-sand-400)] font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
