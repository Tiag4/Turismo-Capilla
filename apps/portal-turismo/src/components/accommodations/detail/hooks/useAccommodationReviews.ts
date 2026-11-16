import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReviewItem, ReviewAspect } from '../types';
import type { AccommodationReviews, Review, ReviewEligibility } from '../../../../types/review.types';
import { reviewsService } from '../../../../services/reviews.service';
import { getDefaultReviewsForAccommodation } from '../data/mockReviews';

const STORAGE_KEY_PREFIX = 'turismo_capilla_reviews_v1_';
const COOLDOWN_MS = 10_000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface CreateReviewInput {
  authorName: string;
  authorOrigin?: string;
  stayDate: string;
  rating: number;
  comment: string;
  aspects: ReviewAspect[];
  bookingCode?: string;
}

export interface SubmitReviewResult {
  ok: boolean;
  pendingModeration?: boolean;
  error?: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  verifiedCount: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  aspectCounts: Record<string, number>;
}

function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>?/gm, '')
    .replace(/https?:\/\/\S+/gi, '[enlace removido]')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isValidBookingCodeFormat(code: string): boolean {
  const clean = code.trim().toUpperCase();
  return /^CAP-\d{4}-[A-Z0-9]{4,8}$/.test(clean);
}

function mapApprovedReview(review: Review): ReviewItem {
  const aspects: ReviewAspect[] = [];

  if (review.cleanlinessRating >= 4) aspects.push('Limpieza impecable');
  if (review.hostRating >= 4) aspects.push('Atención del anfitrión');
  if (review.locationRating >= 4) aspects.push('Ubicación y vistas');

  return {
    id: `approved-${review.id}`,
    accommodationId: review.accommodationId,
    authorName: review.guestName,
    authorOrigin: review.guestOrigin ?? undefined,
    stayDate: review.stayDate ?? 'Estadía verificada',
    rating: review.rating,
    comment: review.comment,
    aspects: aspects.length > 0 ? aspects : ['Tranquilidad serrana'],
    verifiedBooking: true,
    bookingCode: review.bookingCode,
    createdAt: review.createdAt,
  };
}

export function useAccommodationReviews(
  accommodationId: string,
  accommodationTitle: string,
  baseRating = 0,
  baseReviewCount = 0,
) {
  const isRealAccommodation = UUID_REGEX.test(accommodationId);
  const storageKey = `${STORAGE_KEY_PREFIX}${accommodationId}`;

  const [mockReviews, setMockReviews] = useState<ReviewItem[]>([]);
  const [approvedReviews, setApprovedReviews] = useState<ReviewItem[]>([]);
  const [apiSummary, setApiSummary] = useState<AccommodationReviews | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number>(0);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [pendingModeration, setPendingModeration] = useState<boolean>(false);

  // Load local demo data only for non-UUID mock routes (e.g. /alojamientos/acc-1)
  useEffect(() => {
    if (isRealAccommodation) {
      setMockReviews([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ReviewItem[];
          if (Array.isArray(parsed)) {
            setMockReviews(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Ignore storage read errors
      }
      setMockReviews(getDefaultReviewsForAccommodation(accommodationId, accommodationTitle));
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [accommodationId, accommodationTitle, isRealAccommodation, storageKey]);

  // Fetch verified approved reviews from backend API when accommodationId is a valid UUID
  useEffect(() => {
    if (!isRealAccommodation) return;

    let isActive = true;
    setIsLoading(true);

    reviewsService
      .getApprovedByAccommodation(accommodationId)
      .then((result) => {
        if (isActive) {
          setApiSummary(result);
          setApprovedReviews(result.reviews.map(mapApprovedReview));
        }
      })
      .catch(() => {
        if (isActive) {
          setApiSummary(null);
          setApprovedReviews([]);
        }
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [accommodationId, isRealAccommodation]);

  const allReviews = useMemo(() => {
    if (isRealAccommodation) {
      return approvedReviews;
    }
    const approvedCodes = new Set(
      approvedReviews.map((review) => review.bookingCode).filter(Boolean) as string[],
    );
    const localReviews = mockReviews.filter(
      (review) => !review.bookingCode || !approvedCodes.has(review.bookingCode),
    );
    return [...approvedReviews, ...localReviews];
  }, [approvedReviews, isRealAccommodation, mockReviews]);

  const stats: ReviewStats = useMemo(() => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const aspectCounts: Record<string, number> = {};
    let sum = 0;
    let verifiedCount = 0;

    for (const rev of allReviews) {
      const r = Math.min(5, Math.max(1, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[r] = (distribution[r] ?? 0) + 1;
      sum += rev.rating;
      if (rev.verifiedBooking) verifiedCount += 1;
      for (const aspect of rev.aspects ?? []) {
        aspectCounts[aspect] = (aspectCounts[aspect] ?? 0) + 1;
      }
    }

    if (isRealAccommodation) {
      const totalReviews = apiSummary?.totalReviews ?? allReviews.length;
      const averageRating =
        apiSummary && totalReviews > 0
          ? Number(apiSummary.averageRating.toFixed(1))
          : allReviews.length > 0
            ? Number((sum / allReviews.length).toFixed(1))
            : 0;

      return {
        averageRating,
        totalReviews,
        verifiedCount: totalReviews,
        distribution,
        aspectCounts,
      };
    }

    // Demo mock fallback calculation
    const defaultListLength = getDefaultReviewsForAccommodation(accommodationId, accommodationTitle).length;
    const userAddedCount = Math.max(0, allReviews.length - defaultListLength);
    const totalReviews = Math.max(allReviews.length, baseReviewCount + userAddedCount);
    let averageRating = baseRating;
    if (allReviews.length > 0) {
      const historicalCount = Math.max(0, baseReviewCount - defaultListLength);
      const totalWeighted = historicalCount * baseRating + sum;
      const totalDivisor = historicalCount + allReviews.length;
      averageRating = totalDivisor > 0 ? Number((totalWeighted / totalDivisor).toFixed(1)) : Number((sum / allReviews.length).toFixed(1));
    }

    return { averageRating, totalReviews, verifiedCount, distribution, aspectCounts };
  }, [allReviews, accommodationId, accommodationTitle, apiSummary, baseRating, baseReviewCount, isRealAccommodation]);

  const checkEligibility = useCallback(
    async (bookingCode: string): Promise<ReviewEligibility | null> => {
      const cleanCode = bookingCode.trim().toUpperCase();
      if (!isRealAccommodation || !isValidBookingCodeFormat(cleanCode)) {
        return null;
      }
      return reviewsService.getEligibility(cleanCode);
    },
    [isRealAccommodation],
  );

  const addReview = useCallback(
    async (input: CreateReviewInput): Promise<SubmitReviewResult> => {
      const now = Date.now();
      if (now - lastSubmittedAt < COOLDOWN_MS) {
        return { ok: false, error: 'Por favor aguardá unos segundos antes de enviar otra calificación.' };
      }

      const cleanAuthor = sanitizeText(input.authorName);
      const cleanOrigin = input.authorOrigin ? sanitizeText(input.authorOrigin) : undefined;
      const cleanComment = sanitizeText(input.comment);
      const cleanCode = input.bookingCode ? input.bookingCode.trim().toUpperCase() : '';

      if (!isRealAccommodation && cleanAuthor.length < 2) {
        return { ok: false, error: 'Ingresá tu nombre (mínimo 2 caracteres).' };
      }

      if (cleanComment.length < 20) {
        return {
          ok: false,
          error: `El comentario debe tener al menos 20 caracteres (actual: ${cleanComment.length}).`,
        };
      }

      if (/(.)\1{6,}/.test(cleanComment)) {
        return { ok: false, error: 'El comentario contiene caracteres repetitivos no válidos.' };
      }

      if (input.rating < 1 || input.rating > 5) {
        return { ok: false, error: 'Seleccioná una calificación de 1 a 5 estrellas.' };
      }

      if (!cleanCode) {
        return { ok: false, error: 'Ingresá tu código de reserva para poder publicar la reseña.' };
      }

      if (!isValidBookingCodeFormat(cleanCode)) {
        return {
          ok: false,
          error: 'El código de reserva debe tener el formato CAP-YYYY-XXXX (ej. CAP-2026-4812).',
        };
      }

      if (isRealAccommodation) {
        setIsSubmitting(true);
        try {
          const eligibility = await reviewsService.getEligibility(cleanCode);
          if (eligibility.accommodationId !== accommodationId) {
            return {
              ok: false,
              error: `El código ${cleanCode} corresponde a "${eligibility.accommodationName}", no a este alojamiento.`,
            };
          }
          if (!eligibility.canReview) {
            return {
              ok: false,
              error: eligibility.reason || 'Esta reserva no está habilitada para calificar.',
            };
          }

          const cleanlinessRating = input.aspects.includes('Limpieza impecable')
            ? Math.max(4, input.rating)
            : input.rating;
          const hostRating = input.aspects.includes('Atención del anfitrión')
            ? Math.max(4, input.rating)
            : input.rating;
          const locationRating = input.aspects.includes('Ubicación y vistas')
            ? Math.max(4, input.rating)
            : input.rating;

          await reviewsService.create({
            bookingCode: cleanCode,
            rating: input.rating,
            cleanlinessRating,
            hostRating,
            locationRating,
            comment: cleanComment,
            guestOrigin: cleanOrigin,
            stayDate: input.stayDate,
          });

          setLastSubmittedAt(now);
          setPendingModeration(true);
          setSubmitSuccess(true);
          return { ok: true, pendingModeration: true };
        } catch (err) {
          return {
            ok: false,
            error: err instanceof Error ? err.message : 'No se pudo enviar la reseña al servidor.',
          };
        } finally {
          setIsSubmitting(false);
        }
      }

      // Offline mock flow fallback
      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        accommodationId,
        authorName: cleanAuthor,
        authorOrigin: cleanOrigin || 'Turista Visitante',
        stayDate: input.stayDate || 'Octubre 2026',
        rating: input.rating,
        comment: cleanComment,
        aspects: input.aspects.length > 0 ? input.aspects : ['Tranquilidad serrana'],
        verifiedBooking: true,
        bookingCode: cleanCode,
        createdAt: new Date().toISOString(),
      };

      const updated = [newReview, ...mockReviews];
      setMockReviews(updated);
      setLastSubmittedAt(now);
      setPendingModeration(false);
      setSubmitSuccess(true);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return { ok: true, pendingModeration: false };
    },
    [accommodationId, isRealAccommodation, lastSubmittedAt, mockReviews, storageKey],
  );

  const openModal = useCallback(() => {
    setSubmitSuccess(false);
    setPendingModeration(false);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    reviews: allReviews,
    isLoading,
    isSubmitting,
    stats,
    isModalOpen,
    submitSuccess,
    pendingModeration,
    isRealAccommodation,
    openModal,
    closeModal,
    addReview,
    checkEligibility,
  };
}
