import React from 'react';
import type { OccupancyDataPoint } from '../../services/reports.service.ts';

export interface OccupancyBarChartProps {
  data: OccupancyDataPoint[];
}

export const OccupancyBarChart: React.FC<OccupancyBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-[var(--color-sand-200)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Curva de Ocupación por Segmento
          </h4>
          <span className="text-[11px] text-[var(--color-sand-400)]">
            Porcentaje de plazas hoteleras y cabañas ocupadas
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold text-[var(--color-sand-800)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-uritorco-600)] inline-block" />
            <span>≥ 80% Alta Ocupación</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-terracotta-500)] inline-block" />
            <span>&lt; 80% Ocupación Regular</span>
          </div>
        </div>
      </div>

      {/* Bars container */}
      <div className="flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[var(--color-sand-200)] h-48">
        {data.map((item, idx) => {
          const isHigh = item.rate >= 80;
          const barColor = isHigh
            ? 'bg-[var(--color-uritorco-600)] hover:bg-[var(--color-uritorco-700)]'
            : 'bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)]';

          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <span className="text-[11px] font-bold text-[var(--color-sand-900)] font-['Outfit'] opacity-90 group-hover:scale-105 transition-transform">
                {item.rate}%
              </span>
              <div className="w-full max-w-[48px] bg-[var(--color-sand-100)] rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                <div
                  style={{ height: `${item.rate}%` }}
                  className={`w-full rounded-t-md transition-all duration-300 ${barColor}`}
                  title={`${item.label}: ${item.rate}% (${item.bookingsCount} reservas registradas)`}
                />
              </div>
              <span className="text-[11px] font-medium text-[var(--color-sand-400)] truncate w-full text-center mt-1">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
