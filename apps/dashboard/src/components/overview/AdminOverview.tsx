import React, { useMemo } from 'react';
import {
  Home,
  CalendarCheck,
  Mail,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  CalendarRange,
  Compass,
  ExternalLink,
} from 'lucide-react';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import type { DashboardTab } from '../layout/DashboardNav.tsx';

export interface AdminOverviewProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

interface ManagementModule {
  id: DashboardTab;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
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
      label: 'Invitaciones Enviadas',
      value: '15',
      helperText: 'Cabañeros convocados',
      icon: Mail,
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

  const modules: ManagementModule[] = [
    {
      id: 'accommodations',
      title: 'Alojamientos y Prestadores',
      description: 'Supervisá el catálogo oficial, fiscalizá tarifas declaradas, fotografías y capacidades máximas habilitadas.',
      icon: Home,
      iconColor: 'text-terracotta-600',
    },
    {
      id: 'invitations',
      title: 'Invitaciones a Cabañeros',
      description: 'Convocá formalmente a nuevos prestadores mediante invitaciones seguras con vencimiento para su registro en el portal.',
      icon: Mail,
      iconColor: 'text-emerald-700',
    },
    {
      id: 'bookings',
      title: 'Reservas del Destino',
      description: 'Consultá el libro unificado de solicitudes turísticas y verificá la consistencia transaccional de ingresos y egresos.',
      icon: CalendarCheck,
      iconColor: 'text-terracotta-600',
    },
    {
      id: 'emergencies',
      title: 'Guardias y Emergencias',
      description: 'Designá la farmacia de guardia activa hoy y actualizá los comunicados oficiales del Hospital Municipal 107.',
      icon: ShieldAlert,
      iconColor: 'text-rose-700',
    },
    {
      id: 'attractions',
      title: 'Atractivos y Senderos',
      description: 'Administrá el catálogo de cerros, balnearios y circuitos de trekking, manteniendo actualizada su habilitación operativa.',
      icon: Compass,
      iconColor: 'text-amber-700',
    },
    {
      id: 'settings',
      title: 'Temporadas y Tarifas',
      description: 'Definí el calendario oficial de temporada alta, media y baja junto con las reglas de estadía mínima obligatoria.',
      icon: CalendarRange,
      iconColor: 'text-emerald-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sand-900 font-['Outfit']">
            Inicio
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-0.5">
            Panel de Administración · Secretaría de Turismo de Capilla del Monte.
          </p>
        </div>

        <a
          href="https://turismocapilla.gob.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Portal Público en Línea</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* KPI Stat Strip */}
      <InlineStatStrip stats={statItems} />

      {/* Management Modules Grid */}
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-base font-bold text-sand-900 font-['Outfit']">
            Módulos de Gestión Municipal
          </h2>
          <p className="text-xs text-sand-500">
            Accedé directamente a las herramientas de fiscalización y servicios turísticos del portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateTab(mod.id)}
                className="p-5 rounded-xl border border-sand-300 hover:border-sand-400 bg-white/70 hover:bg-white shadow-xs transition-all cursor-pointer group flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${mod.iconColor} shrink-0`} />
                    <h3 className="text-sm font-bold text-sand-900 font-['Outfit'] group-hover:text-terracotta-700 transition-colors">
                      {mod.title}
                    </h3>
                  </div>
                  <p className="text-xs text-sand-600 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-sand-100 flex items-center justify-between text-xs font-semibold text-terracotta-600 group-hover:text-terracotta-700">
                  <span>Acceder</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
