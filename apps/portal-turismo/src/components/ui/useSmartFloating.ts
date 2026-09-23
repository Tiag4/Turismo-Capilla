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
    } else if (preferredPlacement === 'top' && spaceAbove >= estimatedHeight + padding) {
      placement = 'top';
    } else if (preferredPlacement === 'bottom' && spaceBelow >= estimatedHeight + padding) {
      placement = 'bottom';
    } else {
      // Auto placement: Determine best position based on viewport geometry
      const isInRightColumn = rect.left > viewportWidth * 0.45;

      if (isInRightColumn && spaceLeft >= estimatedWidth + padding + 16) {
        // Lateral left placement: Keeps calendar beside sidebar and avoids top/bottom clipping!
        placement = 'left';
      } else if (spaceBelow >= estimatedHeight + padding) {
        placement = 'bottom';
      } else if (spaceAbove >= estimatedHeight + padding) {
        placement = 'top';
      } else if (spaceLeft >= estimatedWidth + padding) {
        placement = 'left';
      } else if (spaceRight >= estimatedWidth + padding) {
        placement = 'right';
      } else {
        // Fallback: side with maximum vertical space
        placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
      }
    }

    // Calculate clamped coordinates
    let calculatedTop: number;
    let calculatedLeft: number;

    if (placement === 'left') {
      // If trigger has a parent container/grid, align to its left edge
      const parentGrid = triggerRef.current.closest('aside') || triggerRef.current.closest('.grid');
      const referenceLeft = parentGrid ? parentGrid.getBoundingClientRect().left : rect.left;

      calculatedLeft = referenceLeft - estimatedWidth - 12;
      calculatedTop = Math.max(16, Math.min(rect.top, viewportHeight - estimatedHeight - 16));
    } else if (placement === 'right') {
      const parentGrid = triggerRef.current.closest('aside') || triggerRef.current.closest('.grid');
      const referenceRight = parentGrid ? parentGrid.getBoundingClientRect().right : rect.right;

      calculatedLeft = referenceRight + 12;
      calculatedTop = Math.max(16, Math.min(rect.top, viewportHeight - estimatedHeight - 16));
    } else if (placement === 'top') {
      calculatedTop = Math.max(16, rect.top - estimatedHeight - 8);
      calculatedLeft = Math.max(12, Math.min(rect.left, viewportWidth - estimatedWidth - 16));
    } else {
      // bottom
      calculatedTop = Math.min(rect.bottom + 8, viewportHeight - estimatedHeight - 16);
      calculatedLeft = Math.max(12, Math.min(rect.left, viewportWidth - estimatedWidth - 16));
    }

    // Strict clamping guarantee: never off-screen
    calculatedTop = Math.max(16, Math.min(calculatedTop, viewportHeight - estimatedHeight - 16));
    calculatedLeft = Math.max(12, Math.min(calculatedLeft, viewportWidth - estimatedWidth - 12));

    setCoords({
      top: Math.round(calculatedTop),
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
