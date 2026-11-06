import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import type { DashboardReview } from '../../types/review.types.ts';

interface ReviewRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: DashboardReview | null;
  onSubmit: (id: string, notes: string) => Promise<void>;
  isLoading: boolean;
}

export const ReviewRejectModal: React.FC<ReviewRejectModalProps> = ({
  isOpen,
  onClose,
  review,
  onSubmit,
  isLoading,
}) => {
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!review) return null;

  const handleClose = () => {
    setNotes('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!notes.trim()) {
      setError('Indicá el motivo por el que la reseña no será publicada.');
      return;
    }

    setError(null);
    try {
      await onSubmit(review.id, notes.trim());
      setNotes('');
      onClose();
    } catch {
      // El error se informa desde la sección de moderación.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Observación de Reseña"
      subtitle={`${review.accommodationName} · Reserva ${review.bookingCode}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="p-3 bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)] space-y-1">
          <span className="text-xs font-bold text-[var(--color-sand-900)] block">
            {review.guestName} · {review.rating}/5 estrellas
          </span>
          <p className="text-[11px] text-[var(--color-sand-600)] line-clamp-3">{review.comment}</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="review-reject-notes" className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
            Motivo de la observación <span className="text-rose-700">*</span>
          </label>
          <textarea
            id="review-reject-notes"
            rows={4}
            value={notes}
            onChange={(event) => {
              setNotes(event.target.value);
              if (error) setError(null);
            }}
            placeholder="Explicá con claridad por qué la reseña requiere correcciones antes de publicarse..."
            className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3 py-2 text-xs text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-terracotta-500)]"
          />
          {error && <span className="text-xs text-rose-700 font-semibold">{error}</span>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="terracotta" isLoading={isLoading}>
            <Send className="w-3.5 h-3.5" />
            <span>Enviar Observación</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
