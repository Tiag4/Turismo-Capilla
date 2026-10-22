import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Edit3,
  Power,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useTourismCalendar } from '../../hooks/useTourismCalendar.ts';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import type { TourismSeason, SeasonType } from '../../types/season.types.ts';

export interface TourismCalendarSettingsProps {
  onNavigateCreate?: () => void;
  onNavigateEdit?: (id: string) => void;
}

export const TourismCalendarSettings: React.FC<TourismCalendarSettingsProps> = ({
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const {
    seasons,
    isLoading,
    toggleSeasonActive,
  } = useTourismCalendar();

  const [seasonToToggle, setSeasonToToggle] = useState<TourismSeason | null>(null);

  const handleOpenCreate = () => {
    onNavigateCreate?.();
  };

  const handleOpenEdit = (season: TourismSeason) => {
    onNavigateEdit?.(season.id);
  };

  const typeConfig: Record<
    SeasonType,
    { label: string; textClass: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    HIGH: {
      label: 'Temporada Alta',
      textClass: 'text-[var(--color-terracotta-600)]',
      icon: Flame,
    },
    MEDIUM: {
      label: 'Temporada Media',
      textClass: 'text-[var(--color-sand-700)]',
      icon: Calendar,
    },
    LOW: {
      label: 'Temporada Baja',
      textClass: 'text-[var(--color-sand-500)]',
      icon: Calendar,
    },
    SPECIAL_EVENT: {
      label: 'Evento Oficial',
      textClass: 'text-[var(--color-emerald-portal-600)]',
      icon: Sparkles,
    },
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions — Senior Clean Canvas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--color-sand-900)]">
            Períodos y Temporadas Oficiales
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Configurá las temporadas altas, medias y eventos de Capilla del Monte para sugerir multiplicadores tarifarios a los prestadores.
          </p>
        </div>

        <Button
          variant="emerald"
          onClick={handleOpenCreate}
          className="gap-2 shrink-0 font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Período Turístico</span>
        </Button>
      </div>

      {/* Synchronized Policy Notice — Clean border-l accent, zero floating card */}
      <div className="border-l-2 border-[var(--color-emerald-portal-600)] pl-3.5 py-1 text-xs text-[var(--color-sand-600)] flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-[var(--color-emerald-portal-600)] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[var(--color-sand-900)] font-semibold">Sincronización Automática:</strong> Los períodos configurados por la Comisión se publican de forma inmediata en los calendarios de los prestadores para sugerir multiplicadores tarifarios.
        </p>
      </div>

      {/* Structured List — Flat Canvas (Same background as page, Zero Carditis) */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-[var(--color-sand-400)]">
          Cargando calendario municipal...
        </div>
      ) : seasons.length === 0 ? (
        <div className="py-12 text-center text-xs text-[var(--color-sand-500)]">
          No hay temporadas configuradas aún.
        </div>
      ) : (
        <div className="border-y border-[var(--color-sand-300)] divide-y divide-[var(--color-sand-200)]">
          {seasons.map((season) => {
            const current = typeConfig[season.type];
            const Icon = current.icon;

            return (
              <div
                key={season.id}
                className="py-4.5 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-sand-100)]/60 transition-colors rounded-lg"
              >
                <div className="flex-1 space-y-1">
                  {/* Metadata Row: Category + Dates + Status (Typographic hierarchy, no badge soup) */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className={`inline-flex items-center gap-1 font-bold text-[11px] uppercase tracking-wider ${current.textClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{current.label}</span>
                    </span>

                    <span className="text-[var(--color-sand-300)]">·</span>

                    <span className="text-[var(--color-sand-700)] font-medium">
                      {season.startDate} al {season.endDate}
                    </span>

                    <span className="text-[var(--color-sand-300)]">·</span>

                    <span className={`text-[11px] font-semibold ${season.isActive ? 'text-[var(--color-emerald-portal-600)]' : 'text-[var(--color-sand-400)]'}`}>
                      {season.isActive ? 'Activo' : 'Pausado'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    {season.name}
                  </h3>

                  {season.description && (
                    <p className="text-xs text-[var(--color-sand-500)] line-clamp-1 max-w-2xl">
                      {season.description}
                    </p>
                  )}
                </div>

                {/* Right Column: Multiplier text + Actions */}
                <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-sand-200)]">
                  <div className="text-xs text-[var(--color-sand-600)]">
                    <span>Sugerencia: </span>
                    <strong className="text-sm font-black text-[var(--color-terracotta-600)] font-['Outfit']">
                      x{season.suggestedMultiplier}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSeasonToToggle(season)}
                      className="text-xs font-semibold cursor-pointer"
                      title={season.isActive ? 'Desactivar temporada' : 'Activar temporada'}
                    >
                      <Power className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      <span>{season.isActive ? 'Pausar' : 'Activar'}</span>
                    </Button>

                    <Button
                      variant="terracotta"
                      size="sm"
                      onClick={() => handleOpenEdit(season)}
                      className="text-xs font-bold cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(seasonToToggle)}
        onClose={() => setSeasonToToggle(null)}
        onConfirm={async () => {
          if (seasonToToggle) {
            await toggleSeasonActive(seasonToToggle.id);
            setSeasonToToggle(null);
          }
        }}
        variant={seasonToToggle?.isActive ? 'warning' : 'emerald'}
        title={seasonToToggle?.isActive ? 'Pausar Período Turístico' : 'Activar Período Turístico'}
        description={
          seasonToToggle?.isActive
            ? `¿Estás seguro de que deseas pausar el período "${seasonToToggle.name}"? Los multiplicadores tarifarios sugeridos dejarán de aplicarse a los alojamientos.`
            : `¿Estás seguro de que deseas activar el período "${seasonToToggle?.name}"? Se reanudarán las sugerencias tarifarias asociadas a estas fechas en el portal.`
        }
        confirmLabel={seasonToToggle?.isActive ? 'Pausar Período' : 'Activar Período'}
      />
    </div>
  );
};
