import React from 'react';
import { InfoTooltip } from './Tooltip.tsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, tooltip, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
              {label}
            </label>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] placeholder:text-[var(--color-sand-400)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            error
              ? 'border-rose-600 focus:border-rose-600 focus:ring-rose-500'
              : 'border-[var(--color-sand-300)] focus:border-[var(--color-terracotta-500)] focus:ring-[var(--color-terracotta-500)]'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
        {helperText && !error && <span className="text-xs text-[var(--color-sand-400)]">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
