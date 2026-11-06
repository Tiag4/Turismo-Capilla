export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewEligibility {
  bookingCode: string;
  accommodationId: string;
  accommodationName: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  alreadyReviewed: boolean;
  canReview: boolean;
  reason?: string | null;
}

export interface CreateReviewPayload {
  bookingCode: string;
  rating: number;
  cleanlinessRating: number;
  hostRating: number;
  locationRating: number;
  comment: string;
  guestOrigin?: string;
  stayDate?: string;
}

export interface Review {
  id: string;
  accommodationId: string;
  accommodationName: string;
  accommodationImageUrl?: string | null;
  bookingCode: string;
  guestName: string;
  guestOrigin?: string | null;
  stayDate?: string | null;
  rating: number;
  cleanlinessRating: number;
  hostRating: number;
  locationRating: number;
  comment: string;
  status: ReviewStatus;
  moderationNotes?: string | null;
  createdAt: string;
  moderatedAt?: string | null;
}

export interface AccommodationReviews {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
  cleanlinessAverage: number;
  hostAverage: number;
  locationAverage: number;
}
