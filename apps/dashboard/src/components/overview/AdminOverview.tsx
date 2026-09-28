import React from 'react';
import { Home, CalendarCheck, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';
import { StatCard } from '../ui/StatCard.tsx';
import { Button } from '../ui/Button.tsx';
import type { DashboardTab } from '../layout/DashboardNav.tsx';

export interface AdminOverviewProps {
  onNavigateTab: (tab: DashboardTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigateTab }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
          Centro de Control y Monitoreo Municipal
        </h2>
        <p className="text-xs text-[var(--color-sand-400)] font-medium">
          Métricas y auditoría de la plataforma oficial de Turismo de Capilla del Monte
        </p>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Alojamientos Habilitados"
          value="12"
          icon={Home}
          iconColor="text-[var(--color-terracotta-500)]"
          helperText="Inspeccionados y activos"
        />
        <StatCard
          label="Reservas Registradas"
          value="48"
          icon={CalendarCheck}
          iconColor="text-[var(--color-emerald-portal-600)]"
          helperText="Transacciones directas"
        />
        <StatCard
          label="Tokens Emitidos"
          value="15"
          icon={KeyRound}
          iconColor="text-amber-600"
          helperText="Invitaciones a prestadores"
        />
        <StatCard
          label="Protección Anti-Overbooking"
          value="100%"
          icon={ShieldCheck}
          iconColor="text-[var(--color-uritorco-600)]"
          helperText="Solapamiento atómico cero"
        />
      </div>

      {/* Quick Action Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Card 1: Invitations */}
        <div className="bg-white p-6 rounded-3xl border border-[var(--color-sand-200)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white mb-4">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit'] mb-1">
              Adhesión de Nuevos Prestadores
            </h3>
            <p className="text-xs text-[var(--color-sand-400)] font-medium leading-relaxed">
              Generá tokens seguros con vencimiento para cabañeros habilitados. Esto evita estafas y garantiza que solo establecimientos oficiales operen en el portal.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--color-sand-200)]">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => onNavigateTab('invitations')}
              className="w-full sm:w-auto"
            >
              <span>Gestionar Invitaciones</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Card 2: Accommodations audit */}
        <div className="bg-white p-6 rounded-3xl border border-[var(--color-sand-200)] shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-terracotta-500)] flex items-center justify-center text-white mb-4">
              <Home className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-sand-900)] font-['Outfit'] mb-1">
              Catálogo de Alojamientos
            </h3>
            <p className="text-xs text-[var(--color-sand-400)] font-medium leading-relaxed">
              Supervisá las tarifas por noche, fotos y capacidades publicadas en el portal público de Capilla del Monte para mantener la transparencia en destino.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[var(--color-sand-200)]">
            <Button
              variant="terracotta"
              size="sm"
              onClick={() => onNavigateTab('accommodations')}
              className="w-full sm:w-auto"
            >
              <span>Auditar Alojamientos</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
