import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  MessageSquarePlus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import type { ReviewItem, ReviewAspect } from '../types';
import type { ReviewStats, CreateReviewInput, SubmitReviewResult } from '../hooks/useAccommodationReviews';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';
import { isValidBookingCodeFormat } from '../hooks/useAccommodationReviews';
import { AccommodationAllReviewsModal } from './AccommodationAllReviewsModal';
import { AccommodationRatingDimensionsStrip } from './AccommodationRatingDimensionsStrip';

interface AccommodationReviewsSectionProps {
  reviews: ReviewItem[];
  stats: ReviewStats;
  isLoading: boolean;
  submitSuccess: boolean;
  pendingModeration?: boolean;
  isSubmitting?: boolean;
  isFormExpanded?: boolean;
  onToggleForm?: () => void;
  initialBookingCode?: string;
  accommodationTitle?: string;
  onSubmitReview: (input: CreateReviewInput) => Promise<SubmitReviewResult> | SubmitReviewResult;
  onCheckEligibility?: (bookingCode: string) => Promise<any>;
}

const COMMENT_MAX_LENGTH = 160;

// Accessible Star Picker Component (WCAG 2.2 AA compliant, 44x44px touch targets)
interface StarRatingInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  idPrefix: string;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({ label, value, onChange, idPrefix }) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const activeRating = hoverValue || value;

  const handleKeyDown = (e: React.KeyboardEvent, starVal: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, starVal + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(1, starVal - 1));
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(starVal);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-sand-200/80 last:border-b-0">
      <span id={`${idPrefix}-label`} className="text-xs sm:text-sm font-bold text-stone-800">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${idPrefix}-label`}
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverValue(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} de 5 estrellas`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverValue(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg hover:bg-sand-200/60 focus:outline-none focus:ring-2 focus:ring-terracotta-500 cursor-pointer transition-colors"
          >
            <Star
              className={`w-5 h-5 transition-transform duration-150 ${
                star <= activeRating
                  ? 'fill-amber-500 text-amber-500 scale-110'
                  : 'fill-transparent text-stone-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-stone-600 w-6 text-center tabular-nums ml-1">
          {value}.0
        </span>
      </div>
    </div>
  );
};

export const AccommodationReviewsSection: React.FC<AccommodationReviewsSectionProps> = ({
  reviews,
  stats,
  isLoading,
  submitSuccess,
  pendingModeration = false,
  isSubmitting = false,
  isFormExpanded: externalIsFormExpanded,
  onToggleForm: externalOnToggleForm,
  initialBookingCode = '',
  accommodationTitle = 'Alojamiento',
  onSubmitReview,
  onCheckEligibility,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = externalIsFormExpanded !== undefined ? externalIsFormExpanded : internalExpanded;
  const toggleForm = externalOnToggleForm || (() => setInternalExpanded((prev) => !prev));

  // Reviews Viewer Modal State
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState<boolean>(false);
  const [selectedReviewIdForModal, setSelectedReviewIdForModal] = useState<string | undefined>(undefined);

  const handleOpenAllReviews = (reviewId?: string) => {
    setSelectedReviewIdForModal(reviewId);
    setIsAllReviewsModalOpen(true);
  };

  // Form State
  const [bookingCode, setBookingCode] = useState<string>(initialBookingCode);
  const [overallRating, setOverallRating] = useState<number>(5);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(5);
  const [accuracyRating, setAccuracyRating] = useState<number>(5);
  const [checkInRating, setCheckInRating] = useState<number>(5);
  const [hostRating, setHostRating] = useState<number>(5);
  const [locationRating, setLocationRating] = useState<number>(5);
  const [valueRating, setValueRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [guestName, setGuestName] = useState<string>('');
  const [guestOrigin, setGuestOrigin] = useState<string>('');
  const [stayDate, setStayDate] = useState<string>('');
  const [selectedAspects, setSelectedAspects] = useState<ReviewAspect[]>([
    'Limpieza impecable',
    'Atención del anfitrión',
  ]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerifyingEligibility, setIsVerifyingEligibility] = useState<boolean>(false);
  const [eligibilityVerified, setEligibilityVerified] = useState<boolean>(false);

  useEffect(() => {
    if (initialBookingCode && initialBookingCode !== bookingCode) {
      setBookingCode(initialBookingCode);
    }
  }, [initialBookingCode]);

  // Eligibility auto-check when bookingCode is valid
  useEffect(() => {
    const clean = bookingCode.trim().toUpperCase();
    if (!isValidBookingCodeFormat(clean) || !onCheckEligibility) {
      setEligibilityVerified(false);
      return;
    }

    let active = true;
    setIsVerifyingEligibility(true);
    onCheckEligibility(clean)
      .then((el) => {
        if (!active || !el) return;
        if (el.canReview) {
          setEligibilityVerified(true);
          if (el.guestName) setGuestName(el.guestName);
          if (el.checkIn && el.checkOut) {
            setStayDate(`${el.checkIn} al ${el.checkOut}`);
          }
          setFormError(null);
        } else {
          setEligibilityVerified(false);
          setFormError(el.reason || 'Esta reserva no está habilitada para calificar.');
        }
      })
      .catch(() => {
        if (active) setEligibilityVerified(false);
      })
      .finally(() => {
        if (active) setIsVerifyingEligibility(false);
      });

    return () => {
      active = false;
    };
  }, [bookingCode, onCheckEligibility]);

  const toggleAspect = (aspect: ReviewAspect) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanCode = bookingCode.trim().toUpperCase();
    if (!cleanCode) {
      setFormError('Ingresá el código de reserva oficial de tu estadía (ej: CAP-2026-K9M4X7Q2 o CAP-2026-4812).');
      return;
    }

    if (!isValidBookingCodeFormat(cleanCode)) {
      setFormError('El código debe tener el formato oficial CAP-YYYY-XXXXXXXX (ej: CAP-2026-K9M4X7Q2 o CAP-2026-4812).');
      return;
    }

    if (comment.trim().length < 20) {
      setFormError(`El comentario debe tener al menos 20 caracteres (actual: ${comment.trim().length}).`);
      return;
    }

    const res = await onSubmitReview({
      bookingCode: cleanCode,
      rating: overallRating,
      cleanlinessRating,
      accuracyRating,
      checkInRating,
      hostRating,
      locationRating,
      valueRating,
      comment: comment.trim(),
      aspects: selectedAspects,
      authorName: guestName.trim() || 'Turista Huésped',
      authorOrigin: guestOrigin.trim() || undefined,
      stayDate: stayDate.trim() || 'Estadía reciente',
    });

    if (!res.ok) {
      setFormError(res.error || 'Ocurrió un error al enviar la calificación.');
    } else {
      setComment('');
      if (externalOnToggleForm) {
        externalOnToggleForm();
      } else {
        setInternalExpanded(false);
      }
    }
  };

  const totalReviews = stats?.totalReviews ?? reviews.length;
  const averageRating = stats?.averageRating ?? 0;
  const ratingFormatted = averageRating > 0 ? averageRating.toFixed(2).replace('.', ',') : '0,0';

  return (
    <section
      id="opiniones-huespedes"
      aria-labelledby="reviews-section-heading"
      className="space-y-8 pt-10 border-t border-stone-200/80"
    >
      {/* =========================================================================
          1. HERO HEADER: RATING & BADGE (Limpio, tipográfico, sin laureles)
         ========================================================================= */}
      <div className="flex flex-col items-center text-center space-y-3 py-4">
        {totalReviews > 0 ? (
          <>
            <div className="flex items-center justify-center">
              <span className="font-['Outfit'] font-black text-5xl sm:text-6xl text-stone-900 tracking-tight leading-none">
                {ratingFormatted}
              </span>
            </div>

            <div className="space-y-1.5 max-w-xl mx-auto">
              <h2
                id="reviews-section-heading"
                className="font-['Outfit'] font-black text-xl sm:text-2xl text-stone-900"
              >
                Favorito entre huéspedes
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Este alojamiento es uno de los preferidos entre los huéspedes según las calificaciones,
                las evaluaciones y la fiabilidad de sus servicios en Capilla del Monte.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 max-w-xl mx-auto">
            <h2
              id="reviews-section-heading"
              className="font-['Outfit'] font-black text-xl sm:text-2xl text-stone-900"
            >
              Evaluaciones de Huéspedes
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Establecimiento formalmente auditado por la Cámara de Turismo. Sé el primer turista en compartir tu experiencia tras completar tu estadía.
            </p>
          </div>
        )}

        {/* Botón de acción para desplegar el formulario INLINE */}
        <div className="pt-2">
          <button
            type="button"
            onClick={toggleForm}
            aria-expanded={isExpanded}
            aria-controls="inline-review-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-['Outfit'] font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{isExpanded ? 'Ocultar formulario' : 'Dejar mi opinión sobre la estadía'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-0.5" /> : <ChevronDown className="w-4 h-4 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. INLINE STAT STRIP: 6 DIMENSIONES
             - En mobile (< md) se OCULTA totalmente (hidden md:flex) para evitar
               scrolls horizontales inaceptables en pantallas pequeñas.
             - En desktop/tablet (md en adelante) es 100% fluido (w-full flex)
               sin scrollbars y con el histograma sin cortes de texto.
         ========================================================================= */}
      {totalReviews > 0 && (
        <AccommodationRatingDimensionsStrip
          stats={stats}
          totalReviews={totalReviews}
          className="hidden md:flex"
        />
      )}

      {/* Línea horizontal divisoria debajo de las dimensiones */}
      <div className="border-b border-stone-200/80 my-6 sm:my-8" />

      {/* Feedback Banner post-publicación */}
      {submitSuccess && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-sand-100 border border-sand-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-uritorco-600 text-white text-[11px] font-extrabold uppercase">
              {pendingModeration ? 'En moderación' : 'Publicada'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-uritorco-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-stone-900">
              {pendingModeration
                ? '¡Gracias! Tu reseña fue enviada a moderación municipal y se publicará en la ficha oficial al ser aprobada.'
                : '¡Gracias por tu aporte! Tu reseña ya se sumó al promedio del alojamiento.'}
            </span>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. FORMULARIO INLINE (Directo en la página para eliminar modales invasivos)
         ========================================================================= */}
      {isExpanded && (
        <div
          id="inline-review-form"
          className="p-5 sm:p-8 rounded-3xl bg-sand-50 border-2 border-terracotta-500/30 space-y-6 shadow-sm animate-in fade-in duration-200"
        >
          <div className="border-b border-sand-200 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-stone-900 text-white text-[10px] font-black uppercase tracking-wider">
                Verificación Oficial
              </span>
              <h3 className="font-['Outfit'] font-black text-lg sm:text-xl text-stone-900">
                Calificar mi experiencia en este alojamiento
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Ingresá el código de tu reserva completada para certificar que tu opinión corresponde a una estadía real.
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fila de Código y Datos del Huésped */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="review-booking-code" className="text-xs font-bold text-stone-800 block mb-1">
                  Código de Reserva Oficial *
                </label>
                <div className="relative">
                  <input
                    id="review-booking-code"
                    type="text"
                    required
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    placeholder="CAP-2026-K9M4X7Q2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-xs sm:text-sm text-stone-900 font-mono font-bold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  />
                  {isVerifyingEligibility && (
                    <span className="absolute right-3 top-2.5 text-[11px] text-stone-500 animate-pulse">
                      Verificando...
                    </span>
                  )}
                  {eligibilityVerified && (
                    <ShieldCheck className="absolute right-3 top-2.5 w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <span className="text-[11px] text-stone-500 mt-1 block">
                  Enviado a tu correo en el voucher oficial.
                </span>
              </div>

              <div>
                <label htmlFor="review-guest-name" className="text-xs font-bold text-stone-800 block mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  id="review-guest-name"
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="ej. Mariana Rossi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label htmlFor="review-guest-origin" className="text-xs font-bold text-stone-800 block mb-1">
                  Ciudad de origen
                </label>
                <input
                  id="review-guest-origin"
                  type="text"
                  value={guestOrigin}
                  onChange={(e) => setGuestOrigin(e.target.value)}
                  placeholder="ej. Rosario, Santa Fe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
              </div>
            </div>

            {/* Calificación General Destacada */}
            <div className="p-4 rounded-2xl bg-white border border-sand-200">
              <StarRatingInput
                idPrefix="overall-rating"
                label="Calificación General de la Estadía"
                value={overallRating}
                onChange={setOverallRating}
              />
            </div>

            {/* Desglose de los 6 Criterios Específicos */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-stone-400 block mb-3 font-['Outfit']">
                Evaluación Detallada por Criterios
              </span>

              <StarRatingInput
                idPrefix="cleanliness-rating"
                label="Limpieza e Higiene de los Ambientes"
                value={cleanlinessRating}
                onChange={setCleanlinessRating}
              />

              <StarRatingInput
                idPrefix="accuracy-rating"
                label="Veracidad del Anuncio y Servicios Ofrecidos"
                value={accuracyRating}
                onChange={setAccuracyRating}
              />

              <StarRatingInput
                idPrefix="checkin-rating"
                label="Llegada y Entrega de Llaves (Check-in)"
                value={checkInRating}
                onChange={setCheckInRating}
              />

              <StarRatingInput
                idPrefix="host-rating"
                label="Comunicación y Atención del Prestador"
                value={hostRating}
                onChange={setHostRating}
              />

              <StarRatingInput
                idPrefix="location-rating"
                label="Ubicación, Vistas y Entorno Serrano"
                value={locationRating}
                onChange={setLocationRating}
              />

              <StarRatingInput
                idPrefix="value-rating"
                label="Relación Calidad / Precio de la Estadía"
                value={valueRating}
                onChange={setValueRating}
              />
            </div>

            {/* Comentario Escrito */}
            <div>
              <label htmlFor="review-comment" className="text-xs font-bold text-stone-800 block mb-1">
                Tu opinión detallada *
              </label>
              <textarea
                id="review-comment"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Contale a otros turistas qué fue lo que más disfrutaste: el parque, la vista a las sierras, el desayuno, la tranquilidad nocturna o la atención recibida..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-300 bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
              <div className="flex justify-between items-center text-[11px] text-stone-500 mt-1">
                <span>Mínimo 20 caracteres (sin enlaces promocionales).</span>
                <span className="font-bold tabular-nums">{comment.length} / 2000</span>
              </div>
            </div>

            {/* Aspectos Destacados (Chips) */}
            <div>
              <span className="text-xs font-bold text-stone-800 block mb-2">
                ¿Qué aspectos destacarías especialmente?
              </span>
              <div className="flex flex-wrap gap-2">
                {REVIEW_ASPECT_OPTIONS.map((aspect) => {
                  const selected = selectedAspects.includes(aspect);
                  return (
                    <button
                      key={aspect}
                      type="button"
                      onClick={() => toggleAspect(aspect)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                        selected
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-sand-300 hover:border-sand-400'
                      }`}
                    >
                      {aspect}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Acciones del Formulario */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
              <button
                type="button"
                onClick={toggleForm}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-sand-200/50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-['Outfit'] font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Enviando calificación...</span>
                  </>
                ) : (
                  <>
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>Publicar mi opinión</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          4. LISTADO DE RESEÑAS DE HUÉSPEDES
             - 2 columnas despojadas de cajas.
             - Reseñas largas muestran "Mostrar más >" y abren el modal posicionando
               directamente en esa reseña completa.
             - Botón "Mostrar las X evaluaciones" al final.
         ========================================================================= */}
      <div className="space-y-6">
        <h3 className="font-['Outfit'] font-black text-xl sm:text-2xl text-stone-900">
          Dicho por los huéspedes
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10" aria-busy="true">
            {[1, 2].map((skeleton) => (
              <div key={skeleton} className="animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-sand-200" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-1/3 bg-sand-200 rounded" />
                    <div className="h-3 w-1/4 bg-sand-200 rounded" />
                  </div>
                </div>
                <div className="h-3 w-1/2 bg-sand-200 rounded" />
                <div className="h-14 w-full bg-sand-200 rounded" />
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          /* Estado Vacío: sin caja ni tarjetitis */
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center mx-auto text-amber-500">
              <Star className="w-6 h-6 fill-amber-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-['Outfit'] font-bold text-base text-stone-900">
                Sé el primero en compartir tu experiencia
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                ¿Te hospedaste en este establecimiento? Hacé clic en el botón superior e ingresá tu código de reserva oficial.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Grilla de Reseñas en 2 columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 sm:gap-y-12">
              {reviews.map((review) => {
                const isLong = review.comment.length > COMMENT_MAX_LENGTH;
                const displayText = isLong
                  ? `${review.comment.slice(0, COMMENT_MAX_LENGTH).trim()}...`
                  : review.comment;

                return (
                  <article key={review.id} className="space-y-3 text-left">
                    {/* Perfil del Huésped */}
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-stone-800 text-white font-['Outfit'] font-bold text-sm flex items-center justify-center shrink-0 uppercase shadow-xs">
                        {review.authorName.charAt(0)}
                      </div>
                      <div className="leading-tight">
                        <h4 className="font-['Outfit'] font-bold text-sm sm:text-base text-stone-900">
                          {review.authorName}
                        </h4>
                        <p className="text-xs text-stone-500 font-normal mt-0.5">
                          {review.authorOrigin || 'Turista Visitante'}
                        </p>
                      </div>
                    </div>

                    {/* Estrellas + Fecha + Badge verificado */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                      <div
                        className="flex items-center gap-0.5 shrink-0"
                        aria-label={`Calificación: ${review.rating} de 5 estrellas`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= review.rating
                                ? 'fill-stone-900 text-stone-900'
                                : 'fill-transparent text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-stone-300">·</span>
                      <span className="font-medium text-stone-700">{review.stayDate}</span>
                      {review.verifiedBooking && (
                        <>
                          <span className="text-stone-300">·</span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Huésped Verificado
                          </span>
                        </>
                      )}
                    </div>

                    {/* Comentario del Huésped con enlace "Mostrar más" si es extenso */}
                    <div className="space-y-1">
                      <p className="text-sm text-stone-800 leading-relaxed font-normal">
                        {displayText}
                      </p>
                      {isLong && (
                        <button
                          type="button"
                          onClick={() => handleOpenAllReviews(review.id)}
                          className="inline-flex items-center gap-1 font-bold underline text-stone-900 hover:text-terracotta-600 text-xs sm:text-sm cursor-pointer transition-colors"
                        >
                          <span>Mostrar más</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Aspectos Destacados como sutiles badges planos */}
                    {review.aspects && review.aspects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {review.aspects.map((aspect) => (
                          <span
                            key={aspect}
                            className="px-2.5 py-0.5 rounded-md bg-sand-100 text-stone-700 text-[11px] font-medium"
                          >
                            {aspect}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>

            {/* Botón inferior: Mostrar todas las evaluaciones (Estilo Airbnb) */}
            {reviews.length > 0 && (
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => handleOpenAllReviews()}
                  className="px-6 py-3 rounded-xl border border-stone-900 hover:bg-stone-900 hover:text-white font-['Outfit'] font-bold text-xs sm:text-sm text-stone-900 transition-colors cursor-pointer shadow-xs"
                >
                  Mostrar las {totalReviews} evaluaciones
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* =========================================================================
          5. MODAL COMPLETO DE EVALUACIONES (Estilo Airbnb: lista scrolleable,
             búsqueda por filtros y auto-scroll a reseña seleccionada)
         ========================================================================= */}
      <AccommodationAllReviewsModal
        isOpen={isAllReviewsModalOpen}
        onClose={() => {
          setIsAllReviewsModalOpen(false);
          setSelectedReviewIdForModal(undefined);
        }}
        reviews={reviews}
        stats={stats}
        accommodationTitle={accommodationTitle}
        initialReviewId={selectedReviewIdForModal}
      />
    </section>
  );
};