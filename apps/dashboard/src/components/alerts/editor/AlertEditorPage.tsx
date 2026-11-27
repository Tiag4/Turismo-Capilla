import React, { useEffect, useState } from 'react';
import { alertsService } from '../../../services/alerts.service.ts';
import type { Alert, CreateOrUpdateAlertDto } from '../../../types/alert.types.ts';
import { AlertEditorForm } from './AlertEditorForm.tsx';

export interface AlertEditorPageProps {
  mode: 'create' | 'edit';
  alertId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const AlertEditorPage: React.FC<AlertEditorPageProps> = ({
  mode,
  alertId,
  onBack,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && alertId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      alertsService
        .getById(alertId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setInitialData(data);
            } else {
              setError('No se encontró la alerta meteorológica o territorial solicitada.');
            }
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar la información de la alerta.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, alertId]);

  const handleSubmit = async (dto: CreateOrUpdateAlertDto) => {
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && alertId) {
        await alertsService.update(alertId, dto);
      } else {
        await alertsService.create(dto);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al persistir la alerta oficial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-sand-500 bg-white rounded-2xl border border-sand-200 flex flex-col items-center justify-center gap-3 max-w-4xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos de la alerta oficial...</span>
      </div>
    );
  }

  if (error && mode === 'edit' && !initialData) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 flex flex-col items-center gap-3 max-w-4xl mx-auto">
        <p className="text-sm font-bold text-rose-700">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-sand-100 text-sand-800 hover:bg-sand-200 transition-colors cursor-pointer"
        >
          Volver al Centro de Alertas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}
      <AlertEditorForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
