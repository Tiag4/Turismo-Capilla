import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useIsMobile } from '../../hooks/useIsMobile';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

type RenderPhase = 'unmounted' | 'entering' | 'entered' | 'exiting';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  const isMobile = useIsMobile(640);
  const [renderPhase, setRenderPhase] = useState<RenderPhase>(isOpen ? 'entering' : 'unmounted');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useBodyScrollLock(renderPhase !== 'unmounted');

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (isOpen) {
      setRenderPhase('entering');
      const rAF1 = requestAnimationFrame(() => {
        const rAF2 = requestAnimationFrame(() => {
          setRenderPhase('entered');
        });
        return () => cancelAnimationFrame(rAF2);
      });
      return () => cancelAnimationFrame(rAF1);
    } else {
      setRenderPhase((prev) => (prev === 'unmounted' ? 'unmounted' : 'exiting'));
      timerRef.current = setTimeout(() => {
        setRenderPhase('unmounted');
      }, 260);
    }
  }, [isOpen]);

  useEffect(() => {
    if (renderPhase === 'unmounted') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderPhase, onClose]);

  if (renderPhase === 'unmounted' || typeof document === 'undefined') return null;

  const isEntered = renderPhase === 'entered';

  const maxWidthStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[maxWidth];

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex ${
        isMobile ? 'items-end' : 'items-center'
      } justify-center p-0 ${!isMobile ? 'sm:p-6' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#22201E]/60 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          isEntered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Surface: Slide up/down on mobile, Appearance zoom/fade on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${maxWidthStyles} ${
          isMobile ? 'max-h-[92vh] rounded-t-3xl border-b-0' : 'max-h-[85vh] rounded-2xl'
        } bg-[#FAF8F5] border border-[var(--color-sand-300)] shadow-2xl overflow-hidden z-10 flex flex-col will-change-transform transform-gpu ${
          isMobile
            ? `transition-transform duration-260 ${
                isEntered ? 'translate-y-0 ease-out' : 'translate-y-full ease-in pointer-events-none'
              }`
            : `transition-all duration-200 ${
                isEntered ? 'scale-100 opacity-100 translate-y-0 ease-out' : 'scale-95 opacity-0 translate-y-2 ease-in pointer-events-none'
              }`
        }`}
      >
        {/* Mobile Drag Handle Pill */}
        {isMobile && (
          <div className="pt-3 pb-1 flex justify-center shrink-0 bg-white">
            <div className="w-12 h-1.5 bg-[var(--color-sand-300)] rounded-full" />
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[var(--color-sand-200)] bg-white shrink-0">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit']">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-1 text-xs text-[var(--color-sand-500)] font-medium">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
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
    </div>,
    document.body
  );
};
