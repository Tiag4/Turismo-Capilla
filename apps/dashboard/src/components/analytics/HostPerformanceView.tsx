import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Home,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { useHostBookings } from '../../hooks/useHostBookings.ts';
import { useHostAccommodations } from '../../hooks/useHostAccommodations.ts';

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

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
        Calculando métricas de rendimiento y balance...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Period Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit'] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--color-terracotta-500)]" />
            <span>Rendimiento y Balance Financiero</span>
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Métricas oficiales de ocupación, facturación y estadías de tus cabañas
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[var(--color-sand-200)]">
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
                  ? 'bg-[var(--color-terracotta-500)] text-white shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards — Strict Anti-Vibecoded (Solid borders, zero gradients, zero pastel fuzz) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Occupancy Rate */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)]">
              Tasa de Ocupación
            </span>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-600)] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
              {metrics.occupancyRate}%
            </div>
            <p className="text-[11px] text-[var(--color-sand-400)] mt-1 font-medium">
              Mes actual en curso
            </p>
          </div>
        </div>

        {/* KPI 2: Total Revenue */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)]">
              Total Facturado
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[var(--color-emerald-portal-600)] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[var(--color-terracotta-500)] font-['Outfit']">
              ${metrics.totalRevenue.toLocaleString('es-AR')}
            </div>
            <p className="text-[11px] text-[var(--color-sand-400)] mt-1 font-medium">
              {metrics.confirmedCount} reservas confirmadas
            </p>
          </div>
        </div>

        {/* KPI 3: Average Nights */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)]">
              Estadía Promedio
            </span>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-sand-800)] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
              {metrics.averageNights}{' '}
              <span className="text-sm font-semibold text-[var(--color-sand-400)] font-sans">
                noches
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-sand-400)] mt-1 font-medium">
              Promedio por huésped
            </p>
          </div>
        </div>

        {/* KPI 4: Total Guests */}
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)]">
              Huéspedes Recibidos
            </span>
            <div className="w-8 h-8 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-sand-800)] flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
              {metrics.totalGuests}
            </div>
            <p className="text-[11px] text-[var(--color-sand-400)] mt-1 font-medium">
              Pasajeros totales
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Evolution Chart (Solid Bars, Anti-Vibecoded) */}
      <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Facturación Mensual (Últimos 6 Meses)
            </h3>
            <p className="text-xs text-[var(--color-sand-400)]">
              Evolución de ingresos generados por reservas confirmadas
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--color-sand-800)] bg-[var(--color-sand-100)] px-2.5 py-1 rounded-lg">
            Valores en ARS
          </span>
        </div>

        {/* Bar visualization */}
        <div className="pt-6 pb-2">
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

      {/* Breakdown per Accommodation */}
      <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Rendimiento por Cabaña y Unidad
            </h3>
            <p className="text-xs text-[var(--color-sand-400)]">
              Desglose detallado de reservas e ingresos de cada alojamiento
            </p>
          </div>
          <span className="text-xs text-[var(--color-sand-400)] font-medium">
            {metrics.revenueByAccommodation.length} establecimientos
          </span>
        </div>

        <div className="divide-y divide-[var(--color-sand-100)]">
          {metrics.revenueByAccommodation.map((acc) => (
            <div
              key={acc.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--color-sand-50)] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-sand-800)] flex items-center justify-center shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    {acc.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-sand-400)]">
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
