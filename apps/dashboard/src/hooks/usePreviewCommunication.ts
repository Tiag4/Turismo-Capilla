import { useEffect, useCallback } from 'react';
import type { PortalCMSConfig } from '../types/portalConfig.types';
import type { CulturalEvent } from '../types/culturalEvent.types';

interface UsePreviewCommunicationProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  config: PortalCMSConfig;
  events?: CulturalEvent[];
  onSelectSection?: (sectionId: string) => void;
}

export function usePreviewCommunication({
  iframeRef,
  config,
  events,
  onSelectSection,
}: UsePreviewCommunicationProps) {
  const sendPreviewMessage = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      const payload = {
        type: 'UPDATE_PORTAL_PREVIEW',
        sectionsOrder: config.sectionsOrder,
        sectionsVisibility: config.sectionsVisibility,
        heroConfig: config.heroConfig,
        events: events,
      };
      iframeRef.current.contentWindow.postMessage(payload, '*');
    }
  }, [iframeRef, config, events]);

  // 1. Envío reactivo con debounce de 100ms en cada cambio de configuración
  useEffect(() => {
    const timer = setTimeout(sendPreviewMessage, 100);
    return () => clearTimeout(timer);
  }, [sendPreviewMessage]);

  // 2. Escucha de eventos desde el iframe (PREVIEW_READY y SELECT_EDITABLE_SECTION)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'PREVIEW_READY') {
        sendPreviewMessage();
      } else if (data.type === 'SELECT_EDITABLE_SECTION') {
        const sectionId = data.sectionId || data.section;
        if (sectionId && onSelectSection) {
          onSelectSection(sectionId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendPreviewMessage, onSelectSection]);

  const handleIframeLoad = () => {
    sendPreviewMessage();
  };

  return {
    sendPreviewMessage,
    handleIframeLoad,
  };
}
