import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { culturalEventsService } from '../../services/culturalEvents.service.ts';
import type { CulturalEvent, EventCategory } from '../../types/culturalEvent.types.ts';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';

const CATEGORY_LABELS: Record<EventCategory, string> = {
  FESTIVAL: 'Festival',
  THEATER: 'Teatro',
  MUSIC: 'Música en Vivo',
  FAIR: 'Feria & Paseo',
  WORKSHOP: 'Taller & Charla',
  COMMUNITY: 'Comunitario',
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  FESTIVAL: 'bg-[#C95627] text-white font-bold',
  THEATER: 'bg-[#5C7E30] text-white font-bold',
  MUSIC: 'bg-[#1C8B68] text-white font-bold',
  FAIR: 'bg-[#8C4A2F] text-white font-bold',
  WORKSHOP: 'bg-[#2E4A3E] text-white font-bold',
  COMMUNITY: 'bg-[#3A352F] text-white font-bold',
};

export interface CulturalAgendaManagerProps {
  onNavigateCreate: () => void;
  onNavigateEdit: (id: string) => void;
}

export const CulturalAgendaManager: React.FC<CulturalAgendaManagerProps> = ({
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const [events, setEvents] = useState<CulturalEvent[]>(() => culturalEventsService.getEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    culturalEventsService.fetchEvents().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setEvents(fetched);
      }
    });
  }, []);

  const refreshEvents = () => {
    setEvents(culturalEventsService.getEvents());
  };

  const handleToggleActive = async (id: string) => {
    await culturalEventsService.toggleEventActive(id);
    refreshEvents();
  };

  const handleConfirmDelete = async () => {
    if (deletingId) {
      await culturalEventsService.deleteEvent(deletingId);
      setDeletingId(null);
      refreshEvents();
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || evt.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const activeCount = events.filter((e) => e.isActive).length;
  const freeCount = events.filter((e) => e.isFree).length;

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Total Programados',
      value: events.length,
      helperText: 'Eventos registrados en agenda',
    },
    {
      label: 'Publicados en Portada',
      value: activeCount,
      iconColor: 'text-[var(--color-emerald-portal-600)]',
      helperText: 'Visibles para el turista',
    },
    {
      label: 'Entrada Gratuita',
      value: freeCount,
      iconColor: 'text-[var(--color-terracotta-500)]',
      helperText: 'Acceso libre y comunitario',
    },
  ], [events.length, activeCount, freeCount]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions (No category eyebrow) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--color-sand-900)]">
            Eventos y Actividades
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Administrá los eventos públicos que se exhiben en la portada y la agenda turística oficial de Capilla del Monte.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white text-xs font-bold tracking-wide shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento Cultural</span>
        </button>
      </div>

      {/* 2. Métricas Rápidas — Unified Stat Strip (Flat on canvas) */}
      <InlineStatStrip stats={statItems} />

      {/* 3. Barra de Búsqueda y Filtros (Direct on canvas, zero floating card) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between py-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--color-sand-400)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o lugar..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--color-sand-300)] bg-white text-[var(--color-sand-900)] focus:outline-none focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'ALL'
                ? 'bg-[var(--color-sand-900)] text-white shadow-xs'
                : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)]'
            }`}
          >
            Todos ({events.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
            const count = events.filter((e) => e.category === catKey).length;
            const isSelected = filterCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setFilterCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[var(--color-emerald-portal-600)] text-white shadow-xs'
                    : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)]'
                }`}
              >
                {catLabel} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Listado de Eventos (Cards de Catálogo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`flex flex-col bg-white rounded-2xl border transition-all overflow-hidden shadow-xs hover:shadow-md ${
              evt.isActive ? 'border-[var(--color-sand-200)]' : 'border-dashed border-[var(--color-sand-300)] opacity-75'
            }`}
          >
            {/* Imagen de Cabecera con Badge de Categoría */}
            <div className="relative aspect-16/9 w-full bg-[var(--color-sand-100)] overflow-hidden">
              <img
                src={evt.imageUrl}
                alt={evt.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs ${CATEGORY_COLORS[evt.category]}`}>
                  {CATEGORY_LABELS[evt.category]}
                </span>
                {!evt.isActive && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-800 text-stone-200 shadow-xs">
                    Pausado
                  </span>
                )}
              </div>
            </div>

            {/* Datos */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-display font-extrabold text-base text-[var(--color-sand-900)] line-clamp-1">
                  {evt.title}
                </h3>
                <div className="mt-2 space-y-1 text-xs text-[var(--color-sand-600)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--color-terracotta-500)] shrink-0" />
                    <span>{evt.startDate} ({evt.timeString})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-terracotta-500)] shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    {evt.isFree ? (
                      <span className="text-[11px] font-black text-emerald-700 uppercase">
                        Entrada Gratuita
                      </span>
                    ) : (
                      <span className="text-[11px] font-black text-[var(--color-terracotta-600)]">
                        ${(evt.price ?? 0).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 border-t border-[var(--color-sand-100)] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleToggleActive(evt.id)}
                  title={evt.isActive ? 'Pausar publicación en el portal' : 'Publicar evento'}
                  className="p-1.5 rounded-lg text-xs font-semibold text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
                >
                  {evt.isActive ? <EyeOff className="w-4 h-4 text-amber-600" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onNavigateEdit(evt.id)}
                    className="p-1.5 rounded-lg text-xs font-semibold text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
                    title="Editar evento"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(evt.id)}
                    className="p-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Eliminar evento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ConfirmDialog de Eliminación */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="Eliminar Evento Cultural"
        description="¿Estás seguro de que deseás eliminar este evento de la agenda? Dejará de figurar inmediatamente en la portada del portal turístico."
        confirmLabel="Eliminar Definitivamente"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingId(null)}
      />
    </div>
  );
};
