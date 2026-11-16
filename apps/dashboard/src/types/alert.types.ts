export type AlertSeverity = 'INFO' | 'WARNING' | 'DANGER';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  linkUrl?: string | null;
  linkText?: string | null;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrUpdateAlertDto {
  title: string;
  message: string;
  severity: AlertSeverity;
  linkUrl?: string | null;
  linkText?: string | null;
  isActive?: boolean;
  expiresAt?: string | null;
}
