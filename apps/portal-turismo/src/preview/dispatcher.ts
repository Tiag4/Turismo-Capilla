import type { PortalCMSPreviewPayload } from './types';
import { initInteractiveOverlay } from './interactiveOverlay';

declare global {
  interface Window {
    __portalDispatcherInit?: boolean;
    __portalEventUpdateCallback?: (events: any[]) => void;
  }
}

export function applyPortalPreview(payload: PortalCMSPreviewPayload): void {
  if (typeof document === 'undefined') return;

  const container = document.getElementById('sections-container');
  if (!container) return;

  // 1. Reordenar y cambiar visibilidad de secciones
  if (Array.isArray(payload.sectionsOrder)) {
    payload.sectionsOrder.forEach((sectionKey, index) => {
      const sectionEl = document.getElementById(`section-${sectionKey}`);
      if (sectionEl) {
        sectionEl.style.order = String(index);

        if (payload.sectionsVisibility) {
          const isVisible = payload.sectionsVisibility[sectionKey] !== false;
          sectionEl.style.display = isVisible ? 'block' : 'none';
        }
      }
    });
  }

  // 2. Actualizar Hero en vivo si hay textos personalizados
  if (payload.heroConfig) {
    if (payload.heroConfig.title) {
      const titleEl = document.querySelector('[data-hero-title]');
      if (titleEl) {
        titleEl.textContent = payload.heroConfig.title;
      }
    }
    if (payload.heroConfig.subtitle) {
      const descEl = document.querySelector('[data-hero-desc]');
      if (descEl) {
        descEl.textContent = payload.heroConfig.subtitle;
      }
    }
  }

  // 3. Actualizar Final CTA en vivo si hay textos personalizados
  if (payload.finalCtaConfig) {
    if (payload.finalCtaConfig.title) {
      const titleEl = document.querySelector('[data-cta-title]');
      if (titleEl) {
        titleEl.textContent = payload.finalCtaConfig.title;
      }
    }
    if (payload.finalCtaConfig.subtitle) {
      const descEl = document.querySelector('[data-cta-subtitle]');
      if (descEl) {
        descEl.textContent = payload.finalCtaConfig.subtitle;
      }
    }
    if (payload.finalCtaConfig.buttonText) {
      const btnEl = document.querySelector('[data-cta-button]');
      if (btnEl) {
        btnEl.textContent = payload.finalCtaConfig.buttonText;
      }
    }
  }

  // 4. Actualizar Bloque Uritorco en vivo si hay textos personalizados
  if (payload.uritorcoConfig) {
    if (payload.uritorcoConfig.title) {
      const titleEl = document.querySelector('[data-uritorco-title]');
      if (titleEl) {
        titleEl.textContent = payload.uritorcoConfig.title;
      }
    }
    if (payload.uritorcoConfig.subtitle) {
      const descEl = document.querySelector('[data-uritorco-desc]');
      if (descEl) {
        descEl.textContent = payload.uritorcoConfig.subtitle;
      }
    }
  }

  // 5. Notificar a componentes reactivos si hay actualización de eventos
  if (payload.events && window.__portalEventUpdateCallback) {
    window.__portalEventUpdateCallback(payload.events);
  }
}

export function initPortalPreviewDispatcher(): () => void {
  if (typeof window === 'undefined') return () => {};
  if (window.__portalDispatcherInit) return () => {};
  window.__portalDispatcherInit = true;

  const isPreview = window.location.search.includes('preview=true');
  if (!isPreview) return () => {};

  // Inicializar overlay interactivo con hover y selección
  initInteractiveOverlay();

  const handleMessage = (event: MessageEvent) => {
    const data = event.data;
    if (data && typeof data === 'object' && data.type === 'UPDATE_PORTAL_PREVIEW') {
      applyPortalPreview(data as PortalCMSPreviewPayload);
    }
  };

  window.addEventListener('message', handleMessage);

  // Handshake inicial avisando al Dashboard que el portal está listo para recibir el preview
  window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');

  return () => {
    window.removeEventListener('message', handleMessage);
    window.__portalDispatcherInit = false;
  };
}
