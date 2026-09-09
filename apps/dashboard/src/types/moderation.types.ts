export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ModerationItem {
  id: string;
  accommodationId: string;
  accommodationName: string;
  hostName: string;
  hostEmail: string;
  imageUrl: string;
  caption?: string;
  status: ModerationStatus;
  submittedAt: string;
  moderatedAt?: string;
  feedbackNotes?: string;
}

export interface ModerationFeedbackDto {
  itemId: string;
  notes: string;
}
