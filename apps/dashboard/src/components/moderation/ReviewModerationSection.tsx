import React, { useState } from 'react';
import { MessageSquareText, ShieldCheck } from 'lucide-react';
import { useReviewModeration } from '../../hooks/useReviewModeration.ts';
import { ReviewModerationCard } from './ReviewModerationCard.tsx';
import { ReviewRejectModal } from './ReviewRejectModal.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import type { DashboardReview, ReviewStatus } from '../../types/review.types.ts';

export const ReviewModerationSection: React.FC = () => {
  const {
    items,
    isLoading,
    error,
    filter,
    setFilter,
    approve,
    reject,
  } = useReviewModeration();

  const [reviewToApprove, setReviewToApprove] = useState<string | null>(null);
  const [reviewToReject, setReviewToReject] = useState<DashboardReview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const tabs: { id: ReviewStatus | 'ALL'; label: string }[] = [
    { id: 'PENDING', label: 'Pendientes' },
    { id: 'APPROVED', label: 'Aprobadas' },
    { id: 'REJECTED', label: 'Observadas' },
    { id: 'ALL', label: 'Todas las Reseñas' },
  ];

  const handleApprove = async () => {
    if (!reviewToApprove) return;
    setIsSubmitting(true);
    setActionError(null);
    try {
      await approve(reviewToApprove);
      setReviewToApprove(null);
    } catch (approveError) {
      setActionError(
        approveError instanceof Error ? approveError.message : 'No se pudo aprobar la reseña.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (id: string, notes: string) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await reject(id, notes);
    } catch (rejectError) {
      setActionError(
        rejectError instanceof Error ? rejectError.message : 'No se pudo observar la reseña.',
      );
      throw rejectError;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6 pt-8 border-t border-[var(--color-sand-200)]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Moderación de Reseñas Verificadas
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Aprobá o solicitá cambios sobre los testimonios enviados por huéspedes con código de reserva.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[var(--color-sand-200)] text-[11px] font-bold text-[var(--color-sand-700)] self-start sm:self-auto">
          <MessageSquareText className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
          {items.length} {items.length === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[var(--color-sand-200)] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === tab.id
                ? 'bg-[var(--color-emerald-portal-600)] text-white shadow-xs'
                : 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {actionError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900">
          {actionError}
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando reseñas para moderación...
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-rose-200">
          <p className="text-sm font-semibold text-rose-900">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] flex flex-col items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[var(--color-sand-400)]" />
          <p className="text-sm font-semibold text-[var(--color-sand-900)]">
            No hay reseñas bajo este estado.
          </p>
          <span className="text-xs text-[var(--color-sand-400)]">
            Las nuevas opiniones verificadas aparecerán aquí para su revisión.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((review) => (
            <ReviewModerationCard
              key={review.id}
              review={review}
              onApprove={setReviewToApprove}
              onReject={setReviewToReject}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(reviewToApprove)}
        onClose={() => setReviewToApprove(null)}
        onConfirm={handleApprove}
        variant="emerald"
        title="Aprobar Reseña Verificada"
        description="¿Confirmás la publicación de esta reseña? Se sumará al promedio de calificaciones y será visible en la ficha pública del alojamiento."
        confirmLabel="Aprobar Reseña"
        isLoading={isSubmitting}
      />

      <ReviewRejectModal
        isOpen={Boolean(reviewToReject)}
        onClose={() => setReviewToReject(null)}
        review={reviewToReject}
        onSubmit={handleReject}
        isLoading={isSubmitting}
      />
    </section>
  );
};
