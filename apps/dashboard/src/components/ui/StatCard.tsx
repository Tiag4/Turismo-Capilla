import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  helperText?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor = 'text-[var(--color-terracotta-500)]',
  helperText,
}) => {
  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-400)]">
          {label}
        </span>
        {/* Anti-vibecoded: direct semantic icon without artificial pastel background pill */}
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="mt-3">
        {/* Anti-vibecoded: solid text color, strictly no gradient text */}
        <div className="text-2xl sm:text-3xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
          {value}
        </div>
        {helperText && (
          <p className="mt-1 text-xs text-[var(--color-sand-400)] font-medium">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
};
