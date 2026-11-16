import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Star, ShieldCheck, X, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ReviewAspect } from '../types';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';
import type { CreateReviewInput, SubmitReviewResult } from '../hooks/useAccommodationReviews';
import { useAnimatedPresence } from '../../../../hooks/useAnimatedPresence';
import { useBodyScrollLock } from '../../../../hooks/useBodyScrollLock';
import { CustomSelect, type Option } from '../../../ui/CustomSelect';

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
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 200);

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

  useBodyScrollLock(shouldRender);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || typeof document === 'undefined') return null;

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

  return createPortal(
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xl max-h-[88vh] overflow-hidden rounded-3xl bg-sand-50 border border-sand-300 shadow-2xl flex flex-col transition-all duration-200 transform ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Cabecera fija */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 border-b border-sand-200 bg-sand-50">
          <div>
            <h2
              id="review-modal-title"
              className="font-display font-black text-xl sm:text-2xl text-stone-900"
            >
              Calificar estadía
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
              {accommodationTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario de reseña"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-sand-200 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-uritorco-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-stone-900">
                  {isPendingModeration ? '¡Reseña enviada a moderación!' : '¡Gracias por compartir tu experiencia!'}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  {isPendingModeration
                    ? 'Tu opinión fue registrada correctamente y se publicará en la ficha del alojamiento una vez validada por la Comisión de Turismo.'
                    : 'Tu opinión ya fue publicada en la ficha del alojamiento y ayuda a futuros viajeros a elegir con confianza en Capilla del Monte.'}
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-display font-bold text-sm transition-colors cursor-pointer"
                >
                  Volver a la ficha del alojamiento
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Selector Interactivo de Estrellas (Accesible por teclado) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Calificación General *
                </label>
                <div
                  role="radiogroup"
                  aria-label="Seleccionar calificación de 1 a 5 estrellas"
                  className="flex items-center gap-2"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= activeStars;
                    const isSelected = star === rating;
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onKeyDown={(e) => handleStarKeyDown(e, star)}
                        className="p-2 rounded-xl hover:bg-sand-200/70 focus:outline-none focus:ring-2 focus:ring-terracotta-500 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            isFilled
                              ? 'fill-amber-500 text-amber-500'
                              : 'fill-transparent text-stone-300'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-semibold text-stone-700">
                  {RATING_LABELS[activeStars]}
                </p>
              </div>

              {/* Datos del Huésped */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="review-author"
                    className="block text-xs font-bold text-stone-800 mb-1.5"
                  >
                    Tu nombre *
                  </label>
                  <input
                    id="review-author"
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Ej. Martín Pereyra"
                    maxLength={60}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-origin"
                    className="block text-xs font-bold text-stone-800 mb-1.5"
                  >
                    Ciudad / Provincia (opcional)
                  </label>
                  <input
                    id="review-origin"
                    type="text"
                    value={authorOrigin}
                    onChange={(e) => setAuthorOrigin(e.target.value)}
                    placeholder="Ej. Rosario, Santa Fe"
                    maxLength={50}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm text-stone-900 focus:outline-none focus:border-terracotta-500"
                  />
                </div>
              </div>

              {/* Fecha de Estadía y Código de Reserva Verificada */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-stone-800 mb-1.5">
                    Mes de la estadía
                  </span>
                  <CustomSelect
                    label="Mes de la estadía"
                    variant="form"
                    value={stayDate}
                    onChange={setStayDate}
                    options={STAY_MONTH_OPTIONS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="review-booking-code"
                    className="block text-xs font-bold text-stone-800 mb-1.5"
                  >
                    Código de reserva *
                  </label>
                  <input
                    id="review-booking-code"
                    type="text"
                    required
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    placeholder="CAP-2026-XXXX"
                    maxLength={16}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-sand-300 text-sm font-mono uppercase text-stone-900 focus:outline-none focus:border-terracotta-500"
                  />
                  <span className="mt-1 flex items-center gap-1 text-[11px] text-stone-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-uritorco-600 shrink-0" />
                    Requerido para verificar tu estadía
                  </span>
                </div>
              </div>

              {/* Aspectos Destacados */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-stone-800">
                  ¿Qué aspectos destacás de tu estadía?
                </span>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_ASPECT_OPTIONS.map((aspect) => {
                    const active = selectedAspects.includes(aspect);
                    return (
                      <button
                        key={aspect}
                        type="button"
                        onClick={() => toggleAspect(aspect)}
                        aria-pressed={active}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-uritorco-600 text-white'
                            : 'bg-sand-200/70 text-stone-700 hover:bg-sand-200'
                        }`}
                      >
                        {aspect}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comentario */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="review-comment"
                    className="block text-xs font-bold text-stone-800"
                  >
                    Tu experiencia en el alojamiento *
                  </label>
                  <span
                    className={`text-[11px] font-semibold ${
                      comment.trim().length >= 20 ? 'text-uritorco-600' : 'text-stone-500'
                    }`}
                  >
                    {comment.trim().length} / mín. 20 caracteres
                  </span>
                </div>
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
        </div>
      </div>
    </div>,
    document.body
  );
};
