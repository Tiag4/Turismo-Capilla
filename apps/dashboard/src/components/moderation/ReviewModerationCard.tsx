import React from 'react';
import { AlertCircle, Check, CheckCircle, Clock, MessageSquare, Star } from 'lucide-react';
import type { DashboardReview } from '../../types/review.types.ts';
import { Button } from '../ui/Button.tsx';

interface ReviewModerationCardProps {
  review: DashboardReview;
  onApprove: (id: string) => void;
  onReject: (review: DashboardReview) => void;
}

const STATUS_BADGES = {
  PENDING: {
    label: 'Pendiente de Revisión',
    className: 'bg-amber-600 text-white',
    icon: Clock,
  },
  APPROVED: {
    label: 'Aprobada para Portal',
    className: 'bg-[#005530] text-white',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Cambios Solicitados',
    className: 'bg-rose-700 text-white',
    icon: AlertCircle,
  },
} as const;

const StarRow: React.FC<{ value: number }> = ({ value }) => (
  <span className="inline-flex items-center gap-0.5" aria-label={`${value} de 5 estrellas`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-3.5 h-3.5 ${
          star <= value ? 'fill-amber-500 text-amber-500' : 'fill-transparent text-sand-300'
        }`}
      />
    ))}
  </span>
);

export const ReviewModerationCard: React.FC<ReviewModerationCardProps> = ({
  review,
  onApprove,
  onReject,
}) => {
  const badge = STATUS_BADGES[review.status];
  const BadgeIcon = badge.icon;

  return (
    <article className="bg-white border border-[var(--color-sand-200)] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        <div className="relative h-28 w-full bg-[var(--color-sand-200)] overflow-hidden">
          {review.accommodationImageUrl ? (
            <img
              src={review.accommodationImageUrl}
              alt={review.accommodationName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--color-sand-100)] text-[var(--color-sand-500)] text-xs font-bold">
              Sin fotografía
            </div>
          )}
          <div className="absolute top-2.5 right-2.5">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${badge.className}`}
            >
              <BadgeIcon className="w-3 h-3 shrink-0" />
              <span>{badge.label}</span>
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-xs font-bold text-[var(--color-sand-900)] font-['Outfit']">
                {review.accommodationName}
              </h3>
              <span className="text-[11px] text-[var(--color-sand-500)]">
                {review.guestName} · {review.bookingCode}
              </span>
            </div>
            <span className="text-[10px] text-[var(--color-sand-400)] shrink-0">
              {new Date(review.createdAt).toLocaleDateString('es-AR')}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StarRow value={review.rating} />
            <span className="text-[11px] font-bold text-[var(--color-sand-800)]">
              {review.rating}/5
            </span>
            {review.guestOrigin && (
              <span className="text-[10px] text-[var(--color-sand-500)]">{review.guestOrigin}</span>
            )}
          </div>

          <p className="text-xs text-[var(--color-sand-800)] leading-relaxed line-clamp-4">
            “{review.comment}”
          </p>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] text-[var(--color-sand-600)]">
            <span className="p-1.5 rounded-lg bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
              Limpieza: <strong>{review.cleanlinessRating}/5</strong>
            </span>
            <span className="p-1.5 rounded-lg bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
              Anfitrión: <strong>{review.hostRating}/5</strong>
            </span>
            <span className="p-1.5 rounded-lg bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
              Ubicación: <strong>{review.locationRating}/5</strong>
            </span>
          </div>

          {review.moderationNotes && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-950">
              <span className="font-bold block mb-0.5">Observación Notificada:</span>
              {review.moderationNotes}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReject(review)}
          className="text-xs"
          title="Solicitar cambios sobre la reseña"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
          <span>Observar</span>
        </Button>

        <Button
          variant="emerald"
          size="sm"
          disabled={review.status === 'APPROVED'}
          onClick={() => onApprove(review.id)}
          className="text-xs"
          title="Aprobar la reseña para el portal público"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{review.status === 'APPROVED' ? 'Aprobada' : 'Aprobar'}</span>
        </Button>
      </div>
    </article>
  );
};
