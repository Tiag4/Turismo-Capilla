export type AuditActionType =
  | 'TOKEN_GENERATED'
  | 'TOKEN_REVOKED'
  | 'HOST_APPROVED'
  | 'ACCOMMODATION_AUDITED'
  | 'ACCOMMODATION_SUSPENDED'
  | 'CALENDAR_UPDATED';

export interface AuditEvent {
  id: string;
  actionType: AuditActionType;
  description: string;
  operatorName: string;
  operatorEmail: string;
  targetEntity: string;
  targetId?: string;
  timestamp: string;
  details?: string;
}

export interface AuditLogFilter {
  actionType?: AuditActionType | 'ALL';
  searchQuery?: string;
}
