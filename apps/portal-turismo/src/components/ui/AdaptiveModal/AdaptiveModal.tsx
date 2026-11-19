import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import type { AdaptiveModalProps } from './types';

type RenderPhase = 'unmounted' | 'entering' | 'entered' | 'exiting';

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-[96vw]',
};

export const AdaptiveModal: React.FC<AdaptiveModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'lg',
  maxWidthClassName,
  heightClassName,
  maxHeightClassName,
  className = '',
  bodyClassName = '',
  headerClassName = '',
  closeOnBackdropClick = true,
  hideHeader = false,
  hideCloseButton = false,
  closeButtonAriaLabel = 'Cerrar',
  ariaLabel,
  zIndexClassName = 'z-[120]',
  renderHeaderAction,
}) => {
  const isMobile = useIsMobile(640);
  const [renderPhase, setRenderPhase] = useState<RenderPhase>(isOpen ? 'entering' : 'unmounted');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Body scroll lock
  useBodyScrollLock(renderPhase !== 'unmounted');

  // Animation lifecycle
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
      // Wait for exit transition to finish before unmounting (260ms)
      timerRef.current = setTimeout(() => {
        setRenderPhase('unmounted');
      }, 260);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (renderPhase === 'unmounted') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderPhase, onClose]);

  if (renderPhase === 'unmounted' || typeof document === 'undefined') {
    return null;
  }

  const isEntered = renderPhase === 'entered';
  const resolvedMaxWidth = maxWidthClassName || SIZE_CLASSES[size] || 'max-w-2xl';
  const resolvedAriaLabel = ariaLabel || (typeof title === 'string' ? title : 'Ventana emergente');

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndexClassName} flex ${
        isMobile ? 'items-end' : 'items-center'
      } justify-center p-0 ${!isMobile ? 'sm:p-4 md:p-6' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={resolvedAriaLabel}
    >
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          isEntered ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Surface Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${resolvedMaxWidth} ${heightClassName || ''} ${
          maxHeightClassName || (isMobile ? 'max-h-[92vh]' : 'max-h-[88vh]')
        } bg-white border border-sand-300 shadow-2xl overflow-hidden z-10 flex flex-col will-change-transform transform-gpu ${
          isMobile
            ? `rounded-t-3xl border-b-0 transition-transform duration-260 ${
                isEntered
                  ? 'translate-y-0 ease-out'
                  : 'translate-y-full ease-in pointer-events-none'
              }`
            : `rounded-2xl transition-all duration-200 ${
                isEntered
                  ? 'scale-100 opacity-100 translate-y-0 ease-out'
                  : 'scale-95 opacity-0 translate-y-2 ease-in pointer-events-none'
              }`
        } ${className}`}
      >
        {/* Mobile Drag Handle Pill */}
        {isMobile && (
          <div className="pt-3 pb-1 flex justify-center shrink-0 bg-white">
            <div className="w-12 h-1.5 bg-sand-300 rounded-full" />
          </div>
        )}

        {/* Modal / Bottomsheet Header */}
        {!hideHeader && (title || subtitle || !hideCloseButton) && (
          <div
            className={`flex items-start justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5 border-b border-sand-200 bg-white shrink-0 ${headerClassName}`}
          >
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="font-display font-extrabold text-lg sm:text-xl text-sand-900 leading-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs sm:text-sm text-sand-500 font-medium truncate">
                  {subtitle}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {renderHeaderAction}
              {!hideCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeButtonAriaLabel}
                  className="p-1.5 rounded-xl text-sand-500 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body Content */}
        <div className={`flex-1 overflow-y-auto overscroll-contain ${bodyClassName}`}>
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-4 sm:p-5 border-t border-sand-200 bg-sand-50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
