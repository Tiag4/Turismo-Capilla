import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Select } from '../../ui/Select.tsx';
import { useHostAccommodations } from '../../../hooks/useHostAccommodations.ts';
import { dateBlocksService } from '../../../services/date-blocks.service.ts';
import type { CreateDateBlockDto, DateBlockReason } from '../../../types/date-block.types.ts';
import { DATE_BLOCK_REASON_LABELS } from '../../../types/date-block.types.ts';

export interface DateBlockEditorPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const DateBlockEditorPage: React.FC<DateBlockEditorPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const { accommodations } = useHostAccommodations();
  const [accommodationId, setAccommodationId] = useState<string>(accommodations[0]?.id || '');
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().substring(0, 10));
  const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().substring(0, 10));
  const [reason, setReason] = useState<DateBlockReason>('MAINTENANCE');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accommodationId) {
      setError('Por favor seleccioná una cabaña o propiedad para el bloqueo.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Las fechas de inicio y fin son obligatorias.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const selectedAcc = accommodations.find((a) => a.id === accommodationId);
      const dto: CreateDateBlockDto = {
        accommodationId,
        accommodationName: selectedAcc?.name || 'Alojamiento',
        startDate,
        endDate,
        reason,
        notes: notes.trim() || undefined,
      };
      dateBlocksService.create(dto);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al registrar el bloqueo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonOptions = Object.entries(DATE_BLOCK_REASON_LABELS).map(([key, label]) => ({
    value: key,
    label,
  }));

  const accommodationOptions = accommodations.map((a) => ({
    value: a.id,
    label: `${a.name} (${a.type})`,
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
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
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-terracotta-600 mb-0.5">
              <Lock className="w-4 h-4" />
              <span>Gestión de Disponibilidad & Calendario</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              Bloquear Fechas en Calendario
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
            <Lock className="w-4 h-4 mr-1.5" />
            <span>Confirmar Bloqueo</span>
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
        <Select
          label="Cabaña o Unidad a Bloquear"
          value={accommodationId}
          onChange={(e) => setAccommodationId(e.target.value)}
          options={accommodationOptions}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha Desde"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha Hasta"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <Select
          label="Motivo del Bloqueo"
          value={reason}
          onChange={(e) => setReason(e.target.value as DateBlockReason)}
          options={reasonOptions}
        />

        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1.5">
            Notas u Observaciones Internas (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Ej: Mantenimiento anual de calefón o reserva tomada por canal telefónico..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white resize-y"
          />
        </div>
      </form>
    </div>
  );
};
