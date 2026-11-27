import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ReviewAspect } from '../types';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';
import type { CreateReviewInput, SubmitReviewResult } from '../hooks/useAccommodationReviews';
import { CustomSelect, type Option } from '../../../ui/CustomSelect';
import { AdaptiveModal } from '../../../ui/AdaptiveModal';

interface AccommodationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodationTitle: string;
  isSubmitting?: boolean;
  onSubmitReview: (input: CreateReviewInput) => Promise<SubmitReviewResult> | SubmitReviewResult;
}

const STAY_MONTH_OPTIONS: Option[] = [
  { value: 'Octubre 2026', label: 'Octubre 2026' },
  { value: 'Septiembre 2026', label: 'Septiembre 2026' },
  { value: 'Agosto 2026', label: 'Agosto 2026' },
  { value: 'Julio 2026', label: 'Julio 2026' },
  { value: 'Junio 2026', label: 'Junio 2026' },
  { value: 'Temporada Anterior', label: 'Temporada Anterior' },
];

const RATING_LABELS: Record<number, string> = {
  1: '1 estrella — Muy por debajo de lo esperado',
  2: '2 estrellas — Regular, aspectos por mejorar',
  3: '3 estrellas — Correcto, cumplió lo básico',
  4: '4 estrellas — Muy buena estadía serrana',
  5: '5 estrellas — Excelente experiencia, súper recomendable',
};

export const AccommodationReviewModal: React.FC<AccommodationReviewModalProps> = ({
  isOpen,
  onClose,
  accommodationTitle,
  isSubmitting = false,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState<string>('');
  const [authorOrigin, setAuthorOrigin] = useState<string>('');
  const [stayDate, setStayDate] = useState<string>(STAY_MONTH_OPTIONS[0].value);
  const [bookingCode, setBookingCode] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [selectedAspects, setSelectedAspects] = useState<ReviewAspect[]>([
    'Limpieza impecable',
    'Atención del anfitrión',
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPendingModeration, setIsPendingModeration] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsSuccess(false);
      setIsPendingModeration(false);
    }
  }, [isOpen]);

  const toggleAspect = (aspect: ReviewAspect) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const handleStarKeyDown = (e: React.KeyboardEvent, starVal: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setRating(Math.min(5, starVal + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setRating(Math.max(1, starVal - 1));
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setRating(starVal);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMsg(null);

    const res = await onSubmitReview({
      authorName,
      authorOrigin,
      stayDate,
      rating,
      comment,
      aspects: selectedAspects,
      bookingCode,
    });

    if (!res.ok) {
      setErrorMsg(res.error ?? 'Revisá los campos ingresados.');
      return;
    }

    setIsPendingModeration(Boolean(res.pendingModeration));
    setIsSuccess(true);
    setAuthorName('');
    setAuthorOrigin('');
    setBookingCode('');
    setComment('');
  };

  const activeStars = hoverRating || rating;

  return (
    <AdaptiveModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Calificar estadía"
      subtitle={accommodationTitle}
      bodyClassName="px-6 py-5 sm:px-8 sm:py-6"
    >
      {isSuccess ? (
        <div className="py-6 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-uritorco-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-stone-900">
              {isPendingModeration ? '¡Reseña enviada a moderación!' : '¡Gracias por compartir tu experiencia!'}
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              {isPendingModeration
                ? 'Tu opinión fue registrada correctamente y se publicará en la ficha del alojamiento una vez validada por la Cámara de Turismo.'
                : 'Tu opinión ya fue publicada en la ficha del alojamiento y ayuda a futuros viajeros a elegir con confianza en Capilla del Monte.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 px-6 py-2.5 rounded-xl bg-sand-900 hover:bg-sand-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Aceptar y cerrar
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Puntuación General con estrellas accesibles */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              Puntuación general *
            </label>
            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label="Calificación de 1 a 5 estrellas"
            >
              {[1, 2, 3, 4, 5].map((starVal) => {
                const filled = starVal <= activeStars;
                return (
                  <button
                    key={starVal}
                    type="button"
                    role="radio"
                    aria-checked={rating === starVal}
                    tabIndex={rating === starVal ? 0 : -1}
                    onKeyDown={(e) => handleStarKeyDown(e, starVal)}
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`${starVal} de 5 estrellas`}
                    className="p-1 rounded-lg hover:bg-sand-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  >
                    <Star
                      className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                        filled ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-stone-600 font-medium">
              {RATING_LABELS[activeStars] || ''}
            </p>
          </div>

          {/* Aspectos destacados */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
              ¿Qué destacarías de la estadía? (opcional)
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_ASPECT_OPTIONS.map((aspect) => {
                const selected = selectedAspects.includes(aspect);
                return (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => toggleAspect(aspect)}
                    aria-pressed={selected}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'bg-uritorco-600 text-white shadow-xs'
                        : 'bg-white border border-sand-300 text-stone-700 hover:bg-sand-100'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {aspect}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Datos del Huésped */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="review-author-name"
                className="text-xs font-bold text-stone-900 uppercase tracking-wider block"
              >
                Tu nombre *
              </label>
              <input
                id="review-author-name"
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej. Martín Gómez"
                maxLength={60}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="review-author-origin"
                className="text-xs font-bold text-stone-900 uppercase tracking-wider block"
              >
                Ciudad de origen (opcional)
              </label>
              <input
                id="review-author-origin"
                type="text"
                value={authorOrigin}
                onChange={(e) => setAuthorOrigin(e.target.value)}
                placeholder="Ej. Córdoba Capital, Rosario..."
                maxLength={60}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          {/* Mes de estadía y Código de reserva */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="review-stay-date"
                className="text-xs font-bold text-stone-900 uppercase tracking-wider block"
              >
                ¿Cuándo te hospedaste? *
              </label>
              <CustomSelect
                label="¿Cuándo te hospedaste?"
                options={STAY_MONTH_OPTIONS}
                value={stayDate}
                onChange={(val) => setStayDate(val)}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="review-booking-code"
                className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center justify-between"
              >
                <span>Código de reserva (opcional)</span>
                <span className="text-[10px] text-uritorco-700 font-bold lowercase flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  otorga insignia verificada
                </span>
              </label>
              <input
                id="review-booking-code"
                type="text"
                value={bookingCode}
                onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                placeholder="Ej. CAP-2026-8492"
                maxLength={20}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm font-mono text-stone-900 placeholder:font-sans uppercase focus:outline-none focus:border-terracotta-500"
              />
            </div>
          </div>

          {/* Comentario honesto */}
          <div className="space-y-1.5">
            <label
              htmlFor="review-comment"
              className="text-xs font-bold text-stone-900 uppercase tracking-wider block"
            >
              Tu opinión sobre la estadía *
            </label>
            <textarea
              id="review-comment"
              rows={4}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Contanos cómo fue la atención de los anfitriones, la comodidad de las instalaciones, la tranquilidad del lugar..."
              maxLength={600}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500 resize-none"
            />
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-sand-100 border border-sand-300 text-xs font-bold text-stone-900"
            >
              <span className="px-2 py-0.5 rounded-md bg-rose-700 text-white text-[10px] font-extrabold uppercase shrink-0">
                Atención
              </span>
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-sand-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </div>
        </form>
      )}
    </AdaptiveModal>
  );
};
