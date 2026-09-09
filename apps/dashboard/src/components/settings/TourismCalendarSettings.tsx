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
          <p className="text-xs text-[var(--color-sand-400)] font-medium">
            Parámetros oficiales de fechas pico para sugerencia tarifaria a cabañeros adheridos
          </p>
        </div>

        <Button variant="emerald" onClick={handleOpenCreate} size="md">
          <Plus className="w-4 h-4" />
          <span>Nuevo Período Turístico</span>
        </Button>
      </div>

      {/* Synchronized Policy Notice */}
      <div className="bg-white p-4 rounded-2xl border border-[var(--color-sand-200)] flex items-start gap-3 text-xs text-[var(--color-sand-800)]">
        <CheckCircle2 className="w-5 h-5 text-[var(--color-emerald-portal-600)] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[var(--color-sand-900)] block mb-0.5">
            Sincronización Automática con Paneles Cabañeros
          </span>
          Los períodos configurados por la Comisión se publican de forma inmediata en los calendarios de los prestadores para que puedan planificar sus cupos y aplicar el multiplicador tarifario correspondiente.
        </div>
      </div>

      {/* Grid of Season Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[var(--color-sand-400)] bg-white rounded-2xl border border-[var(--color-sand-200)]">
          Cargando calendario municipal...
        </div>
      ) : seasons.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)]">
          No hay temporadas configuradas aún.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seasons.map((season) => {
            const current = typeConfig[season.type];
            const Icon = current.icon;

            return (
              <div
                key={season.id}
                className="bg-white p-5 rounded-2xl border border-[var(--color-sand-200)] shadow-xs flex flex-col justify-between hover:border-[var(--color-sand-300)] transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${current.badgeColor}`}>
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
                  </div>

                  <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] mb-1">
                    {season.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-sand-800)] mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                    <span>
                      {new Date(season.startDate + 'T00:00:00').toLocaleDateString('es-AR')} al{' '}
                      {new Date(season.endDate + 'T00:00:00').toLocaleDateString('es-AR')}
                    </span>
                  </div>

                  {season.description && (
                    <p className="text-xs text-[var(--color-sand-400)] mb-3 line-clamp-2">
                      {season.description}
                    </p>
                  )}

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-sand-100)] text-xs font-semibold text-[var(--color-sand-900)]">
                    <span>Sugerencia:</span>
                    <span className="font-bold text-[var(--color-terracotta-500)]">
                      x{season.suggestedMultiplier} sobre tarifa base
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--color-sand-200)] flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleSeasonActive(season.id)}
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
            );
          })}
        </div>
      )}

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
