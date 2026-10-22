import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatItem {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  helperText?: string;
}

export interface InlineStatStripProps {
  stats: StatItem[];
  className?: string;
}

export const InlineStatStrip: React.FC<InlineStatStripProps> = ({ stats, className = '' }) => {
  if (!stats || stats.length === 0) return null;

  // Responsive grid layout based on number of items
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6',
  }[stats.length] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div
      className={`bg-white border border-[var(--color-sand-200)] rounded-2xl shadow-xs overflow-hidden grid ${gridColsClass} divide-y sm:divide-y-0 sm:divide-x divide-[var(--color-sand-200)] ${className}`}
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className="p-4 sm:p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)]">
                {stat.label}
              </span>
              {Icon && (
                <Icon
                  className={`w-4 h-4 shrink-0 ${stat.iconColor ?? 'text-[var(--color-sand-600)]'}`}
                />
              )}
            </div>
            <div className="mt-2">
              <div className="text-2xl sm:text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit'] tabular-nums leading-none">
                {stat.value}
              </div>
              {stat.helperText && (
                <p className="mt-1 text-[11px] text-[var(--color-sand-500)] font-medium truncate">
                  {stat.helperText}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
