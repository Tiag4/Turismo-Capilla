import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReviewItem, ReviewAspect } from '../types';
import { getDefaultReviewsForAccommodation } from '../data/mockReviews';

const STORAGE_KEY_PREFIX = 'turismo_capilla_reviews_v1_';
const COOLDOWN_MS = 30_000;

export interface CreateReviewInput {
  authorName: string;
  authorOrigin?: string;
  stayDate: string;
  rating: number;
  comment: string;
  aspects: ReviewAspect[];
  bookingCode?: string;
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

function isValidBookingCodeFormat(code: string): boolean {
  const clean = code.trim().toUpperCase();
  return /^CAP-\d{4}-[A-Z0-9]{4,8}$/.test(clean);
}

export function useAccommodationReviews(
  accommodationId: string,
  accommodationTitle: string,
  baseRating = 4.9,
  baseReviewCount = 20
) {
  const storageKey = `${STORAGE_KEY_PREFIX}${accommodationId}`;

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number>(0);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ReviewItem[];
          if (Array.isArray(parsed)) {
            setReviews(parsed);
            setIsLoading(false);
            return;
          }
        }
      } catch {
        // Fallback to default reviews if localStorage is unavailable
      }
      const initial = getDefaultReviewsForAccommodation(accommodationId, accommodationTitle);
      setReviews(initial);
      setIsLoading(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [accommodationId, accommodationTitle, storageKey]);

  const stats: ReviewStats = useMemo(() => {
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const aspectCounts: Record<string, number> = {};
    let sum = 0;
    let verifiedCount = 0;

    for (const rev of reviews) {
      const r = Math.min(5, Math.max(1, Math.round(rev.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[r] = (distribution[r] ?? 0) + 1;
      sum += rev.rating;
      if (rev.verifiedBooking) verifiedCount += 1;
      for (const aspect of rev.aspects ?? []) {
        aspectCounts[aspect] = (aspectCounts[aspect] ?? 0) + 1;
      }
    }

    const defaultListLength = getDefaultReviewsForAccommodation(accommodationId, accommodationTitle).length;
    const userAddedCount = Math.max(0, reviews.length - defaultListLength);
    const totalReviews = Math.max(reviews.length, baseReviewCount + userAddedCount);

    let averageRating = baseRating;
    if (reviews.length > 0) {
      const historicalCount = Math.max(0, baseReviewCount - defaultListLength);
      const totalWeighted = historicalCount * baseRating + sum;
      const totalDivisor = historicalCount + reviews.length;
      averageRating = totalDivisor > 0 ? Number((totalWeighted / totalDivisor).toFixed(1)) : Number((sum / reviews.length).toFixed(1));
    }

    return {
      averageRating,
      totalReviews,
      verifiedCount,
      distribution,
      aspectCounts,
    };
  }, [reviews, accommodationId, accommodationTitle, baseRating, baseReviewCount]);

  const addReview = useCallback(
    (input: CreateReviewInput): { ok: boolean; error?: string } => {
      const now = Date.now();
      if (now - lastSubmittedAt < COOLDOWN_MS) {
        return {
          ok: false,
          error: 'Por favor aguardá unos segundos antes de enviar otra calificación.',
        };
      }

      const cleanAuthor = sanitizeText(input.authorName);
      const cleanOrigin = input.authorOrigin ? sanitizeText(input.authorOrigin) : undefined;
      const cleanComment = sanitizeText(input.comment);
      const cleanCode = input.bookingCode ? input.bookingCode.trim().toUpperCase() : '';

      if (cleanAuthor.length < 2) {
        return { ok: false, error: 'Ingresá tu nombre (mínimo 2 caracteres).' };
      }

      if (cleanComment.length < 20) {
        return {
          ok: false,
          error: `El comentario debe tener al menos 20 caracteres (actual: ${cleanComment.length}).`,
        };
      }

      // Antispam check for repeated characters
      if (/(.)\1{6,}/.test(cleanComment)) {
        return {
          ok: false,
          error: 'El comentario contiene caracteres repetitivos no válidos.',
        };
      }

      if (input.rating < 1 || input.rating > 5) {
        return { ok: false, error: 'Seleccioná una calificación de 1 a 5 estrellas.' };
      }

      if (cleanCode && !isValidBookingCodeFormat(cleanCode)) {
        return {
          ok: false,
          error: 'El código de reserva debe tener el formato CAP-YYYY-XXXX (ej. CAP-2026-4812).',
        };
      }

      const newReview: ReviewItem = {
        id: `rev-${Date.now()}`,
        accommodationId,
        authorName: cleanAuthor,
        authorOrigin: cleanOrigin || 'Turista Visitante',
        stayDate: input.stayDate || 'Octubre 2026',
        rating: input.rating,
        comment: cleanComment,
        aspects: input.aspects.length > 0 ? input.aspects : ['Tranquilidad serrana'],
        verifiedBooking: Boolean(cleanCode && isValidBookingCodeFormat(cleanCode)),
        bookingCode: cleanCode || undefined,
        createdAt: new Date().toISOString(),
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      setLastSubmittedAt(now);
      setSubmitSuccess(true);

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // Ignore storage quota errors
      }

      return { ok: true };
    },
    [accommodationId, lastSubmittedAt, reviews, storageKey]
  );

  const openModal = useCallback(() => {
    setSubmitSuccess(false);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return {
    reviews,
    isLoading,
    stats,
    isModalOpen,
    submitSuccess,
    openModal,
    closeModal,
    addReview,
  };
}
