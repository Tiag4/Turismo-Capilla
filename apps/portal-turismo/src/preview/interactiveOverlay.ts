const INTERACTIVE_CSS = `
[data-editable] {
  cursor: pointer !important;
  transition: outline 0.15s ease-in-out;
  position: relative;
}

[data-editable]:hover {
  outline: 2px dashed var(--color-emerald-portal-600, #1C8B68) !important;
  outline-offset: -2px;
}

.selected-editable {
  outline: 2px solid var(--color-terracotta-500, #E06D39) !important;
  outline-offset: -2px;
  box-shadow: 0 0 12px rgba(224, 109, 57, 0.25) !important;
}

#editable-float-badge {
  position: absolute;
  z-index: 99999;
  display: none;
  align-items: center;
  gap: 6px;
  background-color: #1C8B68;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-family: system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(28, 139, 104, 0.35);
  cursor: pointer;
  pointer-events: auto !important;
  transition: all 0.2s ease;
}

#editable-float-badge:hover {
  background-color: #0D2F22;
  transform: translateY(-1px);
}
`;

declare global {
  interface Window {
    __portalInteractiveOverlayInit?: boolean;
    floatBadge?: HTMLButtonElement;
    selectedEditableElement?: HTMLElement | null;
  }
}

export function updateFloatBadgePosition(element: HTMLElement | null): void {
  if (!element || !window.floatBadge) return;
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.floatBadge.style.display = 'inline-flex';
  const badgeHeight = window.floatBadge.offsetHeight || 32;
  const badgeWidth = window.floatBadge.offsetWidth || 80;

  let topPosition = rect.top + scrollTop + 12;
  window.floatBadge.style.top = `${topPosition}px`;
  window.floatBadge.style.left = `${rect.right + scrollLeft - badgeWidth - 16}px`;
}

function initFloatBadge(): void {
  let badge = document.getElementById('editable-float-badge') as HTMLButtonElement;
  if (!badge) {
    badge = document.createElement('button');
    badge.id = 'editable-float-badge';
    badge.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
      </svg>
      <span>Editar en CMS</span>
    `;
    document.body.appendChild(badge);
  }
  window.floatBadge = badge;
}

export function initInteractiveOverlay(): void {
  if (typeof window === 'undefined') return;
  if (window.__portalInteractiveOverlayInit) return;
  window.__portalInteractiveOverlayInit = true;

  document.documentElement.classList.add('portal-in-cms-preview');

  if (!document.getElementById('portal-preview-styles')) {
    const style = document.createElement('style');
    style.id = 'portal-preview-styles';
    style.textContent = INTERACTIVE_CSS;
    document.head.appendChild(style);
  }

  if (document.body) {
    initFloatBadge();
  } else {
    document.addEventListener('DOMContentLoaded', initFloatBadge);
  }

  // Click & Double Click listener
  window.addEventListener(
    'click',
    (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (window.floatBadge && window.floatBadge.contains(target)) {
        e.preventDefault();
        e.stopPropagation();
        if (window.selectedEditableElement) {
          const sectionId = window.selectedEditableElement.getAttribute('data-editable');
          if (sectionId) {
            window.parent.postMessage(
              { type: 'SELECT_EDITABLE_SECTION', sectionId },
              '*'
            );
          }
        }
        return;
      }

      const editableEl = target.closest('[data-editable]') as HTMLElement | null;
      if (editableEl) {
        if (window.selectedEditableElement && window.selectedEditableElement !== editableEl) {
          window.selectedEditableElement.classList.remove('selected-editable');
        }
        window.selectedEditableElement = editableEl;
        editableEl.classList.add('selected-editable');
        updateFloatBadgePosition(editableEl);

        const sectionId = editableEl.getAttribute('data-editable');
        if (sectionId) {
          window.parent.postMessage(
            { type: 'SELECT_EDITABLE_SECTION', sectionId },
            '*'
          );
        }
      } else {
        if (window.selectedEditableElement) {
          window.selectedEditableElement.classList.remove('selected-editable');
          window.selectedEditableElement = null;
        }
        if (window.floatBadge) {
          window.floatBadge.style.display = 'none';
        }
      }
    },
    true
  );

  window.addEventListener('scroll', () => {
    if (window.selectedEditableElement) {
      updateFloatBadgePosition(window.selectedEditableElement);
    }
  });

  window.addEventListener('resize', () => {
    if (window.selectedEditableElement) {
      updateFloatBadgePosition(window.selectedEditableElement);
    }
  });
}
