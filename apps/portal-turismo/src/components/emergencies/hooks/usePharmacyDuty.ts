import { useState, useEffect, useMemo } from 'react';
import {
  pharmacyDutyService,
  EMERGENCY_SANITARY_EVENT,
} from '../../../services/pharmacyDuty.service';
import type { EmergencySanitaryConfig, PharmacyDutyRecord } from '../../../types/pharmacyDuty.types';

export function usePharmacyDuty() {
  const [config, setConfig] = useState<EmergencySanitaryConfig>(() =>
    pharmacyDutyService.getConfig()
  );

  useEffect(() => {
    const handleSync = () => {
      setConfig(pharmacyDutyService.getConfig());
    };

    window.addEventListener(EMERGENCY_SANITARY_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(EMERGENCY_SANITARY_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const activePharmacy: PharmacyDutyRecord = useMemo(() => {
    return config.pharmacies.find((p) => p.isOnDutyToday) ?? config.pharmacies[0];
  }, [config.pharmacies]);

  const otherPharmacies: PharmacyDutyRecord[] = useMemo(() => {
    return config.pharmacies.filter((p) => p.id !== activePharmacy?.id);
  }, [config.pharmacies, activePharmacy]);

  return {
    config,
    activePharmacy,
    otherPharmacies,
    healthGuard: config.healthGuard,
  };
}
