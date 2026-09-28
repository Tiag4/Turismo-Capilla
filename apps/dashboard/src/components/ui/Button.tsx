import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'terracotta' | 'uritorco' | 'emerald' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'terracotta', size = 'md', isLoading = false, children, className = '', disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-colors cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-5 py-3 text-base gap-2.5',
    }[size];

    const variantStyles = {
      terracotta: 'bg-[var(--color-terracotta-500)] text-white hover:bg-[var(--color-terracotta-600)] focus:ring-[var(--color-terracotta-500)] shadow-xs',
      uritorco: 'bg-[var(--color-uritorco-600)] text-white hover:bg-[var(--color-uritorco-700)] focus:ring-[var(--color-uritorco-600)] shadow-xs',
      emerald: 'bg-[var(--color-emerald-portal-600)] text-white hover:bg-[var(--color-emerald-portal-900)] focus:ring-[var(--color-emerald-portal-600)] shadow-xs',
      outline: 'border border-[var(--color-sand-300)] text-[var(--color-sand-900)] bg-white hover:bg-[var(--color-sand-100)] focus:ring-[var(--color-sand-400)]',
      ghost: 'text-[var(--color-sand-800)] hover:bg-[var(--color-sand-200)] focus:ring-[var(--color-sand-400)]',
      danger: 'bg-rose-700 text-white hover:bg-rose-800 focus:ring-rose-700 shadow-xs',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-0.5 mr-1.5 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
