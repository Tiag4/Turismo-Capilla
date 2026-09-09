import React from 'react';
import type { DashboardTab } from './DashboardNav.tsx';
import { FileSpreadsheet, ShieldCheck, Image, Settings } from 'lucide-react';

export interface AdminSectionPlaceholderProps {
  tab: DashboardTab;
}

const SECTION_DATA: Partial<
  Record<
    DashboardTab,
    { title: string; subtitle: string; issue: string; icon: React.ComponentType<{ className?: string }> }
  >
> = {
  reports: {
    title: 'Reportes Turísticos de Ocupación',
    subtitle: 'Estadísticas globales, impacto económico y exportación a formato CSV.',
    issue: 'TDR-15',
    icon: FileSpreadsheet,
  },
  audit: {
    title: 'Registro de Auditoría de Actividad',
    subtitle: 'Trazabilidad cronológica inmutable de tokens emitidos y prestadores habilitados.',
    issue: 'TDR-16',
    icon: ShieldCheck,
  },
  moderation: {
    title: 'Moderación de Galería y Contenidos',
    subtitle: 'Supervisión de fotografías y descripciones publicadas en el catálogo oficial.',
    issue: 'TDR-17',
    icon: Image,
  },
  settings: {
    title: 'Configuración Oficial del Calendario Turístico',
    subtitle: 'Parametrización de temporadas altas, bajas y festividades de Capilla del Monte.',
    issue: 'TDR-18',
    icon: Settings,
  },
};

export const AdminSectionPlaceholder: React.FC<AdminSectionPlaceholderProps> = ({ tab }) => {
  const data = SECTION_DATA[tab] || {
    title: 'Módulo Municipal',
    subtitle: 'Sección del panel institucional.',
    issue: 'TDR',
    icon: Settings,
  };
  const Icon = data.icon;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
          {data.title}
        </h2>
        <p className="text-xs text-[var(--color-sand-400)] font-medium">
          {data.subtitle}
        </p>
      </div>

      <div className="bg-white border border-[var(--color-sand-200)] rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 max-w-lg mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-emerald-portal-600)] bg-[var(--color-sand-100)] px-2.5 py-1 rounded-md mb-2 inline-block">
            Módulo Asignado ({data.issue})
          </span>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Sección vinculada al Sidebar Municipal
          </h3>
          <p className="text-xs text-[var(--color-sand-400)] mt-1 max-w-sm leading-relaxed">
            Navegación del shell lateral completada exitosamente. La funcionalidad específica se desarrollará bajo la tarea correspondiente.
          </p>
        </div>
      </div>
    </div>
  );
};
