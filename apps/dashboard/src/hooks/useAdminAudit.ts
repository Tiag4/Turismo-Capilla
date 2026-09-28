import { useState, useCallback } from 'react';
import type {
  AccommodationAuditRecord,
  ComplianceStatus,
  ComplianceChecklist,
} from '../types/accommodation.types.ts';

const AUDIT_STORAGE_KEY = 'turismo_capilla_accommodations_audit';

export function useAdminAudit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSavedAudits = useCallback((): Record<string, AccommodationAuditRecord> => {
    try {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }, []);

  const saveAudit = useCallback(
    async (
      accommodationId: string,
      status: ComplianceStatus,
      checklist: ComplianceChecklist,
      inspectorNotes: string,
      auditedBy = 'Comisión de Turismo (Admin)'
    ): Promise<AccommodationAuditRecord> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const record: AccommodationAuditRecord = {
          status,
          checklist,
          inspectorNotes,
          auditedAt: new Date().toISOString(),
          auditedBy,
        };

        const existing = getSavedAudits();
        existing[accommodationId] = record;
        localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(existing));

        return record;
      } catch (err: any) {
        const msg = err.message || 'Error al guardar la auditoría';
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [getSavedAudits]
  );

  return {
    isSubmitting,
    error,
    saveAudit,
    getSavedAudits,
  };
}
