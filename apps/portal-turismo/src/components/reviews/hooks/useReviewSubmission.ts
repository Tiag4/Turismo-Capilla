import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { reviewsService } from '../../../services/reviews.service';
import type {
  CreateReviewPayload,
  Review,
  ReviewEligibility,
} from '../../../types/review.types';

function readCodeFromUrl(): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('code')?.trim().toUpperCase() ?? '';
}

export function useReviewSubmission() {
  const initialCode = readCodeFromUrl();
  const autoLookupRef = useRef(false);

  const [code, setCode] = useState(initialCode);
  const [eligibility, setEligibility] = useState<ReviewEligibility | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedReview, setSubmittedReview] = useState<Review | null>(null);

  const lookupCode = useCallback(async (rawCode: string) => {
    const cleanCode = rawCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Ingresá el código de reserva que figura en tu voucher.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSubmitError(null);

    try {
      const result = await reviewsService.getEligibility(cleanCode);
      setEligibility(result);
      setCode(result.bookingCode);
    } catch (lookupError) {
      setEligibility(null);
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : 'No encontramos la reserva indicada.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCode || autoLookupRef.current) return;
    autoLookupRef.current = true;
    lookupCode(initialCode);
  }, [initialCode, lookupCode]);

  const handleCodeChange = useCallback((value: string) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    setCode(cleaned);
    setError(null);
  }, []);

  const handleLookup = useCallback(
      async (event?: FormEvent) => {
      event?.preventDefault();
      await lookupCode(code);
    },
    [code, lookupCode],
  );

  const submitReview = useCallback(async (payload: CreateReviewPayload) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const review = await reviewsService.create(payload);
      setSubmittedReview(review);
      setEligibility((current) =>
        current ? { ...current, canReview: false, alreadyReviewed: true } : current,
      );
      return review;
    } catch (submitFailure) {
      const message =
        submitFailure instanceof Error
          ? submitFailure.message
          : 'No pudimos registrar tu reseña. Intentá nuevamente.';
      setSubmitError(message);
      throw submitFailure;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const closeSuccess = useCallback(() => {
    setSubmittedReview(null);
  }, []);

  const resetLookup = useCallback(() => {
    setEligibility(null);
    setCode('');
    setError(null);
    setSubmitError(null);
  }, []);

  return {
    code,
    eligibility,
    isLoading,
    isSubmitting,
    error,
    submitError,
    submittedReview,
    handleCodeChange,
    handleLookup,
    submitReview,
    closeSuccess,
    resetLookup,
  };
}
