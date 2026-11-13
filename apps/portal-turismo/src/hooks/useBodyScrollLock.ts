import { useEffect } from 'react';

let lockCount = 0;
let lockedScrollY = 0;

const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  'Space',
  ' ',
]);

function isScrollableElement(el: HTMLElement, deltaY: number): boolean {
  let current: HTMLElement | null = el;

  while (current && current !== document.body && current !== document.documentElement) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY;

    if (overflowY === 'auto' || overflowY === 'scroll') {
      const isScrollable = current.scrollHeight > current.clientHeight;
      if (isScrollable) {
        const canScrollDown = deltaY > 0 && current.scrollTop + current.clientHeight < current.scrollHeight - 1;
        const canScrollUp = deltaY < 0 && current.scrollTop > 1;

        if (canScrollDown || canScrollUp) {
          return true;
        }
      }
    }
    current = current.parentElement;
  }

  return false;
}

let touchStartY = 0;

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    touchStartY = e.touches[0].clientY;
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const touchCurrentY = e.touches[0].clientY;
  const deltaY = touchStartY - touchCurrentY;

  const target = e.target as HTMLElement | null;
  if (!target || !isScrollableElement(target, deltaY)) {
    if (e.cancelable) {
      e.preventDefault();
    }
  }
}

function handleWheel(e: WheelEvent) {
  const target = e.target as HTMLElement | null;
  if (!target || !isScrollableElement(target, e.deltaY)) {
    e.preventDefault();
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (!SCROLL_KEYS.has(e.key)) return;

  const target = e.target as HTMLElement | null;
  if (!target) return;

  const tagName = target.tagName.toLowerCase();
  if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
    return;
  }

  let deltaY = 0;
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'Space' || e.key === ' ') {
    deltaY = 1;
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    deltaY = -1;
  }

  if (deltaY !== 0 && isScrollableElement(target, deltaY)) {
    return;
  }

  e.preventDefault();
}

function handleScroll() {
  if (window.scrollY !== lockedScrollY) {
    window.scrollTo(window.scrollX, lockedScrollY);
  }
}

/**
 * Bloquea el scroll del fondo al abrir modales/drawers manteniendo la barra de scroll nativa visible.
 * No modifica document.body.style.overflow para preservar la barra de desplazamiento y evitar franjas o layout shifts.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof window === 'undefined') return;

    if (lockCount === 0) {
      lockedScrollY = window.scrollY;

      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('touchstart', handleTouchStart, { passive: true });
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('keydown', handleKeyDown, { passive: false });
      window.addEventListener('scroll', handleScroll, { passive: false });
    }
    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isLocked]);
}
