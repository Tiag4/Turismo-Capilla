import type { CulturalEvent } from '../types/culturalEvent.types';

export interface PortalCMSPreviewPayload {
  type: 'UPDATE_PORTAL_PREVIEW';
  sectionsOrder: string[];
  sectionsVisibility: Record<string, boolean>;
  heroConfig?: {
    badge?: string;
    title?: string;
    subtitle?: string;
  };
  events?: CulturalEvent[];
}

export interface SelectEditableSectionPayload {
  type: 'SELECT_EDITABLE_SECTION';
  sectionId: string;
}

export interface PreviewReadyPayload {
  type: 'PREVIEW_READY';
}
