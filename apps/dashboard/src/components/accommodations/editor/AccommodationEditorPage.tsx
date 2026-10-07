import React, { useEffect, useState } from 'react';
import { useHostAccommodations } from '../../../hooks/useHostAccommodations.ts';
import { accommodationsService } from '../../../services/accommodations.service.ts';
import type { Accommodation, CreateAccommodationDto } from '../../../types/accommodation.types.ts';
import { AccommodationEditorForm } from './AccommodationEditorForm.tsx';

export interface AccommodationEditorPageProps {
  mode: 'create' | 'edit';
  accommodationId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const AccommodationEditorPage: React.FC<AccommodationEditorPageProps> = ({
  mode,
  accommodationId,
  onBack,
  onSuccess,
}) => {
  const { createAccommodation, updateAccommodation } = useHostAccommodations();
  const [initialData, setInitialData] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && accommodationId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      accommodationsService
        .getById(accommodationId)
        .then((data) => {
          if (isMounted) {
            setInitialData(data);
            if (!data) setError('No se encontró el alojamiento solicitado.');
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar los datos del alojamiento.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [mode, accommodationId]);

  const handleSubmit = async (dto: CreateAccommodationDto) => {
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && accommodationId) {
        await updateAccommodation(accommodationId, dto);
      } else {
        await createAccommodation(dto);
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Error al guardar los datos del alojamiento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-[var(--color-sand-500)] bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--color-terracotta-500)] border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos del alojamiento...</span>
      </div>
    );
  }

  if (error && mode === 'edit' && !initialData) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 flex flex-col items-center gap-3">
        <p className="text-sm font-bold text-rose-700">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-bold text-[var(--color-terracotta-600)] hover:underline cursor-pointer"
        >
          ← Volver a Mis Cabañas
        </button>
      </div>
    );
  }

  return (
    <AccommodationEditorPageWrapper>
      <AccommodationEditorForm
        initialData={initialData}
        mode={mode}
        onSubmit={handleSubmit}
        onCancel={onBack}
        isLoading={isSubmitting}
      />
    </AccommodationEditorPageWrapper>
  );
};

const AccommodationEditorPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full max-w-5xl mx-auto pb-10">{children}</div>
);
