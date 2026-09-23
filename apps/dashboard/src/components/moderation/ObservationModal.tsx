import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import type { ModerationItem } from '../../types/moderation.types.ts';

export interface ObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ModerationItem | null;
  onSubmit: (id: string, notes: string) => Promise<void>;
  isLoading: boolean;
}

export const ObservationModal: React.FC<ObservationModalProps> = ({
  isOpen,
  onClose,
  item,
  onSubmit,
  isLoading,
}) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Por favor redactá la observación técnica para el prestador.');
      return;
    }
    setError(null);
    await onSubmit(item.id, notes.trim());
    setNotes('');
    onClose();
  };

  const handleClose = () => {
    setNotes('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Observación de Fotografía / Contenido"
      subtitle={`Establecimiento: ${item.accommodationName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Preview snippet */}
        <div className="flex items-center gap-3 p-3 bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)]">
          <img
            src={item.imageUrl}
            alt={item.caption || 'Foto'}
            className="w-14 h-14 object-cover rounded-lg shrink-0"
          />
          <div className="truncate">
            <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate">
              {item.caption || 'Fotografía de la ficha'}
            </span>
            <span className="text-[11px] text-[var(--color-sand-400)] block truncate">
              Prestador: {item.hostName} ({item.hostEmail})
            </span>
          </div>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="obs-notes" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
            Detalle de la Observación Municipal <span className="text-rose-700">*</span>
          </label>
          <textarea
            id="obs-notes"
            rows={4}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Indicá con claridad la corrección requerida (ej. foto con baja resolución, marcas de agua, texto publicitario, instalaciones no habilitadas)..."
            className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3 py-2 text-xs text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-terracotta-500)]"
          />
          {error && <span className="text-xs text-rose-700 font-semibold">{error}</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="terracotta" isLoading={isLoading}>
            <Send className="w-3.5 h-3.5" />
            <span>Enviar al Prestador</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
