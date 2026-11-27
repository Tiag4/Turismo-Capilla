import React, { useState } from 'react';
import { CalendarDays, Loader2, Send, ShieldCheck } from 'lucide-react';
import { StarRatingInput } from './StarRatingInput';
import type { CreateReviewPayload, ReviewEligibility } from '../../types/review.types';

interface ReviewSubmissionFormProps {
  eligibility: ReviewEligibility;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (payload: CreateReviewPayload) => Promise<unknown>;
}

export const ReviewSubmissionForm: React.FC<ReviewSubmissionFormProps> = ({
  eligibility,
  isSubmitting,
  submitError,
  onSubmit,
}) => {
  const [rating, setRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [hostRating, setHostRating] = useState(5);
  const [locationRating, setLocationRating] = useState(5);
  const [guestOrigin, setGuestOrigin] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanComment = comment.trim();

    if (cleanComment.length < 20) {
      setError('El comentario debe tener al menos 20 caracteres.');
      return;
    }

    setError(null);
    try {
      await onSubmit({
        bookingCode: eligibility.bookingCode,
        rating,
        cleanlinessRating,
        hostRating,
        locationRating,
        comment: cleanComment,
        guestOrigin: guestOrigin.trim() || undefined,
      });
    } catch {
      // El error de envío se muestra desde el hook contenedor.
    }
  };

  const visibleError = error || submitError;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="p-4 rounded-2xl bg-sand-50 border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-uritorco-700 block">
            Estadía verificada
          </span>
          <h2 className="font-display font-black text-lg text-sand-950">
            {eligibility.accommodationName}
          </h2>
          <span className="text-xs text-sand-600">
            {eligibility.guestName} · Reserva {eligibility.bookingCode}
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sand-300 text-xs font-bold text-sand-800 self-start sm:self-auto">
          <CalendarDays className="w-4 h-4 text-terracotta-500" />
          {eligibility.checkIn} → {eligibility.checkOut}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StarRatingInput
          label="Calificación general"
          value={rating}
          onChange={setRating}
          helperText="Tu experiencia global en el alojamiento."
        />
        <StarRatingInput
          label="Limpieza e instalaciones"
          value={cleanlinessRating}
          onChange={setCleanlinessRating}
        />
        <StarRatingInput
          label="Atención del anfitrión"
          value={hostRating}
          onChange={setHostRating}
        />
        <StarRatingInput
          label="Ubicación y entorno serrano"
          value={locationRating}
          onChange={setLocationRating}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="review-origin" className="text-xs font-bold uppercase tracking-wider text-sand-600">
          ¿Desde dónde nos visitaste? <span className="normal-case font-medium text-sand-400">(opcional)</span>
        </label>
        <input
          id="review-origin"
          type="text"
          value={guestOrigin}
          onChange={(event) => setGuestOrigin(event.target.value)}
          maxLength={100}
          placeholder="Ej: Córdoba Capital"
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="review-comment" className="text-xs font-bold uppercase tracking-wider text-sand-600">
          Tu testimonio para otros viajeros
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="Contá cómo fue tu estadía, la atención recibida y qué recomendás de Capilla del Monte..."
          className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-sm text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 resize-y"
        />
        <div className="flex items-center justify-between text-[11px] text-sand-500">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-uritorco-600" />
            La reseña pasará por moderación antes de publicarse.
          </span>
          <span>{comment.length} / 2000</span>
        </div>
      </div>

      {visibleError && (
        <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900">
          {visibleError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-sm transition-colors cursor-pointer"
      >
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{isSubmitting ? 'Enviando reseña...' : 'Enviar reseña verificada'}</span>
      </button>
    </form>
  );
};
