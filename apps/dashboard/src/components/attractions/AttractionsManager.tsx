import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { AttractionModal } from './AttractionModal.tsx';
import { AttractionCard } from './AttractionCard.tsx';
import { attractionsService } from '../../services/attractions.service.ts';
import type {
  Attraction,
  CreateAttractionDto,
  AttractionCategory,
  AttractionStatus,
} from '../../types/attraction.types.ts';

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  HILL: 'Cerro / Montaña',
  NATURE_TRAIL: 'Sendero / Trekking',
  RIVER_BEACH: 'Río / Balneario',
  CULTURAL: 'Cultural / Histórico',
  NIGHT: 'Nocturno / Astroturismo',
};

export const AttractionsManager: React.FC = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | AttractionCategory>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AttractionStatus | 'FEATURED'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);

  // Delete Confirm State
  const [deletingAttraction, setDeletingAttraction] = useState<Attraction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAttractions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await attractionsService.getAll();
      setAttractions(data);
    } catch (err) {
      console.error('Error al cargar atractivos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAttractions();
  }, [loadAttractions]);

  // Handle Save (Create or Update)
  const handleSaveAttraction = async (dto: CreateAttractionDto) => {
    if (editingAttraction) {
      await attractionsService.update(editingAttraction.id, dto);
    } else {
      await attractionsService.create(dto);
    }
    await loadAttractions();
  };

  // Handle Quick Toggle Featured
  const handleToggleFeatured = async (attraction: Attraction) => {
    try {
      await attractionsService.toggleFeatured(attraction.id);
      await loadAttractions();
    } catch (err) {
      console.error('Error al alternar destacado:', err);
    }
  };

  // Handle Quick Status Change
  const handleQuickStatusChange = async (attraction: Attraction, newStatus: AttractionStatus) => {
    try {
      await attractionsService.updateStatus(attraction.id, newStatus, attraction.statusNotice);
      await loadAttractions();
    } catch (err) {
      console.error('Error al cambiar disponibilidad:', err);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deletingAttraction) return;
    try {
      setIsDeleting(true);
      await attractionsService.delete(deletingAttraction.id);
      setDeletingAttraction(null);
      await loadAttractions();
    } catch (err) {
      console.error('Error al eliminar atractivo:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const total = attractions.length;
    const open = attractions.filter((a) => (a.status || 'OPEN') === 'OPEN').length;
    const restricted = attractions.filter((a) => a.status === 'WEATHER_RESTRICTED').length;
    const closed = attractions.filter((a) => a.status === 'CLOSED').length;
    const featured = attractions.filter((a) => a.isFeatured).length;
    return { total, open, restricted, closed, featured };
  }, [attractions]);

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Total Catálogo',
      value: stats.total,
      helperText: 'Paseos registrados',
      icon: Compass,
      iconColor: 'text-[var(--color-sand-600)]',
    },
    {
      label: 'Abiertos',
      value: stats.open,
      helperText: 'Senderos habilitados',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Precaución',
      value: stats.restricted,
      helperText: 'Alerta meteorológica',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
    },
    {
      label: 'Clausurados',
      value: stats.closed,
      helperText: 'Acceso inhabilitado',
      icon: XCircle,
      iconColor: 'text-rose-500',
    },
    {
      label: 'Destacados',
      value: stats.featured,
      helperText: 'Portada del portal',
      icon: Star,
      iconColor: 'text-amber-500',
    },
  ], [stats]);

  // Filtered List
  const filteredAttractions = useMemo(() => {
    return attractions.filter((item) => {
      // Category filter
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;

      // Status filter
      if (statusFilter === 'FEATURED' && !item.isFeatured) return false;
      if (statusFilter !== 'ALL' && statusFilter !== 'FEATURED') {
        const itemStatus = item.status || 'OPEN';
        if (itemStatus !== statusFilter) return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesCat = CATEGORY_LABELS[item.category]?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [attractions, categoryFilter, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header — Clean title without embedded icon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] tracking-tight font-['Outfit']">
            Gestión de Paseos, Senderos y Destacados
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Controlá la oferta oficial de atractivos, el estado meteorológico operativo y los paseos destacados del portal.
          </p>
        </div>

        <Button
          variant="terracotta"
          onClick={() => {
            setEditingAttraction(null);
            setIsModalOpen(true);
          }}
          className="gap-2 shrink-0 font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Paseo / Sendero</span>
        </Button>
      </div>

      {/* KPI Metrics Strip */}
      <InlineStatStrip stats={statItems} />

      {/* Filtros y Buscador */}
      <div className="space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre de paseo, sendero o paisaje..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-sand-300 rounded-xl text-xs sm:text-sm text-sand-900 placeholder-sand-400 focus:outline-none focus:border-terracotta-500 shadow-xs transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-sand-500 mr-1 shrink-0">
              Estado:
            </span>
            {(
              [
                { id: 'ALL', label: 'Todos' },
                { id: 'OPEN', label: 'Abiertos' },
                { id: 'WEATHER_RESTRICTED', label: 'Precaución' },
                { id: 'CLOSED', label: 'Clausurados' },
                { id: 'FEATURED', label: '★ Destacados' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === s.id
                    ? 'bg-sand-900 text-white'
                    : 'bg-sand-200/60 text-sand-700 hover:bg-sand-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Píldoras de Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sand-500 mr-1 shrink-0">
            Categoría:
          </span>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-terracotta-600 text-white'
                : 'bg-sand-200/60 text-sand-700 hover:bg-sand-200'
            }`}
          >
            Todas
          </button>
          {(Object.keys(CATEGORY_LABELS) as AttractionCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-sand-200/60 text-sand-700 hover:bg-sand-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Atractivos */}
      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-sand-600">Cargando catálogo de atractivos...</p>
        </div>
      ) : filteredAttractions.length === 0 ? (
        <div className="py-16 text-center space-y-3 border-y border-sand-200">
          <Compass className="w-12 h-12 text-sand-300 mx-auto" />
          <h3 className="font-bold text-lg text-sand-900">No se encontraron atractivos</h3>
          <p className="text-sm text-sand-500 max-w-md mx-auto">
            No hay atractivos que coincidan con los filtros seleccionados. Probá limpiando el buscador o agregá uno nuevo.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setCategoryFilter('ALL');
              setStatusFilter('ALL');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((item) => (
            <AttractionCard
              key={item.id}
              item={item}
              onToggleFeatured={handleToggleFeatured}
              onQuickStatusChange={handleQuickStatusChange}
              onEdit={(att) => {
                setEditingAttraction(att);
                setIsModalOpen(true);
              }}
              onDelete={(att) => setDeletingAttraction(att)}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear / Editar */}
      <AttractionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAttraction(null);
        }}
        onSubmit={handleSaveAttraction}
        attraction={editingAttraction}
      />

      {/* Diálogo de Confirmación para Eliminar */}
      <ConfirmDialog
        isOpen={Boolean(deletingAttraction)}
        onClose={() => setDeletingAttraction(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="danger"
        title={`¿Eliminar "${deletingAttraction?.name}" del catálogo?`}
        description="Esta acción eliminará el paseo de la lista administrativa y dejará de estar visible en el portal turístico oficial. Esta acción no se puede deshacer."
        confirmLabel="Eliminar definitivamente"
        cancelLabel="Cancelar"
      />
    </div>
  );
};
