import React, { useEffect, useState } from 'react';
import { culturalEventsService } from '../../services/culturalEvents.service';
import type { CulturalEvent, CreateCulturalEventDTO } from '../../types/culturalEvent.types';
import { EventEditorForm } from './EventEditorForm';

export interface EventEditorPageProps {
  mode: 'create' | 'edit';
  eventId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const EventEditorPage: React.FC<EventEditorPageProps> = ({
  mode,
  eventId,
  onBack,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<CulturalEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      culturalEventsService
        .getEventById(eventId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setInitialData(data);
            } else {
              setError('No se encontró el evento solicitado en la agenda.');
            }
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar la información del evento.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, eventId]);

  const handleSubmit = async (dto: CreateCulturalEventDTO) => {
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && eventId) {
        await culturalEventsService.updateEvent(eventId, dto);
      } else {
        await culturalEventsService.createEvent(dto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error al persistir el evento en la agenda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[var(--color-sand-500)] bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center justify-center gap-3 max-w-7xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-emerald-portal-600)] border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos del evento...</span>
      </div>
    );
  }

  if (error && mode === 'edit' && !initialData) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 flex flex-col items-center gap-3 max-w-7xl mx-auto">
        <p className="text-sm font-bold text-rose-700">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--color-sand-100)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-200)] transition-colors cursor-pointer"
        >
          Volver a la Agenda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}
      <EventEditorForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
