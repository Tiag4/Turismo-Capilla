import React, { useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { usePharmacyForm } from './usePharmacyForm';
import { PharmacyFormFields } from './PharmacyFormFields';
import type { PharmacyDutyRecord, CreateOrUpdatePharmacyDto } from '../../types/pharmacyDuty.types';

interface PharmacyDutyEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: CreateOrUpdatePharmacyDto) => Promise<void>;
  pharmacy: PharmacyDutyRecord | null;
  isSaving: boolean;
}

export const PharmacyDutyEditorModal: React.FC<PharmacyDutyEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  pharmacy,
  isSaving,
}) => {
  const form = usePharmacyForm(pharmacy, isOpen, onSave);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pharmacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-sand-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sand-100 text-terracotta-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="pharmacy-modal-title" className="font-bold text-lg text-sand-900 font-display">
                {pharmacy ? 'Editar Farmacia' : 'Registrar Nueva Farmacia'}
              </h3>
              <p className="text-xs text-sand-500">Gestión de guardia sanitaria para Capilla del Monte</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-sand-400 hover:text-sand-700 hover:bg-sand-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <PharmacyFormFields form={form} />

          <div className="flex justify-end gap-2 pt-3 border-t border-sand-100">
            <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
              Cancelar
            </Button>
            <Button variant="terracotta" type="submit" disabled={isSaving}>
              {isSaving ? 'Guardando...' : pharmacy ? 'Actualizar Farmacia' : 'Registrar Farmacia'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
