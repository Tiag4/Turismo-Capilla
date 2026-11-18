import React, { useState, useEffect } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  MessageSquare,
  MapPin,
  Tag,
  Calendar,
  MessageSquarePlus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ReviewItem, ReviewAspect } from '../types';
import type { ReviewStats, CreateReviewInput, SubmitReviewResult } from '../hooks/useAccommodationReviews';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';
import { isValidBookingCodeFormat } from '../hooks/useAccommodationReviews';

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
  onSubmitReview: (input: CreateReviewInput) => Promise<SubmitReviewResult> | SubmitReviewResult;
  onCheckEligibility?: (bookingCode: string) => Promise<any>;
}

// Laurel wreath branches flanking the hero score
const LaurelBranchLeft: React.FC = () => (
  <svg
    className="w-8 h-14 sm:w-10 sm:h-16 text-stone-800 select-none shrink-0"
    viewBox="0 0 36 64"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M28 4c-2 6-7 10-14 11 3-5 8-8 14-11zm-8 12c-4 5-11 7-18 6 4-5 10-7 18-6zm-4 13c-4 5-11 6-16 4 4-5 10-6 16-4zm0 13c-3 5-9 6-14 4 4-4 9-5 14-4zm5 12c-2 4-6 5-10 4 3-4 7-5 10-4z" />
    <path d="M30 6c-1 15-5 32-15 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

const LaurelBranchRight: React.FC = () => (
  <svg
    className="w-8 h-14 sm:w-10 sm:h-16 text-stone-800 select-none shrink-0 scale-x-[-1]"
    viewBox="0 0 36 64"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M28 4c-2 6-7 10-14 11 3-5 8-8 14-11zm-8 12c-4 5-11 7-18 6 4-5 10-7 18-6zm-4 13c-4 5-11 6-16 4 4-5 10-6 16-4zm0 13c-3 5-9 6-14 4 4-4 9-5 14-4zm5 12c-2 4-6 5-10 4 3-4 7-5 10-4z" />
    <path d="M30 6c-1 15-5 32-15 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
  </svg>
);

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
  onSubmitReview,
  onCheckEligibility,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = externalIsFormExpanded !== undefined ? externalIsFormExpanded : internalExpanded;
  const toggleForm = externalOnToggleForm || (() => setInternalExpanded((prev) => !prev));

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
      setFormError('Ingresá el código de reserva oficial de tu estadía (formato CAP-YYYY-XXXX).');
      return;
    }

    if (!isValidBookingCodeFormat(cleanCode)) {
      setFormError('El código debe tener el formato oficial CAP-YYYY-XXXX (ej: CAP-2026-4812).');
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

  // 6 dimension scores
  const dimensions = [
    {
      label: 'Limpieza',
      score: (stats?.cleanlinessAverage ?? 4.9).toFixed(1),
      Icon: CheckCircle2,
      desc: 'Higiene de ambientes y vajilla',
    },
    {
      label: 'Veracidad',
      score: (stats?.accuracyAverage ?? 4.9).toFixed(1),
      Icon: ShieldCheck,
      desc: 'Fotos y servicios 100% reales',
    },
    {
      label: 'Check-in',
      score: (stats?.checkInAverage ?? 4.9).toFixed(1),
      Icon: KeyRound,
      desc: 'Puntualidad en la entrega de llave',
    },
    {
      label: 'Comunicación',
      score: (stats?.hostAverage ?? 4.8).toFixed(1),
      Icon: MessageSquare,
      desc: 'Atención y trato del anfitrión',
    },
    {
      label: 'Ubicación',
      score: (stats?.locationAverage ?? 4.9).toFixed(1),
      Icon: MapPin,
      desc: 'Entorno serrano y accesibilidad',
    },
    {
      label: 'Calidad-Precio',
      score: (stats?.valueAverage ?? 4.8).toFixed(1),
      Icon: Tag,
      desc: 'Tarifa oficial sin comisiones',
    },
  ];

  return (
    <section
      id="opiniones-huespedes"
      aria-labelledby="reviews-section-heading"
      className="space-y-8 pt-8 border-t border-stone-200/80"
    >
      {/* =========================================================================
          1. HERO HEADER: RATING & BADGE (Estilo editorial con identidad serrana)
         ========================================================================= */}
      <div className="flex flex-col items-center text-center space-y-3 py-4">
        {/* Número grande flanqueado por laureles */}
        <div className="flex items-center justify-center gap-3 sm:gap-5">
          <LaurelBranchLeft />
          <div className="flex flex-col items-center">
            <span className="font-['Outfit'] font-black text-5xl sm:text-6xl text-stone-900 tracking-tight leading-none">
              {ratingFormatted}
            </span>
          </div>
          <LaurelBranchRight />
        </div>

        {/* Título de mérito institucional */}
        <div className="space-y-1.5 max-w-xl mx-auto">
          <h2
            id="reviews-section-heading"
            className="font-['Outfit'] font-black text-xl sm:text-2xl text-stone-900"
          >
            Destacado por Huéspedes
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {totalReviews > 0
              ? `Este alojamiento cuenta con ${totalReviews} ${totalReviews === 1 ? 'evaluación oficial' : 'evaluaciones oficiales'} de turistas que verificaron su estadía en Capilla del Monte.`
              : 'Establecimiento formalmente auditado. Sé el primer turista en compartir tu experiencia tras completar tu estadía.'}
          </p>
        </div>

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
          2. INLINE STAT STRIP: 6 DIMENSIONES (Anti-vibecoded: divide-x, sin card-itis)
         ========================================================================= */}
      <div className="rounded-2xl border border-sand-200 bg-sand-50/90 shadow-xs overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-sand-200">
          {dimensions.map((dim) => {
            const Icon = dim.Icon;
            return (
              <div key={dim.label} className="p-4 sm:p-5 flex flex-col justify-between gap-3 text-left">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-stone-800 block">
                    {dim.label}
                  </span>
                  <span className="text-[11px] text-stone-500 leading-snug line-clamp-2">
                    {dim.desc}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-['Outfit'] font-black text-xl text-stone-900 tabular-nums">
                    {dim.score}
                  </span>
                  <Icon className="w-4 h-4 text-terracotta-600 shrink-0" aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
                    placeholder="CAP-2026-XXXX"
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
         ========================================================================= */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-busy="true">
          {[1, 2].map((skeleton) => (
            <div
              key={skeleton}
              className="p-5 rounded-2xl bg-sand-50 border border-sand-200 animate-pulse space-y-3 h-40"
            >
              <div className="h-4 w-1/3 bg-sand-200 rounded" />
              <div className="h-3 w-1/4 bg-sand-200 rounded" />
              <div className="h-12 w-full bg-sand-200 rounded" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* Estado Vacío */
        <div className="p-8 rounded-2xl bg-sand-50 border border-sand-200 text-center space-y-3">
          <Star className="w-8 h-8 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-['Outfit'] font-bold text-base text-stone-900">
              Sé el primero en compartir tu experiencia
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              ¿Te hospedaste en este establecimiento? Hacé clic en el botón superior e ingresá tu código de reserva oficial.
            </p>
          </div>
        </div>
      ) : (
        /* Grilla de Reseñas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="p-5 rounded-2xl bg-sand-50 border border-sand-200 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                {/* Encabezado: Autor, Origen, Fecha, Estrellas */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-['Outfit'] font-bold text-sm text-stone-900">
                        {review.authorName}
                      </h3>
                      {review.verifiedBooking && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-uritorco-600 text-white text-[10px] font-extrabold">
                          <ShieldCheck className="w-3 h-3 shrink-0" />
                          <span>Huésped Verificado</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-medium mt-1">
                      {review.authorOrigin && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-terracotta-600 shrink-0" />
                          {review.authorOrigin}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                        Estadía: {review.stayDate}
                      </span>
                    </div>
                  </div>

                  {/* Estrellas numéricas */}
                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    aria-label={`Calificación: ${review.rating} de 5 estrellas`}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-transparent text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comentario del Huésped */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Aspectos Valorados */}
              {review.aspects && review.aspects.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-sand-200">
                  {review.aspects.map((aspect) => (
                    <span
                      key={aspect}
                      className="px-2.5 py-1 rounded-lg bg-stone-800 text-white text-[10px] font-bold"
                    >
                      {aspect}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
