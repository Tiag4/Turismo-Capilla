import React, { useState, useEffect } from 'react';
import type { Accommodation } from '../../types/accommodation.types.ts';
import type { CreateDateBlockDto, DateBlockReason } from '../../types/date-block.types.ts';
import { DATE_BLOCK_REASON_LABELS } from '../../types/date-block.types.ts';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';

export interface DateBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodations: Accommodation[];
  preselectedAccommodationId?: string;
  preselectedDate?: string;
  onCreateBlock: (dto: CreateDateBlockDto) => void;
}

export const DateBlockModal: React.FC<DateBlockModalProps> = ({
  isOpen,
  onClose,
  accommodations,
  preselectedAccommodationId,
  preselectedDate,
  onCreateBlock,
}) => {
  const [accommodationId, setAccommodationId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<DateBlockReason>('MAINTENANCE');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const defaultAcc =
        preselectedAccommodationId && preselectedAccommodationId !== 'ALL'
          ? preselectedAccommodationId
          : accommodations[0]?.id || '';
      setAccommodationId(defaultAcc);

      const today = new Date().toISOString().substring(0, 10);
      const initDate = preselectedDate || today;
      setStartDate(initDate);
      setEndDate(initDate);
      setReason('MAINTENANCE');
      setNotes('');
      setError('');
    }
  }, [isOpen, preselectedAccommodationId, preselectedDate, accommodations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accommodationId) {
      setError('Debés seleccionar una cabaña.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Debés indicar tanto la fecha de inicio como la de fin.');
      return;
    }

    if (startDate > endDate) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    const acc = accommodations.find((a) => a.id === accommodationId);
    const accommodationName = acc?.name || 'Cabaña';

    onCreateBlock({
      accommodationId,
      accommodationName,
      startDate,
      endDate,
      reason,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Bloqueo Manual de Fechas"
      subtitle="Inhabilita fechas para mantenimiento o uso particular sin falsear reservas"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Accommodation Selector */}
        <Select
          label="Cabaña a Bloquear"
          value={accommodationId}
          onChange={(e) => setAccommodationId(e.target.value)}
          options={accommodations.map((a) => ({
            value: a.id,
            label: a.name,
          }))}
          required
        />

        {/* Date range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Fecha Inicio (Desde)"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha Fin (Hasta)"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        {/* Reason */}
        <Select
          label="Motivo del Bloqueo"
          value={reason}
          onChange={(e) => setReason(e.target.value as DateBlockReason)}
          options={[
            { value: 'MAINTENANCE', label: DATE_BLOCK_REASON_LABELS.MAINTENANCE },
            { value: 'PERSONAL_USE', label: DATE_BLOCK_REASON_LABELS.PERSONAL_USE },
            { value: 'SEASON_CLOSED', label: DATE_BLOCK_REASON_LABELS.SEASON_CLOSED },
          ]}
          required
        />

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
            Notas u Observaciones (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Pintura de exteriores y cambio de filtros de la pileta."
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-white text-[var(--color-sand-900)] placeholder-[var(--color-sand-400)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="terracotta" size="sm">
            Confirmar Bloqueo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
