import { useState, useEffect, useRef, useCallback } from 'react';

export interface FloatingCoords {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number;
  placement: 'top' | 'bottom';
  align: 'left' | 'right';
}

interface UseSmartFloatingOptions {
  isOpen: boolean;
  onClose: () => void;
  preferredPlacement?: 'top' | 'bottom';
  estimatedHeight?: number;
  estimatedWidth?: number;
}

export function useSmartFloating({
  isOpen,
  onClose,
  preferredPlacement = 'bottom',
  estimatedHeight = 360,
  estimatedWidth = 320,
}: UseSmartFloatingOptions) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<FloatingCoords | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Smart vertical placement (Krug / Gestalt: prevent clipping & collision)
    let placement: 'top' | 'bottom' = preferredPlacement;
    if (preferredPlacement === 'bottom') {
      if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
        placement = 'top';
      }
    } else {
      if (spaceAbove < estimatedHeight && spaceBelow > spaceAbove) {
        placement = 'bottom';
      }
    }

    // Smart horizontal alignment
    let align: 'left' | 'right' = 'left';
    if (rect.left + estimatedWidth > viewportWidth - 16) {
      align = 'right';
    }

    const calculated: FloatingCoords = {
      placement,
      align,
      width: rect.width,
    };

    if (placement === 'bottom') {
      calculated.top = rect.bottom + 8;
    } else {
      calculated.bottom = viewportHeight - rect.top + 8;
    }

    if (align === 'left') {
      calculated.left = Math.max(12, Math.min(rect.left, viewportWidth - estimatedWidth - 16));
    } else {
      calculated.right = Math.max(12, viewportWidth - rect.right);
    }

    setCoords(calculated);
  }, [preferredPlacement, estimatedHeight, estimatedWidth]);

  useEffect(() => {
    if (!isOpen) return;

    calculatePosition();

    // Recalculate on scroll, resize, or zoom
    const handleReposition = () => {
      calculatePosition();
    };

    // Close on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        onClose();
      }
    };

    // Close on Escape
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('resize', handleReposition, { passive: true });
    window.addEventListener('scroll', handleReposition, { passive: true, capture: true });
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, calculatePosition, onClose]);

  return {
    triggerRef,
    popoverRef,
    coords,
  };
}
