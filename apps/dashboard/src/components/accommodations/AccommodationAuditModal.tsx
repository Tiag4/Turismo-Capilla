import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Select } from '../ui/Select.tsx';
import { AuditChecklist } from './AuditChecklist.tsx';
import type {
  Accommodation,
  ComplianceStatus,
  ComplianceChecklist,
} from '../../types/accommodation.types.ts';

export interface AccommodationAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation | null;
  onSaveAudit: (
    accommodationId: string,
    status: ComplianceStatus,
    checklist: ComplianceChecklist,
    notes: string
  ) => Promise<void>;
  isLoading: boolean;
}

export const AccommodationAuditModal: React.FC<AccommodationAuditModalProps> = ({
  isOpen,
  onClose,
  accommodation,
  onSaveAudit,
  isLoading,
}) => {
  const [status, setStatus] = useState<ComplianceStatus>('APPROVED');
  const [checklist, setChecklist] = useState<ComplianceChecklist>({
    fireExtinguisher: true,
    evacuationPlan: true,
    civilLiabilityInsurance: true,
    commercialPermit: true,
    firstAidKit: true,
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (accommodation) {
      setStatus(accommodation.complianceStatus || 'APPROVED');
      if (accommodation.auditRecord) {
        setChecklist(accommodation.auditRecord.checklist);
        setNotes(accommodation.auditRecord.inspectorNotes || '');
      } else {
        setChecklist({
          fireExtinguisher: true,
          evacuationPlan: true,
          civilLiabilityInsurance: true,
          commercialPermit: true,
          firstAidKit: true,
        });
        setNotes('');
      }
    }
  }, [accommodation]);

  if (!accommodation) return null;

  const toggleItem = (key: keyof ComplianceChecklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveAudit(accommodation.id, status, checklist, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Auditoría Municipal: ${accommodation.name}`}
      subtitle="Inspección y certificación formal de la Comisión de Turismo"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Dictamen Selector */}
        <Select
          label="Dictamen de Habilitación Municipal"
          value={status}
          onChange={(e) => setStatus(e.target.value as ComplianceStatus)}
          options={[
            { value: 'APPROVED', label: 'Habilitado Formalmente (Cumple Requisitos)' },
            { value: 'IN_REVIEW', label: 'En Revisión Técnica (Observaciones Pendientes)' },
            { value: 'REJECTED', label: 'No Habilitado / Suspendido (Incumple Normas)' },
          ]}
        />

        {/* Checklist */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)] block mb-2">
            Checklist de Inspección Técnica
          </label>
          <AuditChecklist checklist={checklist} onToggle={toggleItem} />
        </div>

        {/* Inspector Notes */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)] block mb-1.5">
            Observaciones del Inspector Municipal
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalle inspección física, fecha de verificación, constancia de oblea..."
            className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-emerald-portal-600)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="emerald" isLoading={isLoading}>
            <ShieldCheck className="w-4 h-4" />
            <span>Guardar Dictamen</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
