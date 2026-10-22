import React, { useEffect, useState } from 'react';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { usePharmacyForm } from '../usePharmacyForm.ts';
import { PharmacyFormFields } from '../PharmacyFormFields.tsx';
import { pharmacyDutyService } from '../../../services/pharmacyDuty.service.ts';
import type { PharmacyDutyRecord, CreateOrUpdatePharmacyDto } from '../../../types/pharmacyDuty.types.ts';

export interface PharmacyDutyEditorPageProps {
  mode: 'create' | 'edit';
  pharmacyId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const PharmacyDutyEditorPage: React.FC<PharmacyDutyEditorPageProps> = ({
  mode,
  pharmacyId,
  onBack,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<PharmacyDutyRecord | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && pharmacyId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      pharmacyDutyService
        .getPharmacyById(pharmacyId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setInitialData(data);
            } else {
              setError('No se encontró el establecimiento farmacéutico solicitado.');
            }
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar la información de la farmacia.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, pharmacyId]);

  const handleSave = async (dto: CreateOrUpdatePharmacyDto) => {
    setIsSaving(true);
    try {
      await pharmacyDutyService.savePharmacy(dto);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar la farmacia.');
    } finally {
      setIsSaving(false);
    }
  };

  const form = usePharmacyForm(initialData, true, handleSave);

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-sand-500 bg-white rounded-2xl border border-sand-200 flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos de la farmacia de turno...</span>
      </div>
    );
  }

  if (error && mode === 'edit' && !initialData) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 flex flex-col items-center gap-3 max-w-3xl mx-auto">
        <p className="text-sm font-bold text-rose-700">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-sand-100 text-sand-800 hover:bg-sand-200 transition-colors cursor-pointer"
        >
          Volver a Guardias y Farmacias
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              <Building2 className="w-4 h-4" />
              <span>Guardias Sanitarias & Farmacias</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              {initialData ? `Editar "${initialData.name}"` : 'Registrar Nueva Farmacia'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="terracotta"
            isLoading={isSaving}
            onClick={form.handleSubmit}
            className="font-bold shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialData ? 'Actualizar Farmacia' : 'Registrar Farmacia'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Form Surface */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 shadow-xs space-y-5">
        <form onSubmit={form.handleSubmit} className="space-y-4">
          <PharmacyFormFields form={form} />
        </form>
      </div>
    </div>
  );
};
