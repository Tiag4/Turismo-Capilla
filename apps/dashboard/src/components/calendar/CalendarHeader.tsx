import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Lock } from 'lucide-react';
import type { Accommodation } from '../../types/accommodation.types.ts';

export interface CalendarHeaderProps {
  monthLabel: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  selectedAccommodationId: string;
  onSelectAccommodation: (id: string) => void;
  accommodations: Accommodation[];
  monthStats: {
    totalBookings: number;
    confirmedCount: number;
    pendingCount: number;
  };
  onOpenBlockModal?: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthLabel,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  selectedAccommodationId,
  onSelectAccommodation,
  accommodations,
  monthStats,
  onOpenBlockModal,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Month Navigation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-[var(--color-sand-100)] p-1 rounded-xl border border-[var(--color-sand-200)]">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg text-[var(--color-sand-800)] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            title="Mes anterior"
            aria-label="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={onGoToToday}
            className="px-3 py-1 rounded-lg text-xs font-bold text-[var(--color-sand-800)] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
          >
            Hoy
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg text-[var(--color-sand-800)] hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            title="Mes siguiente"
            aria-label="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[var(--color-terracotta-500)]" />
          <h2 className="text-xl font-extrabold text-[var(--color-sand-900)] font-['Outfit'] capitalize">
            {monthLabel}
          </h2>
        </div>
      </div>

      {/* Accommodation Filter & Month Summary */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Accommodation Dropdown Filter */}
        <div className="flex items-center gap-2 bg-[var(--color-sand-50)] px-3 py-1.5 rounded-xl border border-[var(--color-sand-200)]">
          <Filter className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
          <select
            value={selectedAccommodationId}
            onChange={(e) => onSelectAccommodation(e.target.value)}
            className="bg-transparent text-xs font-bold text-[var(--color-sand-800)] outline-hidden cursor-pointer"
            aria-label="Filtrar por cabaña"
          >
            <option value="ALL">Todas las cabañas ({accommodations.length})</option>
            {accommodations.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Badges de balance del mes */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <span
            className="px-2.5 py-1 rounded-lg bg-[#005530] text-white shadow-xs"
            title="Reservas confirmadas para este mes"
          >
            {monthStats.confirmedCount} confirmadas
          </span>
          <span
            className="px-2.5 py-1 rounded-lg bg-amber-600 text-white shadow-xs"
            title="Reservas pendientes para este mes"
          >
            {monthStats.pendingCount} pendientes
          </span>
        </div>

        {/* Action Button: Bloquear Fechas */}
        {onOpenBlockModal && (
          <button
            onClick={onOpenBlockModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 text-white text-xs font-bold hover:bg-zinc-700 active:scale-98 transition-all cursor-pointer shadow-xs"
            title="Bloquear fechas administrativamente"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Bloquear Fechas</span>
          </button>
        )}
      </div>
    </div>
  );
};
