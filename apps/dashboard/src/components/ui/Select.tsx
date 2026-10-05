import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[var(--color-sand-900)] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            error
              ? 'border-rose-600 focus:border-rose-600 focus:ring-rose-500'
              : 'border-[var(--color-sand-300)] focus:border-[var(--color-terracotta-500)] focus:ring-[var(--color-terracotta-500)]'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
