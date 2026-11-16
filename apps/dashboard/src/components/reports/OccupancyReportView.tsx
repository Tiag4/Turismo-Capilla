import React, { useMemo } from 'react';
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
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
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

  const statItems: StatItem[] = useMemo(() => {
    if (!data) return [];
    return [
      {
        label: 'Ocupación Promedio',
        value: `${data.averageOccupancy}%`,
        helperText: `Plazas en ${data.periodLabel}`,
        icon: BedDouble,
        iconColor: 'text-[var(--color-uritorco-600)]',
      },
      {
        label: 'Impacto Económico',
        value: `$${(data.totalRevenue / 1000000).toFixed(1)}M`,
        helperText: `$${data.totalRevenue.toLocaleString('es-AR')} ARS`,
        icon: DollarSign,
        iconColor: 'text-terracotta-600',
      },
      {
        label: 'Turistas Hospedados',
        value: data.totalGuests.toString(),
        helperText: `${data.totalBookings} reservas confirmadas`,
        icon: Users,
        iconColor: 'text-emerald-700',
      },
      {
        label: 'Estadía Promedio',
        value: `${data.averageStayNights} noches`,
        helperText: 'Permanencia media en destino',
        icon: Calendar,
        iconColor: 'text-amber-600',
      },
    ];
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sand-900 font-['Outfit']">
            Reportes Estadísticos y Ocupación Turística
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-0.5">
            Métricas de afluencia, impacto económico y procedencia en Capilla del Monte.
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
            className="shrink-0 font-bold"
            title="Descargar listado de reservas en formato CSV"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="py-16 text-center text-xs text-sand-500">
          Generando reporte estadístico municipal...
        </div>
      ) : (
        <>
          {/* Key Metric Strip */}
          <InlineStatStrip stats={statItems} />

          {/* Chart Section */}
          <OccupancyBarChart data={data.chartData} />

          {/* Bottom Grid: Origin Breakdown & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Origin Breakdown */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Compass className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Procedencia de los Visitantes
                  </h2>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {data.origins.map((orig, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-semibold text-sand-800">
                        <span>{orig.origin}</span>
                        <span className="font-['Outfit'] font-bold tabular-nums text-sand-900">{orig.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-sand-200/70 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${orig.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-200 text-[11px] text-sand-500">
                Datos calculados en base a registros de ingreso y fichas de huéspedes de la Comisión.
              </div>
            </div>

            {/* Direct Bookings Sample / Export Preview */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Muestra de Reservas Auditadas
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sand-700 bg-sand-200/60 px-2 py-0.5 rounded">
                    {data.bookings.length} Registros
                  </span>
                </div>

                <div className="border-y border-sand-200 divide-y divide-sand-200">
                  {data.bookings.slice(0, 3).map((b) => (
                    <div
                      key={b.id}
                      className="py-2.5 px-2 flex items-center justify-between text-xs hover:bg-sand-100/50 transition-colors"
                    >
                      <div>
                        <span className="font-['Outfit'] font-bold tabular-nums tracking-wide text-xs text-sand-900 block">
                          {b.bookingCode}
                        </span>
                        <span className="text-[11px] text-sand-500">
                          {b.accommodation?.name || 'Alojamiento'} • {b.guestName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-terracotta-600 block font-['Outfit'] tabular-nums">
                          ${b.totalAmount.toLocaleString('es-AR')}
                        </span>
                        <span className="text-[10px] text-sand-500 tabular-nums">
                          {b.totalNights} noches ({b.checkIn})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-sand-200 flex items-center justify-between">
                <span className="text-[11px] text-sand-500">
                  Archivo listo para presentación ministerial
                </span>
                <Button variant="outline" size="sm" onClick={exportCsv} className="text-xs">
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Descargar CSV</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
