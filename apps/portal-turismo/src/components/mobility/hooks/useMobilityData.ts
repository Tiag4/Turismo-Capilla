import { useState, useEffect } from 'react';
import type { MobilityConfig } from '../types/mobility.types';
import {
  portalMobilityService,
  STORAGE_KEY_MOBILITY,
  MOBILITY_BROADCAST_CHANNEL,
} from '../../../services/mobilityConfig.service';

export const useMobilityData = () => {
  const [config, setConfig] = useState<MobilityConfig>(() => portalMobilityService.getConfig());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Obtener la última versión desde el backend o caché
    portalMobilityService.fetchConfig().then((fresh) => {
      if (isMounted) {
        setConfig(fresh);
        setIsLoading(false);
      }
    });

    // 2. Escuchar evento de actualización en la misma ventana
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<MobilityConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        setConfig(portalMobilityService.getConfig());
      }
    };
    window.addEventListener('capilla:mobility-updated', handleLocalUpdate);

    // 3. Escuchar evento de Storage para sincronización entre pestañas del mismo origen
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_MOBILITY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig(parsed);
        } catch {
          // Ignorar parse error
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 4. Escuchar canal de difusión cross-app (BroadcastChannel)
    let channel: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel(MOBILITY_BROADCAST_CHANNEL);
        channel.onmessage = (event) => {
          if (event.data && event.data.type === 'MOBILITY_UPDATED' && event.data.config) {
            setConfig(event.data.config);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel no soportado:', err);
      }
    }

    return () => {
      isMounted = false;
      window.removeEventListener('capilla:mobility-updated', handleLocalUpdate);
      window.removeEventListener('storage', handleStorageChange);
      if (channel) {
        channel.close();
      }
    };
  }, []);

  return { config, isLoading };
};
