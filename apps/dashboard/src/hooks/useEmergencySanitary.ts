import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  pharmacyDutyService,
  DEFAULT_EMERGENCY_SANITARY_CONFIG,
  EMERGENCY_SANITARY_EVENT,
} from '../services/pharmacyDuty.service';
import type {
  EmergencySanitaryConfig,
  PharmacyDutyRecord,
  HealthGuardNotice,
  CreateOrUpdatePharmacyDto,
} from '../types/pharmacyDuty.types';

export function useEmergencySanitary() {
  const [config, setConfig] = useState<EmergencySanitaryConfig>(DEFAULT_EMERGENCY_SANITARY_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPharmacy, setEditingPharmacy] = useState<PharmacyDutyRecord | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await pharmacyDutyService.getConfig();
      setConfig(data);
    } catch (err) {
      console.error('Error loading emergency sanitary config:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<EmergencySanitaryConfig>;
      if (customEvent.detail) {
        setConfig(customEvent.detail);
      } else {
        loadData();
      }
    };

    window.addEventListener(EMERGENCY_SANITARY_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(EMERGENCY_SANITARY_EVENT, handleUpdate);
    };
  }, [loadData]);

  const activeDutyPharmacy = useMemo(() => {
    return config.pharmacies.find((p) => p.isOnDutyToday) ?? config.pharmacies[0];
  }, [config.pharmacies]);

  const handleSetOnDuty = async (pharmacyId: string, validFrom?: string, validTo?: string) => {
    try {
      setIsSaving(true);
      const updated = await pharmacyDutyService.setPharmacyOnDuty(pharmacyId, validFrom, validTo);
      setConfig(updated);
    } catch (err) {
      console.error('Error setting pharmacy on duty:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePharmacy = async (dto: CreateOrUpdatePharmacyDto) => {
    try {
      setIsSaving(true);
      const updated = await pharmacyDutyService.savePharmacy(dto);
      setConfig(updated);
      setIsEditorOpen(false);
      setEditingPharmacy(null);
    } catch (err) {
      console.error('Error saving pharmacy:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePharmacy = async (pharmacyId: string) => {
    try {
      setIsSaving(true);
      const updated = await pharmacyDutyService.deletePharmacy(pharmacyId);
      setConfig(updated);
    } catch (err) {
      console.error('Error deleting pharmacy:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHealthGuard = async (notice: Partial<HealthGuardNotice>) => {
    try {
      setIsSaving(true);
      const updated = await pharmacyDutyService.updateHealthGuardNotice(notice);
      setConfig(updated);
    } catch (err) {
      console.error('Error updating health guard notice:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const openCreatePharmacy = () => {
    setEditingPharmacy(null);
    setIsEditorOpen(true);
  };

  const openEditPharmacy = (pharmacy: PharmacyDutyRecord) => {
    setEditingPharmacy(pharmacy);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingPharmacy(null);
  };

  return {
    config,
    activeDutyPharmacy,
    isLoading,
    isSaving,
    isEditorOpen,
    editingPharmacy,
    openCreatePharmacy,
    openEditPharmacy,
    closeEditor,
    handleSetOnDuty,
    handleSavePharmacy,
    handleDeletePharmacy,
    handleUpdateHealthGuard,
  };
}
