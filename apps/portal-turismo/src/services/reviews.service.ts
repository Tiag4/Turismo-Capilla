import { API_BASE_URL } from './api';
import type {
  AccommodationReviews,
  CreateReviewPayload,
  Review,
  ReviewEligibility,
} from '../types/review.types';

const REQUEST_TIMEOUT_MS = 8000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message || 'No se pudo completar la operación con reseñas');
    }
    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('La conexión tardó demasiado. Intentá nuevamente.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const reviewsService = {
  getEligibility(code: string): Promise<ReviewEligibility> {
    const query = new URLSearchParams({ code });
    return request<ReviewEligibility>(`/reviews/eligibility?${query.toString()}`);
  },

  create(payload: CreateReviewPayload): Promise<Review> {
    return request<Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getApprovedByAccommodation(accommodationId: string): Promise<AccommodationReviews> {
    return request<AccommodationReviews>(`/reviews/accommodation/${accommodationId}`);
  },
};
