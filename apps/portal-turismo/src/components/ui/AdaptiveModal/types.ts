import React from 'react';

export type AdaptiveModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface AdaptiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: AdaptiveModalSize;
  maxWidthClassName?: string;
  heightClassName?: string;
  maxHeightClassName?: string;
  className?: string;
  bodyClassName?: string;
  headerClassName?: string;
  closeOnBackdropClick?: boolean;
  hideHeader?: boolean;
  hideCloseButton?: boolean;
  closeButtonAriaLabel?: string;
  ariaLabel?: string;
  zIndexClassName?: string;
  renderHeaderAction?: React.ReactNode;
}
