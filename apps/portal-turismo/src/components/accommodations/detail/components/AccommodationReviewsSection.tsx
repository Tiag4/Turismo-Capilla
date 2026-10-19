import React from 'react';
import { Star, ShieldCheck, MessageSquarePlus, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import type { ReviewItem } from '../types';
import type { ReviewStats } from '../hooks/useAccommodationReviews';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';

interface AccommodationReviewsSectionProps {
  reviews: ReviewItem[];
  stats: ReviewStats;
  isLoading: boolean;
  submitSuccess: boolean;
  onOpenReviewModal: () => void;
}

export const AccommodationReviewsSection: React.FC<AccommodationReviewsSectionProps> = ({
  reviews,
  stats,
  isLoading,
  submitSuccess,
  onOpenReviewModal,
}) => {
  return (
    <section
      id="opiniones-huespedes"
      aria-labelledby="reviews-section-heading"
      className="space-y-6 pt-8 border-t border-stone-200/80"
    >
      {/* Cabecera de la Sección */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="reviews-section-heading"
              className="font-display font-black text-xl sm:text-2xl text-stone-900"
            >
              Opiniones de Huéspedes
            </h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-900 text-white text-xs font-extrabold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{(stats?.averageRating ?? 4.9).toFixed(1)}</span>
              <span className="text-stone-300 font-medium">
                · {stats?.totalReviews ?? 0} {(stats?.totalReviews ?? 0) === 1 ? 'reseña' : 'reseñas'}
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Calificaciones reales de viajeros que se hospedaron en este establecimiento de Capilla del Monte
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenReviewModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Escribir una opinión</span>
        </button>
      </div>

      {/* Feedback Banner post-publicación */}
      {submitSuccess && (
        <div
          role="status"
          className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-sand-100 border border-sand-300"
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-uritorco-600 text-white text-[11px] font-extrabold uppercase">
              Publicada
            </span>
            <CheckCircle2 className="w-4 h-4 text-uritorco-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-stone-900">
              Tu reseña se sumó al promedio del alojamiento. ¡Gracias por tu aporte!
            </span>
          </div>
        </div>
      )}

      {/* Resumen de Aspectos Valorados */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {REVIEW_ASPECT_OPTIONS.map((aspect) => {
          const count = stats?.aspectCounts?.[aspect] ?? 0;
          return (
            <div
              key={aspect}
              className="p-3.5 rounded-2xl bg-sand-50 border border-sand-300/80 flex flex-col justify-between gap-1.5"
            >
              <span className="text-xs font-bold text-stone-800 leading-snug">{aspect}</span>
              <span className="text-[11px] font-semibold text-stone-500">
                {count > 0 ? `${count} menciones destacadas` : 'Aspecto evaluado'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Estado de Carga */}
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
        <div className="p-8 rounded-2xl bg-sand-50 border border-sand-300/80 text-center space-y-3">
          <Star className="w-8 h-8 text-amber-500 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-stone-900">
              Sé el primero en dejar una opinión
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              ¿Te hospedaste en este alojamiento? Contale a otros viajeros cómo fue tu experiencia en las sierras.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenReviewModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-display font-bold text-xs transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Calificar ahora</span>
          </button>
        </div>
      ) : (
        /* Grilla de Reseñas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="p-5 rounded-2xl bg-sand-50 border border-sand-300/80 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Encabezado de la tarjeta: Autor, Fecha, Estrellas y Badge Verificado */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-sm text-stone-900">
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
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-sand-200/80">
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
