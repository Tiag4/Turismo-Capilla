import { apiClient } from './api.client';
import { DEFAULT_PORTAL_CONFIG, type PortalCMSConfig } from '../types/portalConfig.types';

const STORAGE_KEY = 'turismo_capilla_portal_cms_config';

function mergeWithDefaults(parsed: Record<string, any>): PortalCMSConfig {
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
    duoAccessConfig: {
      ...DEFAULT_PORTAL_CONFIG.duoAccessConfig,
      ...(parsed.duoAccessConfig || {}),
    },
    finalCtaConfig: {
      ...DEFAULT_PORTAL_CONFIG.finalCtaConfig,
      ...(parsed.finalCtaConfig || {}),
    },
    uritorcoConfig: {
      ...DEFAULT_PORTAL_CONFIG.uritorcoConfig,
      ...(parsed.uritorcoConfig || {}),
    },
  };
}

function persistLocally(config: PortalCMSConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Error caching portal config locally:', err);
  }
}

export const portalConfigService = {
  getConfig: (): PortalCMSConfig => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return mergeWithDefaults(JSON.parse(stored) as Partial<PortalCMSConfig>);
      }
    } catch {
      // Fallback to defaults
    }
    return DEFAULT_PORTAL_CONFIG;
  },

  fetchConfig: async (): Promise<PortalCMSConfig> => {
    try {
      const remote = await apiClient.get<Partial<PortalCMSConfig>>('/portal-config');
      if (remote && typeof remote === 'object' && Object.keys(remote).length > 0) {
        const merged = mergeWithDefaults(remote);
        persistLocally(merged);
        return merged;
      }
    } catch (err) {
      console.warn('Backend /portal-config no accesible o sin configuración previa, usando cache local:', err);
    }
    return portalConfigService.getConfig();
  },

  saveConfig: async (config: PortalCMSConfig): Promise<PortalCMSConfig> => {
    persistLocally(config);
    await apiClient.put<PortalCMSConfig>('/portal-config', config);
    return config;
  },

  resetConfig: async (): Promise<PortalCMSConfig> => {
    return portalConfigService.saveConfig(DEFAULT_PORTAL_CONFIG);
  },
};
