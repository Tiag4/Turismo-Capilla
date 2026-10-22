import React, { useEffect, useState } from 'react';
import { attractionsService } from '../../../services/attractions.service.ts';
import type { Attraction, CreateAttractionDto } from '../../../types/attraction.types.ts';
import { AttractionEditorForm } from './AttractionEditorForm.tsx';

export interface AttractionEditorPageProps {
  mode: 'create' | 'edit';
  attractionId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const AttractionEditorPage: React.FC<AttractionEditorPageProps> = ({
  mode,
  attractionId,
  onBack,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<Attraction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && attractionId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      attractionsService
        .getById(attractionId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setInitialData(data);
            } else {
              setError('No se encontró el paseo o sendero solicitado en el catálogo.');
            }
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar la información del paseo o sendero.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, attractionId]);

  const handleSubmit = async (dto: CreateAttractionDto) => {
    setIsSubmitting(true);
    try {
      if (mode === 'edit' && attractionId) {
        await attractionsService.update(attractionId, dto);
      } else {
        await attractionsService.create(dto);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al persistir el atractivo en el catálogo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-sand-500 bg-white rounded-2xl border border-sand-200 flex flex-col items-center justify-center gap-3 max-w-5xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos del atractivo turístico...</span>
      </div>
    );
  }

  if (error && mode === 'edit' && !initialData) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 flex flex-col items-center gap-3 max-w-5xl mx-auto">
        <p className="text-sm font-bold text-rose-700">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-sand-100 text-sand-800 hover:bg-sand-200 transition-colors cursor-pointer"
        >
          Volver a Atractivos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}
      <AttractionEditorForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={onBack}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
