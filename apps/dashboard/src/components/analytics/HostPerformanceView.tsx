import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Home,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useHostBookings } from '../../hooks/useHostBookings.ts';
import { useHostAccommodations } from '../../hooks/useHostAccommodations.ts';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';

export const HostPerformanceView: React.FC = () => {
  const { bookings, isLoading: isLoadingBookings } = useHostBookings();
  const { accommodations, isLoading: isLoadingAccommodations } = useHostAccommodations();

  const [selectedPeriod, setSelectedPeriod] = useState<'MONTH' | 'QUARTER' | 'YEAR'>('YEAR');

  const isLoading = isLoadingBookings || isLoadingAccommodations;

  // Compute analytics
  const metrics = useMemo(() => {
    const confirmedBookings = bookings.filter(
      (b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED'
    );

    // Total Revenue
    const totalRevenue = confirmedBookings.reduce(
      (sum, b) => sum + Number(b.totalAmount || 0),
      0
    );

    // Average nights per stay
    let totalNights = 0;
    confirmedBookings.forEach((b) => {
      const inDate = new Date(b.checkIn);
      const outDate = new Date(b.checkOut);
      const nights = Math.max(
        1,
        Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      totalNights += nights;
    });

    const averageNights = confirmedBookings.length > 0
      ? (totalNights / confirmedBookings.length).toFixed(1)
      : '0.0';

    // Total guests hosted
    const totalGuests = confirmedBookings.reduce(
      (sum, b) => sum + Number(b.guestCount || 0),
      0
    );

    // Occupancy estimation for current month (30 days)
    const activeAccommodationsCount = Math.max(
      1,
      accommodations.filter((a) => a.isActive).length
    );
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let daysBookedThisMonth = 0;
    confirmedBookings.forEach((b) => {
      const inDate = new Date(b.checkIn);
      const outDate = new Date(b.checkOut);
      if (
        (inDate.getMonth() === currentMonth && inDate.getFullYear() === currentYear) ||
        (outDate.getMonth() === currentMonth && outDate.getFullYear() === currentYear)
      ) {
        const nights = Math.max(
          1,
          Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
        );
        daysBookedThisMonth += nights;
      }
    });

    const totalAvailableDays = activeAccommodationsCount * 30;
    const occupancyRate = Math.min(
      100,
      Math.round((daysBookedThisMonth / totalAvailableDays) * 100)
    );

    // Revenue per accommodation
    const revenueByAccommodation = accommodations.map((acc) => {
      const accBookings = confirmedBookings.filter((b) => b.accommodationId === acc.id);
      const revenue = accBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
      let nights = 0;
      accBookings.forEach((b) => {
        const inDate = new Date(b.checkIn);
        const outDate = new Date(b.checkOut);
        nights += Math.max(
          1,
          Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24))
        );
      });
      return {
        id: acc.id,
        name: acc.name,
        type: acc.type,
        bookingsCount: accBookings.length,
        revenue,
        nights,
      };
    });

    // Monthly breakdown (last 6 months)
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = targetDate.getMonth();
      const mYear = targetDate.getFullYear();

      const mBookings = confirmedBookings.filter((b) => {
        const bDate = new Date(b.checkIn);
        return bDate.getMonth() === mIdx && bDate.getFullYear() === mYear;
      });

      const mRevenue = mBookings.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);

      monthlyData.push({
        label: `${months[mIdx]} ${mYear.toString().slice(-2)}`,
        revenue: mRevenue,
        bookingsCount: mBookings.length,
      });
    }

    const maxMonthRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1);

    return {
      totalRevenue,
      averageNights,
      totalGuests,
      occupancyRate,
      confirmedCount: confirmedBookings.length,
      pendingCount: bookings.filter((b) => b.status === 'PENDING').length,
      revenueByAccommodation,
      monthlyData,
      maxMonthRevenue,
    };
  }, [bookings, accommodations]);

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Tasa de Ocupación',
      value: `${metrics.occupancyRate}%`,
      icon: Calendar,
      iconColor: 'text-[var(--color-terracotta-500)]',
      helperText: 'Mes actual en curso',
    },
    {
      label: 'Total Facturado',
      value: `$${metrics.totalRevenue.toLocaleString('es-AR')}`,
      icon: DollarSign,
      iconColor: 'text-[var(--color-emerald-portal-600)]',
      helperText: `${metrics.confirmedCount} reservas confirmadas`,
    },
    {
      label: 'Estadía Promedio',
      value: `${metrics.averageNights} noches`,
      icon: Clock,
      iconColor: 'text-[var(--color-sand-500)]',
      helperText: 'Promedio por huésped',
    },
    {
      label: 'Huéspedes Recibidos',
      value: metrics.totalGuests,
      icon: Users,
      iconColor: 'text-[var(--color-sand-500)]',
      helperText: 'Pasajeros totales',
    },
  ], [metrics]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-[var(--color-sand-400)]">
        Calculando métricas de rendimiento y balance...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Rendimiento y Balance Financiero
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium mt-0.5">
            Métricas de ocupación, facturación y estadías de tus cabañas
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-100)]/60">
          {(
            [
              { id: 'MONTH', label: 'Mes Actual' },
              { id: 'QUARTER', label: 'Trimestre' },
              { id: 'YEAR', label: 'Año 2026' },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedPeriod === p.id
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stat Strip — Flat on Canvas */}
      <InlineStatStrip stats={statItems} />

      {/* Monthly Evolution Chart (Flat on canvas, zero floating card) */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-sand-300)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Facturación Mensual (Últimos 6 Meses)
            </h3>
            <p className="text-xs text-[var(--color-sand-400)] mt-0.5">
              Evolución de ingresos generados por reservas confirmadas
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--color-sand-600)]">
            Valores en ARS
          </span>
        </div>

        {/* Bar visualization */}
        <div className="pt-4 pb-2">
          <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-[var(--color-sand-200)] px-2">
            {metrics.monthlyData.map((m, idx) => {
              const heightPercent = Math.max(
                12,
                Math.round((m.revenue / metrics.maxMonthRevenue) * 100)
              );
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  {/* Tooltip value */}
                  <span className="text-[10px] font-bold text-[var(--color-sand-700)] opacity-80 group-hover:opacity-100 group-hover:text-[var(--color-terracotta-600)] transition-all">
                    ${(m.revenue / 1000).toFixed(0)}k
                  </span>
                  {/* Solid Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[48px] bg-[var(--color-terracotta-500)] rounded-t-lg group-hover:bg-[var(--color-terracotta-600)] transition-all duration-300"
                  />
                  {/* Month Label */}
                  <span className="text-[11px] font-semibold text-[var(--color-sand-500)] mt-2">
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Breakdown per Accommodation (Flat on canvas, zero floating card) */}
      <div className="space-y-4 pt-4 border-t border-[var(--color-sand-300)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Rendimiento por Cabaña y Unidad
            </h3>
            <p className="text-xs text-[var(--color-sand-400)] mt-0.5">
              Desglose detallado de reservas e ingresos de cada alojamiento
            </p>
          </div>
          <span className="text-xs text-[var(--color-sand-500)] font-medium">
            {metrics.revenueByAccommodation.length} establecimientos
          </span>
        </div>

        <div className="border-y border-[var(--color-sand-300)] divide-y divide-[var(--color-sand-200)]">
          {metrics.revenueByAccommodation.map((acc) => (
            <div
              key={acc.id}
              className="py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--color-sand-100)]/60 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    {acc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-sand-500)]">
                    <span>{acc.bookingsCount} reservas</span>
                    <span>•</span>
                    <span>{acc.nights} noches ocupadas</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-sand-400)] block">
                    Total Generado
                  </span>
                  <span className="text-sm font-bold text-[var(--color-terracotta-500)] font-['Outfit']">
                    ${acc.revenue.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <ChevronRight className="w-4 h-4 text-[var(--color-sand-300)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
