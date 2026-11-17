import React, { useState, useRef, useEffect, useId, cloneElement, isValidElement } from 'react';
import { HelpCircle } from 'lucide-react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delayMs?: number;
  className?: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  delayMs = 120,
  className = '',
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideTooltip();
      }
    };
    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  if (!content) {
    return <>{children}</>;
  }

  // Positioning classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  // Arrow classes
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--color-sand-900)] border-x-transparent border-b-transparent border-[5px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--color-sand-900)] border-x-transparent border-t-transparent border-[5px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--color-sand-900)] border-y-transparent border-r-transparent border-[5px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--color-sand-900)] border-y-transparent border-l-transparent border-[5px]',
  }[position];

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {isValidElement(children) ? (
        cloneElement(children as React.ReactElement<any>, {
          'aria-describedby': isVisible ? tooltipId : undefined,
        })
      ) : (
        <span>{children}</span>
      )}

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute z-[70] pointer-events-none px-2.5 py-1.5 rounded-lg bg-[var(--color-sand-900)] text-[var(--color-sand-50)] text-[11px] leading-relaxed font-medium shadow-lg border border-[var(--color-sand-700)]/40 max-w-xs text-center whitespace-normal animate-in fade-in zoom-in-95 duration-100 ${positionClasses}`}
        >
          {content}
          <div className={`absolute w-0 h-0 ${arrowClasses}`} />
        </div>
      )}
    </div>
  );
};

export interface InfoTooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  className?: string;
  iconClassName?: string;
  ariaLabel?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({
  content,
  position = 'top',
  className = '',
  iconClassName = 'w-3.5 h-3.5',
  ariaLabel = 'Más información',
}) => {
  return (
    <Tooltip content={content} position={position} className={className}>
      <button
        type="button"
        aria-label={ariaLabel}
        tabIndex={0}
        onClick={(e) => e.preventDefault()}
        className="text-[var(--color-sand-400)] hover:text-[var(--color-terracotta-600)] transition-colors inline-flex items-center cursor-help focus:outline-none focus:text-[var(--color-terracotta-600)]"
      >
        <HelpCircle className={iconClassName} />
      </button>
    </Tooltip>
  );
};
