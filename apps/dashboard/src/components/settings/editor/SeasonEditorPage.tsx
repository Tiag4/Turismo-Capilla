import React, { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Select } from '../../ui/Select.tsx';
import { seasonsService } from '../../../services/seasons.service.ts';
import type { TourismSeason, CreateSeasonDto, SeasonType } from '../../../types/season.types.ts';

export interface SeasonEditorPageProps {
  mode: 'create' | 'edit';
  seasonId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export const SeasonEditorPage: React.FC<SeasonEditorPageProps> = ({
  mode,
  seasonId,
  onBack,
  onSuccess,
}) => {
  const [initialData, setInitialData] = useState<TourismSeason | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(mode === 'edit');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<SeasonType>('HIGH');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [multiplier, setMultiplier] = useState('1.3');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (mode === 'edit' && seasonId) {
      let isMounted = true;
      setIsLoading(true);
      setError(null);
      seasonsService
        .getById(seasonId)
        .then((data) => {
          if (isMounted) {
            if (data) {
              setInitialData(data);
              setName(data.name || '');
              setType(data.type || 'HIGH');
              setStartDate(data.startDate || '');
              setEndDate(data.endDate || '');
              setMultiplier(data.suggestedMultiplier?.toString() || '1.3');
              setDescription(data.description || '');
            } else {
              setError('No se encontró el período turístico solicitado.');
            }
          }
        })
        .catch(() => {
          if (isMounted) setError('Error al cargar la información del período turístico.');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, seasonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) {
      setError('Por favor completá los campos obligatorios (nombre y fechas).');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const dto: CreateSeasonDto = {
        name: name.trim(),
        type,
        startDate,
        endDate,
        suggestedMultiplier: parseFloat(multiplier) || 1.0,
        description: description.trim(),
      };

      if (mode === 'edit' && seasonId) {
        await seasonsService.update(seasonId, dto);
      } else {
        await seasonsService.create(dto);
      }
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al persistir el período turístico.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-16 text-center text-xs text-sand-500 bg-white rounded-2xl border border-sand-200 flex flex-col items-center justify-center gap-3 max-w-3xl mx-auto">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="font-semibold">Cargando datos del período turístico...</span>
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
          Volver a Configuración
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
            title="Volver al calendario"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              <Calendar className="w-4 h-4" />
              <span>Parámetros de Temporadas y Tarifas</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              {initialData ? `Editar "${initialData.name}"` : 'Definir Nuevo Período Turístico'}
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
            isLoading={isSubmitting}
            onClick={handleSubmit}
            className="font-bold shadow-xs"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialData ? 'Guardar Cambios' : 'Registrar Período'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {error}
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-sand-200 shadow-xs space-y-5">
        <Input
          label="Nombre del Período o Evento Oficial"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Semana Santa Serrana, Fiesta Patronal, Festival Alienígena..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Tipo de Temporada"
            value={type}
            onChange={(e) => setType(e.target.value as SeasonType)}
            options={[
              { value: 'HIGH', label: 'Temporada Alta (Pico de demanda)' },
              { value: 'MEDIUM', label: 'Temporada Media' },
              { value: 'LOW', label: 'Temporada Baja' },
              { value: 'SPECIAL_EVENT', label: 'Evento Especial / Fiesta Oficial' },
            ]}
          />

          <Input
            label="Multiplicador Tarifario Sugerido"
            type="number"
            step="0.1"
            min="0.5"
            max="3.0"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            helperText="Coeficiente sugerido para los alojamientos adheridos (ej: 1.4 = +40%)."
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <Input
            label="Fecha de Finalización"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1.5">
            Descripción y Contexto Turístico
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Explicá las actividades destacadas, flujo esperado de turistas y recomendaciones de ocupación..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white resize-y"
          />
        </div>
      </form>
    </div>
  );
};
