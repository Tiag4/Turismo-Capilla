import React from 'react';
import {
  Download,
  Calendar,
  Users,
  DollarSign,
  BedDouble,
  Compass,
} from 'lucide-react';
import { useTourismReports } from '../../hooks/useTourismReports.ts';
import { type ReportPeriod } from '../../services/reports.service.ts';
import { OccupancyBarChart } from './OccupancyBarChart.tsx';
import { StatCard } from '../ui/StatCard.tsx';
import { Button } from '../ui/Button.tsx';
import { Select } from '../ui/Select.tsx';

export const OccupancyReportView: React.FC = () => {
  const { period, setPeriod, data, isLoading, exportCsv } = useTourismReports();

  const periodOptions: { value: ReportPeriod; label: string }[] = [
    { value: 'CURRENT_FORTNIGHT', label: 'Quincena en Curso (01 - 15 Sep 2026)' },
    { value: 'CURRENT_MONTH', label: 'Mes Completo (Septiembre 2026)' },
    { value: 'SUMMER_SEASON', label: 'Temporada de Verano (Enero - Febrero 2026)' },
    { value: 'WINTER_BREAK', label: 'Vacaciones de Invierno (Julio 2026)' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Reportes Estadísticos y Ocupación Turística
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Métricas de afluencia, impacto económico y procedencia en Capilla del Monte
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
              options={periodOptions}
            />
          </div>

          <Button
            variant="emerald"
            size="md"
            onClick={exportCsv}
            disabled={isLoading || !data}
            className="shrink-0"
            title="Descargar listado de reservas en formato CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Generando reporte estadístico municipal...
        </div>
      ) : (
        <>
          {/* Key Metric Bento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Ocupación Promedio"
              value={`${data.averageOccupancy}%`}
              icon={BedDouble}
              iconColor="text-[var(--color-uritorco-600)]"
              helperText={`Plazas registradas en ${data.periodLabel}`}
            />
            <StatCard
              label="Impacto Económico Directo"
              value={`$${(data.totalRevenue / 1000000).toFixed(1)}M`}
              icon={DollarSign}
              iconColor="text-[var(--color-terracotta-500)]"
              helperText={`$${data.totalRevenue.toLocaleString('es-AR')} ARS`}
            />
            <StatCard
              label="Turistas Hospedados"
              value={data.totalGuests.toString()}
              icon={Users}
              iconColor="text-[var(--color-emerald-portal-600)]"
              helperText={`${data.totalBookings} reservas confirmadas`}
            />
            <StatCard
              label="Estadía Promedio"
              value={`${data.averageStayNights} noches`}
              icon={Calendar}
              iconColor="text-amber-600"
              helperText="Permanencia media en destino"
            />
          </div>

          {/* Chart Section */}
          <OccupancyBarChart data={data.chartData} />

          {/* Bottom Grid: Origin Breakdown & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin Breakdown */}
            <div className="bg-white p-5 rounded-2xl border border-[var(--color-sand-200)] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-[var(--color-emerald-portal-600)]" />
                  <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    Procedencia de los Visitantes
                  </h4>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {data.origins.map((orig, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold text-[var(--color-sand-800)]">
                        <span>{orig.origin}</span>
                        <span className="font-mono text-[var(--color-sand-900)]">{orig.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-[var(--color-sand-100)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-emerald-portal-600)] rounded-full"
                          style={{ width: `${orig.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-[var(--color-sand-200)] text-[11px] text-[var(--color-sand-400)]">
                Datos calculados en base a registros de ingreso y fichas de huéspedes de la Comisión.
              </div>
            </div>

            {/* Direct Bookings Sample / Export Preview */}
            <div className="bg-white p-5 rounded-2xl border border-[var(--color-sand-200)] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    Muestra de Reservas Auditadas
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--color-emerald-portal-600)] px-2 py-0.5 rounded-sm">
                    {data.bookings.length} Registros
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mt-4">
                  {data.bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="p-3 bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[var(--color-sand-900)] block">
                          {b.bookingCode}
                        </span>
                        <span className="text-[11px] text-[var(--color-sand-400)]">
                          {b.accommodation?.name || 'Alojamiento'} • {b.guestName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[var(--color-terracotta-500)] block font-['Outfit']">
                          ${b.totalAmount.toLocaleString('es-AR')}
                        </span>
                        <span className="text-[10px] text-[var(--color-sand-400)]">
                          {b.totalNights} noches ({b.checkIn})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--color-sand-200)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-sand-400)]">
                  Archivo listo para presentación ministerial
                </span>
                <Button variant="outline" size="sm" onClick={exportCsv} className="text-xs">
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Archivo CSV</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
