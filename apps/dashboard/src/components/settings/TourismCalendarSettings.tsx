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
import { SeasonModal } from './SeasonModal.tsx';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import type { TourismSeason, CreateSeasonDto, SeasonType } from '../../types/season.types.ts';

export const TourismCalendarSettings: React.FC = () => {
  const {
    seasons,
    isLoading,
    createSeason,
    updateSeason,
    toggleSeasonActive,
  } = useTourismCalendar();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<TourismSeason | null>(null);
  const [seasonToToggle, setSeasonToToggle] = useState<TourismSeason | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenCreate = () => {
    setEditingSeason(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (season: TourismSeason) => {
    setEditingSeason(season);
    setIsModalOpen(true);
  };

  const handleSubmit = async (dto: CreateSeasonDto) => {
    setIsSubmitting(true);
    try {
      if (editingSeason) {
        await updateSeason(editingSeason.id, dto);
      } else {
        await createSeason(dto);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeConfig: Record<
    SeasonType,
    { label: string; textClass: string; dotClass: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    HIGH: {
      label: 'Temporada Alta',
      textClass: 'text-[var(--color-terracotta-600)]',
      dotClass: 'bg-[var(--color-terracotta-500)]',
      icon: Flame,
    },
    MEDIUM: {
      label: 'Temporada Media',
      textClass: 'text-amber-700',
      dotClass: 'bg-amber-600',
      icon: Calendar,
    },
    LOW: {
      label: 'Temporada Baja',
      textClass: 'text-zinc-600',
      dotClass: 'bg-zinc-500',
      icon: Calendar,
    },
    SPECIAL_EVENT: {
      label: 'Evento Especial',
      textClass: 'text-[var(--color-uritorco-700)]',
      dotClass: 'bg-[var(--color-uritorco-600)]',
      icon: Sparkles,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
            Calendario Oficial de Temporadas y Tarifas
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Parámetros oficiales de fechas pico para sugerencia tarifaria a prestadores adheridos
          </p>
        </div>

        <Button variant="emerald" onClick={handleOpenCreate} size="md">
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

                    <span className="font-semibold text-[var(--color-sand-600)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      <span>
                        {new Date(season.startDate + 'T00:00:00').toLocaleDateString('es-AR')} al{' '}
                        {new Date(season.endDate + 'T00:00:00').toLocaleDateString('es-AR')}
                      </span>
                    </span>

                    <span className="text-[var(--color-sand-300)]">·</span>

                    <span className="inline-flex items-center gap-1.5 font-bold text-[11px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${season.isActive ? 'bg-[#005530]' : 'bg-rose-600'}`} />
                      <span className={season.isActive ? 'text-[#005530]' : 'text-rose-700'}>
                        {season.isActive ? 'Vigente' : 'Inactiva'}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    {season.name}
                  </h3>

                  {/* Description */}
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
                      className="text-xs font-semibold"
                      title={season.isActive ? 'Desactivar temporada' : 'Activar temporada'}
                    >
                      <Power className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      <span>{season.isActive ? 'Pausar' : 'Activar'}</span>
                    </Button>

                    <Button
                      variant="terracotta"
                      size="sm"
                      onClick={() => handleOpenEdit(season)}
                      className="text-xs font-bold"
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

      {/* Confirm Season Toggle Dialog */}
      <ConfirmDialog
        isOpen={Boolean(seasonToToggle)}
        onClose={() => setSeasonToToggle(null)}
        onConfirm={() => {
          if (seasonToToggle) {
            toggleSeasonActive(seasonToToggle.id);
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

      {/* Season Modal */}
      <SeasonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        season={editingSeason}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};
