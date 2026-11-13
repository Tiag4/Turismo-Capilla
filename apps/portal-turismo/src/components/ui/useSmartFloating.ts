import { useState, useEffect, useRef, useCallback } from 'react';

export interface FloatingCoords {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  width?: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
  align?: 'left' | 'right' | 'center';
  isModal?: boolean;
}

interface UseSmartFloatingOptions {
  isOpen: boolean;
  onClose: () => void;
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  estimatedHeight?: number;
  estimatedWidth?: number;
  padding?: number;
}

export function useSmartFloating({
  isOpen,
  onClose,
  preferredPlacement = 'auto',
  estimatedHeight = 380,
  estimatedWidth = 320,
  padding = 12,
}: UseSmartFloatingOptions) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<FloatingCoords | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Mobile / Narrow screen (< 640px): Center as modal for 100% visibility
    if (viewportWidth < 640) {
      setCoords({
        placement: 'center',
        align: 'center',
        isModal: true,
      });
      return;
    }

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceLeft = rect.left;
    const spaceRight = viewportWidth - rect.right;

    let placement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

    // Check if preferred placement was explicit
    if (preferredPlacement === 'left' && spaceLeft >= estimatedWidth + padding) {
      placement = 'left';
    } else if (preferredPlacement === 'right' && spaceRight >= estimatedWidth + padding) {
      placement = 'right';
    } else if (preferredPlacement === 'top') {
      placement = spaceAbove >= estimatedHeight + padding || spaceAbove >= spaceBelow ? 'top' : 'bottom';
    } else if (preferredPlacement === 'bottom') {
      placement = spaceBelow >= estimatedHeight + padding || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    } else {
      // Auto placement: prioritize natural vertical anchoring for dropdowns and popovers
      if (spaceBelow >= estimatedHeight + padding) {
        placement = 'bottom';
      } else if (spaceAbove >= estimatedHeight + padding) {
        placement = 'top';
      } else if (spaceBelow >= spaceAbove) {
        placement = 'bottom';
      } else {
        placement = 'top';
      }
    }

    // Calculate clamped coordinates anchored strictly to trigger
    let calculatedTop: number | undefined;
    let calculatedBottom: number | undefined;
    let calculatedLeft: number;
    const targetWidth = Math.max(estimatedWidth, rect.width);

    if (placement === 'left') {
      calculatedLeft = rect.left - targetWidth - 8;
      calculatedTop = Math.max(padding, Math.min(rect.top, viewportHeight - estimatedHeight - padding));
    } else if (placement === 'right') {
      calculatedLeft = rect.right + 8;
      calculatedTop = Math.max(padding, Math.min(rect.top, viewportHeight - estimatedHeight - padding));
    } else if (placement === 'top') {
      // Anchor via bottom so actual popover height never creates a floating gap above trigger
      calculatedBottom = Math.max(padding, Math.round(viewportHeight - rect.top + 6));
      calculatedLeft = rect.left;
      if (calculatedLeft + targetWidth > viewportWidth - padding) {
        calculatedLeft = Math.max(padding, rect.right - targetWidth);
      }
    } else {
      // bottom
      calculatedTop = Math.max(padding, Math.min(rect.bottom + 6, viewportHeight - estimatedHeight - padding));
      calculatedLeft = rect.left;
      if (calculatedLeft + targetWidth > viewportWidth - padding) {
        calculatedLeft = Math.max(padding, rect.right - targetWidth);
      }
    }

    // Strict horizontal clamping guarantee: never off-screen
    calculatedLeft = Math.max(padding, Math.min(calculatedLeft, viewportWidth - targetWidth - padding));

    setCoords({
      top: calculatedTop !== undefined ? Math.round(calculatedTop) : undefined,
      bottom: calculatedBottom,
      left: Math.round(calculatedLeft),
      placement,
      width: rect.width,
      isModal: false,
    });
  }, [preferredPlacement, estimatedHeight, estimatedWidth, padding]);

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
