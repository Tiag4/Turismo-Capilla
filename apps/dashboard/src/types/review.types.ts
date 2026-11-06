export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DashboardReview {
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
