import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Compass,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { StatCard } from '../ui/StatCard.tsx';
import { AttractionModal } from './AttractionModal.tsx';
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-terracotta-50 text-terracotta-600">
              <Compass className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-sand-900 tracking-tight">
                Gestión de Paseos, Senderos y Destacados
              </h1>
              <p className="text-sm text-sand-500">
                Controlá la oferta oficial de atractivos, el estado meteorológico operativo y los paseos destacados del portal.
              </p>
            </div>
          </div>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard
          label="Total Catálogo"
          value={stats.total}
          helperText="Paseos registrados"
          icon={Compass}
          iconColor="text-sand-600"
        />
        <StatCard
          label="Abiertos"
          value={stats.open}
          helperText="Senderos habilitados"
          icon={CheckCircle2}
          iconColor="text-emerald-600"
        />
        <StatCard
          label="Precaución"
          value={stats.restricted}
          helperText="Alerta meteorológica"
          icon={AlertTriangle}
          iconColor="text-amber-500"
        />
        <StatCard
          label="Clausurados"
          value={stats.closed}
          helperText="Acceso inhabilitado"
          icon={XCircle}
          iconColor="text-rose-500"
        />
        <StatCard
          label="Destacados"
          value={stats.featured}
          helperText="Portada del portal"
          icon={Star}
          iconColor="text-amber-500"
        />
      </div>

      {/* Filtros y Buscador */}
      <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre de atractivo, palabras clave o paisaje..."
              className="w-full pl-10 pr-4 py-2.5 bg-sand-50/80 border border-sand-200 rounded-xl text-sm text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold uppercase tracking-wider text-sand-400 mr-1 shrink-0">
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
                    : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Píldoras de Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sand-400 mr-1 shrink-0">
            Categoría:
          </span>
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-terracotta-600 text-white'
                : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
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
                  : 'bg-sand-100 text-sand-600 hover:bg-sand-200'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Atractivos */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-sand-200">
          <div className="w-8 h-8 border-3 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-sand-600">Cargando catálogo de atractivos...</p>
        </div>
      ) : filteredAttractions.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-sand-200 space-y-3">
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
          {filteredAttractions.map((item) => {
            const currentStatus = item.status || 'OPEN';
            const coverImg =
              item.images && item.images.length > 0
                ? item.images[0].url
                : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Foto de Portada y Badges Superiores */}
                  <div className="relative aspect-16/9 bg-sand-200 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Botón Destacado */}
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item)}
                      title={item.isFeatured ? 'Quitar de destacados' : 'Destacar en portada'}
                      className={`absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 backdrop-blur-xs transition-colors cursor-pointer ${
                        item.isFeatured
                          ? 'bg-amber-400 text-sand-950 shadow-sm'
                          : 'bg-black/40 text-sand-300 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${item.isFeatured ? 'fill-sand-950' : ''}`} />
                      <span>{item.isFeatured ? 'Destacado' : 'Destacar'}</span>
                    </button>

                    {/* Badge Categoría */}
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      {CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </div>

                  {/* Cuerpo */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-display font-black text-lg text-sand-950 leading-snug">
                        {item.name}
                      </h3>
                      {item.difficulty && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-sand-100 text-sand-700 shrink-0">
                          {item.difficulty}
                        </span>
                      )}
                    </div>

                    <p className="text-sand-600 text-xs line-clamp-2 leading-relaxed">
                      {item.description || 'Sin descripción detallada.'}
                    </p>

                    {/* Selector de Estado Operativo Rápido */}
                    <div className="pt-2 border-t border-sand-100">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-sand-500 mb-1">
                        Disponibilidad Operativa
                      </label>
                      <select
                        value={currentStatus}
                        onChange={(e) => handleQuickStatusChange(item, e.target.value as AttractionStatus)}
                        className={`w-full text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer focus:outline-none ${
                          currentStatus === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-400'
                            : currentStatus === 'WEATHER_RESTRICTED'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 focus:ring-amber-400'
                            : 'bg-rose-50 text-rose-800 border-rose-200 focus:ring-rose-400'
                        }`}
                      >
                        <option value="OPEN">🟢 Abierto y Habilitado</option>
                        <option value="WEATHER_RESTRICTED">🟡 Con Precaución Meteorológica</option>
                        <option value="CLOSED">🔴 Clausurado Temporalmente</option>
                      </select>
                    </div>

                    {/* Noticia de Alerta si está restringido */}
                    {item.statusNotice && currentStatus !== 'OPEN' && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-tight flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{item.statusNotice}</span>
                      </div>
                    )}

                    {/* Metadatos Rápidos */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-sand-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                        <span className="truncate">{item.estimatedDuration || 'Libre'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                        <span>
                          {item.admissionFee && item.admissionFee > 0
                            ? `$${item.admissionFee.toLocaleString('es-AR')}`
                            : 'Gratis'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer de Acciones */}
                <div className="px-5 py-3 bg-sand-50/70 border-t border-sand-200/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-sand-500 font-medium">
                    {item.requiresGuide ? 'Requiere guía' : 'Autoguiado'}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingAttraction(item);
                        setIsModalOpen(true);
                      }}
                      className="gap-1 px-2.5 py-1 text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </Button>
                    <button
                      type="button"
                      onClick={() => setDeletingAttraction(item)}
                      className="p-1.5 text-sand-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar atractivo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
