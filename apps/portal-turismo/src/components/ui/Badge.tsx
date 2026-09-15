import React from 'react';
import { cn } from '../../lib/utils.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide';

  const variants = {
    default: 'bg-sand-200 text-sand-800',
    success: 'bg-secondary-100 text-secondary-700',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-accent-100 text-accent-600',
    outline: 'border border-sand-300 text-sand-700 bg-white/60',
  };

  return (
    <span className={cn(base, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
