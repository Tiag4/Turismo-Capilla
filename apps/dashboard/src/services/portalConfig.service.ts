import { DEFAULT_PORTAL_CONFIG, type PortalCMSConfig } from '../types/portalConfig.types';

const STORAGE_KEY = 'turismo_capilla_portal_cms_config';

export const portalConfigService = {
  getConfig: (): PortalCMSConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PORTAL_CONFIG,
          ...parsed,
          sectionsVisibility: {
            ...DEFAULT_PORTAL_CONFIG.sectionsVisibility,
            ...(parsed.sectionsVisibility || {}),
          },
          heroConfig: {
            ...DEFAULT_PORTAL_CONFIG.heroConfig,
            ...(parsed.heroConfig || {}),
          },
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PORTAL_CONFIG;
  },

  saveConfig: (config: PortalCMSConfig): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (err) {
      console.error('Error saving portal config:', err);
    }
  },

  resetConfig: (): PortalCMSConfig => {
    portalConfigService.saveConfig(DEFAULT_PORTAL_CONFIG);
    return DEFAULT_PORTAL_CONFIG;
  },
};
