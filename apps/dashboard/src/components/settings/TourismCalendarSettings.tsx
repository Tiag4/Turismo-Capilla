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
    { label: string; badgeColor: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    HIGH: {
      label: 'Temporada Alta',
      badgeColor: 'bg-[var(--color-terracotta-500)] text-white',
      icon: Flame,
    },
    MEDIUM: {
      label: 'Temporada Media',
      badgeColor: 'bg-amber-600 text-white',
      icon: Calendar,
    },
    LOW: {
      label: 'Temporada Baja',
      badgeColor: 'bg-zinc-700 text-white',
      icon: Calendar,
    },
    SPECIAL_EVENT: {
      label: 'Evento Especial',
      badgeColor: 'bg-[var(--color-uritorco-600)] text-white',
      icon: Sparkles,
    },
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Calendario Oficial de Temporadas y Tarifas
          </h2>
          <p className="text-xs text-[var(--color-sand-400)] font-medium mt-0.5">
            Parámetros de fechas pico para sugerencia tarifaria a prestadores adheridos
          </p>
        </div>

        <Button variant="emerald" onClick={handleOpenCreate} size="md">
          <Plus className="w-4 h-4" />
          <span>Nuevo Período Turístico</span>
        </Button>
      </div>

      {/* Synchronized Policy Notice */}
      <div className="bg-[var(--color-sand-50)] p-4 rounded-xl border border-[var(--color-sand-200)] flex items-start gap-3 text-xs text-[var(--color-sand-800)]">
        <CheckCircle2 className="w-4 h-4 text-[var(--color-emerald-portal-600)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--color-sand-900)] block mb-0.5">
            Sincronización Automática con Paneles Cabañeros
          </span>
          Los períodos configurados por la Comisión se publican de forma inmediata en los calendarios de los prestadores para que puedan planificar sus cupos y aplicar el multiplicador tarifario correspondiente.
        </div>
      </div>

      {/* Structured List of Seasons (Anti-Carditis) */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando calendario municipal...
        </div>
      ) : seasons.length === 0 ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-500)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          No hay temporadas configuradas aún.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs divide-y divide-[var(--color-sand-200)]">
          {seasons.map((season) => {
            const current = typeConfig[season.type];
            const Icon = current.icon;

            return (
              <div
                key={season.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-sand-50)] transition-colors"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${current.badgeColor}`}>
                      <Icon className="w-3 h-3" />
                      <span>{current.label}</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md text-white ${
                        season.isActive ? 'bg-[#005530]' : 'bg-rose-700'
                      }`}
                    >
                      {season.isActive ? 'Vigente' : 'Inactiva'}
                    </span>

                    <span className="text-xs font-semibold text-[var(--color-sand-500)] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      <span>
                        {new Date(season.startDate + 'T00:00:00').toLocaleDateString('es-AR')} al{' '}
                        {new Date(season.endDate + 'T00:00:00').toLocaleDateString('es-AR')}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
                    {season.name}
                  </h3>

                  {season.description && (
                    <p className="text-xs text-[var(--color-sand-500)] line-clamp-1 max-w-2xl">
                      {season.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[var(--color-sand-100)]">
                  <div className="text-xs font-semibold text-[var(--color-sand-700)] bg-[var(--color-sand-100)] px-2.5 py-1 rounded-lg">
                    <span>Sugerencia: </span>
                    <strong className="text-[var(--color-terracotta-600)] font-bold">
                      x{season.suggestedMultiplier}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSeasonToToggle(season)}
                      className="text-xs"
                      title={season.isActive ? 'Desactivar temporada' : 'Activar temporada'}
                    >
                      <Power className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      <span>{season.isActive ? 'Pausar' : 'Activar'}</span>
                    </Button>

                    <Button
                      variant="terracotta"
                      size="sm"
                      onClick={() => handleOpenEdit(season)}
                      className="text-xs"
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
