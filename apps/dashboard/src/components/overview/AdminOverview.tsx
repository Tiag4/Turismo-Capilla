import React, { useMemo } from 'react';
import {
  Home,
  CalendarCheck,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  CalendarRange,
  Compass,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { Button } from '../ui/Button.tsx';
import type { DashboardTab } from '../layout/DashboardNav.tsx';

export interface AdminOverviewProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Alojamientos Habilitados',
      value: '12',
      helperText: 'Inspeccionados y activos',
      icon: Home,
      iconColor: 'text-terracotta-600',
    },
    {
      label: 'Reservas Registradas',
      value: '48',
      helperText: 'Transacciones auditadas',
      icon: CalendarCheck,
      iconColor: 'text-emerald-700',
    },
    {
      label: 'Tokens Emitidos',
      value: '15',
      helperText: 'Invitaciones a prestadores',
      icon: KeyRound,
      iconColor: 'text-amber-600',
    },
    {
      label: 'Protección Anti-Overbooking',
      value: '100%',
      helperText: 'Solapamiento atómico cero',
      icon: ShieldCheck,
      iconColor: 'text-[var(--color-uritorco-600)]',
    },
  ], []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sand-900 font-['Outfit']">
            Inicio
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-0.5">
            Panel Operativo y de Fiscalización · Secretaría de Turismo de Capilla del Monte.
          </p>
        </div>

        <a
          href="https://turismocapilla.gob.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Portal Público en Línea</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* KPI Stat Strip */}
      <InlineStatStrip stats={statItems} />

      {/* Main Operational Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        {/* Left: Quick Management Actions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-sand-900 font-['Outfit']">
              Acciones Operativas Prioritarias
            </h2>
            <p className="text-xs text-sand-500">
              Accesos directos a los flujos principales de administración y fiscalización.
            </p>
          </div>

          <div className="border-y border-sand-300 divide-y divide-sand-200">
            {/* Action 1: Invitations */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sand-100/50 px-2 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Adhesión de Prestadores por Token
                  </span>
                </div>
                <p className="text-xs text-sand-600 max-w-xl">
                  Emití tokens seguros con vencimiento para habilitar a nuevos cabañeros formales sin riesgo de estafas.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('invitations')}
                className="shrink-0 font-bold self-start sm:self-center"
              >
                <span>Tokens</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {/* Action 2: Accommodations */}
            <div className="py-4 flex flex-col sm:flex-row sm:Directorio sm:items-center justify-between gap-3 hover:bg-sand-100/50 px-2 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-terracotta-600 shrink-0" />
                  <span className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Directorio y Fiscalización de Alojamientos
                  </span>
                </div>
                <p className="text-xs text-sand-600 max-w-xl">
                  Supervisá tarifas declaradas, capacidades máximas y fotografías activas en el portal público.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('accommodations')}
                className="shrink-0 font-bold self-start sm:self-center"
              >
                <span>Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {/* Action 3: Emergencies & Health */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sand-100/50 px-2 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0" />
                  <span className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Guardias Médicas y Farmacias de Turno
                  </span>
                </div>
                <p className="text-xs text-sand-600 max-w-xl">
                  Designá la farmacia de guardia activa y publicá los avisos médicos del Hospital Municipal 107.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('emergencies')}
                className="shrink-0 font-bold self-start sm:self-center"
              >
                <span>Guardias</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>

            {/* Action 4: Seasons Calendar */}
            <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-sand-100/50 px-2 transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <CalendarRange className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-sm font-bold text-sand-900 font-['Outfit']">
                    Calendario Oficial y Temporadas
                  </span>
                </div>
                <p className="text-xs text-sand-600 max-w-xl">
                  Administrá las fechas de temporada alta, baja y fines de semana largos para las tarifas automáticas.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab('settings')}
                className="shrink-0 font-bold self-start sm:self-center"
              >
                <span>Temporadas</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Operational Status of Destination */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-sand-900 font-['Outfit']">
              Estado del Destino
            </h2>
            <p className="text-xs text-sand-500">
              Vigencia operativa de servicios turísticos.
            </p>
          </div>

          <div className="border-y border-sand-300 divide-y divide-sand-200 text-xs">
            <div className="py-3 flex items-start justify-between gap-2">
              <span className="text-sand-600">Temporada Vigente:</span>
              <span className="font-bold text-sand-900 text-right">Temporada Regular (Baja)</span>
            </div>
            <div className="py-3 flex items-start justify-between gap-2">
              <span className="text-sand-600">Próximo Receso:</span>
              <span className="font-semibold text-sand-800 text-right">Temporada de Invierno 2026</span>
            </div>
            <div className="py-3 flex items-start justify-between gap-2">
              <span className="text-sand-600">Guardia 107:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Shock Room Operativo</span>
              </span>
            </div>
            <div className="py-3 flex items-start justify-between gap-2">
              <span className="text-sand-600">Paseos y Senderos:</span>
              <button
                type="button"
                onClick={() => onNavigateTab('attractions')}
                className="font-bold text-terracotta-600 hover:text-terracotta-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Supervisar Estado</span>
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
