import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Star,
  ShieldCheck,
  X,
  ArrowLeft,
  Search,
  Sparkles,
  KeyRound,
  MessageSquare,
  MapPin,
  Tag,
} from 'lucide-react';
import type { ReviewItem, ReviewAspect } from '../types';
import type { ReviewStats } from '../hooks/useAccommodationReviews';
import { REVIEW_ASPECT_OPTIONS } from '../data/mockReviews';
import { useAnimatedPresence } from '../../../../hooks/useAnimatedPresence';
import { useBodyScrollLock } from '../../../../hooks/useBodyScrollLock';

interface AccommodationAllReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ReviewItem[];
  stats: ReviewStats;
  accommodationTitle: string;
  initialReviewId?: string;
}

export const AccommodationAllReviewsModal: React.FC<AccommodationAllReviewsModalProps> = ({
  isOpen,
  onClose,
  reviews,
  stats,
  accommodationTitle,
  initialReviewId,
}) => {
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 200);
  useBodyScrollLock(shouldRender);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | undefined>(initialReviewId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial review target when modal opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedId(initialReviewId);
      setSearchQuery('');
      setSelectedAspect(null);

      if (initialReviewId) {
        // Auto scroll to target review once modal content renders
        const timer = setTimeout(() => {
          const el = document.getElementById(`modal-review-${initialReviewId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 220);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialReviewId]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesSearch =
        !searchQuery.trim() ||
        rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rev.authorOrigin && rev.authorOrigin.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesAspect =
        !selectedAspect || (rev.aspects && rev.aspects.includes(selectedAspect as ReviewAspect));

      return matchesSearch && matchesAspect;
    });
  }, [reviews, searchQuery, selectedAspect]);

  if (!shouldRender || typeof document === 'undefined') return null;

  const totalReviews = stats?.totalReviews ?? reviews.length;
  const averageRating = stats?.averageRating ?? 0;
  const ratingFormatted = averageRating > 0 ? averageRating.toFixed(2).replace('.', ',') : '0,0';

  const dimensions = [
    { label: 'Limpieza', score: (stats?.cleanlinessAverage ?? 5.0).toFixed(1).replace('.', ','), Icon: Sparkles },
    { label: 'Veracidad', score: (stats?.accuracyAverage ?? 5.0).toFixed(1).replace('.', ','), Icon: ShieldCheck },
    { label: 'Check-in', score: (stats?.checkInAverage ?? 5.0).toFixed(1).replace('.', ','), Icon: KeyRound },
    { label: 'Comunicación', score: (stats?.hostAverage ?? 5.0).toFixed(1).replace('.', ','), Icon: MessageSquare },
    { label: 'Ubicación', score: (stats?.locationAverage ?? 5.0).toFixed(1).replace('.', ','), Icon: MapPin },
    { label: 'Precio según calidad', score: (stats?.valueAverage ?? 4.8).toFixed(1).replace('.', ','), Icon: Tag },
  ];

  return createPortal(
    <div
      className={`fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="all-reviews-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal / Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-3xl lg:max-w-4xl h-[94vh] sm:h-[88vh] max-h-[94vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl bg-white border border-stone-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 transform ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 sm:scale-95 translate-y-8 sm:translate-y-3'
        }`}
      >
        {/* Header fijo */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-stone-200/80 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal de evaluaciones"
              className="p-2 -ml-2 rounded-full hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 sm:hidden" />
              <X className="w-5 h-5 hidden sm:block" />
            </button>
            <h2 id="all-reviews-modal-title" className="font-['Outfit'] font-black text-lg sm:text-xl text-stone-900 truncate max-w-[200px] sm:max-w-md">
              Evaluaciones de {accommodationTitle}
            </h2>
          </div>
          <span className="text-xs font-bold text-stone-500 tabular-nums">
            {totalReviews} {totalReviews === 1 ? 'opinión' : 'opiniones'}
          </span>
        </div>

        {/* Cuerpo scrolleable */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-8"
        >
          {/* Hero de Calificación General */}
          <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-stone-200/80">
            <span className="font-['Outfit'] font-black text-5xl sm:text-6xl text-stone-900 tracking-tight leading-none">
              {ratingFormatted}
            </span>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="font-['Outfit'] font-black text-xl text-stone-900">
                Favorito entre huéspedes
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Este alojamiento es uno de los preferidos según las evaluaciones verificadas, la hospitalidad y la fiabilidad en Capilla del Monte.
              </p>
            </div>
          </div>

          {/* Desglose de 6 Dimensiones (Grid limpio sin tarjetitis) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 pb-6 border-b border-stone-200/80">
            {dimensions.map((dim) => {
              const Icon = dim.Icon;
              return (
                <div
                  key={dim.label}
                  className="p-3 rounded-2xl bg-sand-50/80 border border-sand-200/60 flex flex-col justify-between h-24"
                >
                  <span className="text-xs font-semibold text-stone-700 block truncate">
                    {dim.label}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit'] font-black text-lg text-stone-900 tabular-nums">
                      {dim.score}
                    </span>
                    <Icon className="w-4 h-4 text-stone-700" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Barra de Búsqueda y Filtros de Aspectos */}
          <div className="space-y-3">
            {/* Input de Búsqueda */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por palabra clave (ej. desayuno, vista, limpieza, wifi)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 bg-sand-50/40 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 top-2.5 p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chips de Categorías / Aspectos */}
            <div className="flex flex-wrap gap-2 pt-1">
              {REVIEW_ASPECT_OPTIONS.map((aspect) => {
                const isSelected = selectedAspect === aspect;
                return (
                  <button
                    key={aspect}
                    type="button"
                    onClick={() => setSelectedAspect(isSelected ? null : aspect)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-sand-100 hover:bg-sand-200/80 text-stone-800 border-transparent'
                    }`}
                  >
                    {aspect}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listado de Reseñas Completas */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between text-xs text-stone-500 font-semibold border-b border-stone-200/60 pb-3">
              <span>{filteredReviews.length} {filteredReviews.length === 1 ? 'evaluación encontrada' : 'evaluaciones encontradas'}</span>
              {(searchQuery || selectedAspect) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedAspect(null);
                  }}
                  className="text-terracotta-600 hover:underline cursor-pointer"
                >
                  Quitar filtros
                </button>
              )}
            </div>

            {filteredReviews.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <p className="font-['Outfit'] font-bold text-base text-stone-900">
                  No se encontraron evaluaciones con esos criterios.
                </p>
                <p className="text-xs text-stone-500">
                  Probá buscando otra palabra o limpiando los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="space-y-8 divide-y divide-stone-200/70">
                {filteredReviews.map((review) => {
                  const isHighlighted = highlightedId === review.id;
                  return (
                    <article
                      key={review.id}
                      id={`modal-review-${review.id}`}
                      className={`pt-6 first:pt-0 space-y-3 transition-colors duration-300 ${
                        isHighlighted
                          ? 'p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80'
                          : ''
                      }`}
                    >
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

                      {/* Comentario Completo (Sin truncar) */}
                      <p className="text-sm text-stone-800 leading-relaxed font-normal whitespace-pre-line">
                        {review.comment}
                      </p>

                      {/* Aspectos destacados */}
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
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};