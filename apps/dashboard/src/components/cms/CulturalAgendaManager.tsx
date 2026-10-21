import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Search,
  MapPin,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
} from 'lucide-react';
import { culturalEventsService } from '../../services/culturalEvents.service';
import type { CulturalEvent, CreateCulturalEventDTO, EventCategory } from '../../types/culturalEvent.types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

const VENUE_PRESETS = [
  'Predio Gabriel Suárez & Calle Techada',
  'Calle Techada',
  'Cine Teatro Enrique Muiño',
  'Base del Cerro Uritorco',
  'Balneario Municipal Calabalumba',
  'Plaza San Martín',
  'Parque Recreativo Los Terrones',
];

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

export const CulturalAgendaManager: React.FC = () => {
  const [events, setEvents] = useState<CulturalEvent[]>(() => culturalEventsService.getEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    culturalEventsService.fetchEvents().then((fetched) => {
      if (fetched && fetched.length > 0) {
        setEvents(fetched);
      }
    });
  }, []);

  // Modal de Creación / Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CulturalEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('FESTIVAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeString, setTimeString] = useState('20:00 hs');
  const [location, setLocation] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // ConfirmDialog Deletion
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refreshEvents = () => {
    setEvents(culturalEventsService.getEvents());
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setCategory('FESTIVAL');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setTimeString('20:00 hs');
    setLocation('Predio Gabriel Suárez & Calle Techada');
    setIsFree(true);
    setPrice(undefined);
    setImageUrl('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80');
    setIsActive(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: CulturalEvent) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDescription(evt.description);
    setCategory(evt.category);
    setStartDate(evt.startDate);
    setEndDate(evt.endDate || '');
    setTimeString(evt.timeString);
    setLocation(evt.location);
    setIsFree(evt.isFree);
    setPrice(evt.price);
    setImageUrl(evt.imageUrl);
    setIsActive(evt.isActive);
    setIsFeatured(Boolean(evt.isFeatured));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const dto: CreateCulturalEventDTO = {
      title: title.trim(),
      description: description.trim(),
      category,
      startDate,
      endDate: endDate || undefined,
      timeString: timeString.trim(),
      location: location.trim(),
      isFree,
      price: isFree ? undefined : Number(price) || 0,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
      isActive,
      isFeatured,
    };

    if (editingEvent) {
      await culturalEventsService.updateEvent(editingEvent.id, dto);
    } else {
      await culturalEventsService.createEvent(dto);
    }

    setIsModalOpen(false);
    refreshEvents();
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

  // Filtrado
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || evt.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  const activeCount = events.filter((e) => e.isActive).length;
  const freeCount = events.filter((e) => e.isFree).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-sand-200)]">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-emerald-portal-600)] mb-1">
            <Calendar className="w-4 h-4" />
            <span>Gestión Municipal — Agenda Cultural (#76)</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[var(--color-sand-900)]">
            Eventos y Actividades
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-600)]">
            Administrá los eventos públicos que se exhiben en la portada y la agenda turística oficial de Capilla del Monte.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Evento Cultural</span>
        </button>
      </div>

      {/* 2. Metricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-2xs">
          <span className="text-xs font-bold text-[var(--color-sand-500)] uppercase tracking-wider">
            Total Programados
          </span>
          <p className="text-2xl font-black text-[var(--color-sand-900)] mt-1 font-['Outfit']">
            {events.length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-2xs">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Publicados en Portada
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1 font-['Outfit']">
            {activeCount}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-2xs">
          <span className="text-xs font-bold text-[var(--color-terracotta-600)] uppercase tracking-wider">
            Entrada Gratuita
          </span>
          <p className="text-2xl font-black text-[var(--color-terracotta-600)] mt-1 font-['Outfit']">
            {freeCount}
          </p>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--color-sand-400)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título o lugar..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'ALL'
                ? 'bg-[var(--color-sand-900)] text-white'
                : 'text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)]'
            }`}
          >
            Todos ({events.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => (
            <button
              key={catKey}
              type="button"
              onClick={() => setFilterCategory(catKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === catKey
                  ? 'bg-[var(--color-emerald-portal-600)] text-white'
                  : 'text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)]'
              }`}
            >
              {catLabel}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Lista de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className={`flex flex-col bg-white rounded-2xl border transition-all overflow-hidden shadow-2xs ${
              evt.isActive
                ? 'border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)]'
                : 'border-dashed border-[var(--color-sand-300)] opacity-65 bg-[var(--color-sand-50)]'
            }`}
          >
            {/* Imagen & Badges */}
            <div className="relative aspect-[16/9] bg-stone-900 overflow-hidden">
              <img
                src={evt.imageUrl}
                alt={evt.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide border shadow-2xs ${CATEGORY_COLORS[evt.category]}`}>
                  {CATEGORY_LABELS[evt.category]}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                {evt.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    Publicado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-700 text-white shadow-xs">
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
                    onClick={() => handleOpenEdit(evt)}
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

      {/* 5. Modal Crear / Editar */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-sand-200)] animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[var(--color-sand-200)] flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-display font-extrabold text-xl text-[var(--color-sand-900)]">
                {editingEvent ? 'Editar Evento Cultural' : 'Nuevo Evento Cultural'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                  Título del Evento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. 12° Festival Alienígena"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)] cursor-pointer"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Horario Habitual
                  </label>
                  <input
                    type="text"
                    value={timeString}
                    onChange={(e) => setTimeString(e.target.value)}
                    placeholder="ej. 20:30 hs"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Fecha de Fin (Opcional)
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                  Sede / Ubicación *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Cine Teatro Enrique Muiño"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {VENUE_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLocation(preset)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--color-sand-100)] text-[var(--color-sand-700)] hover:bg-[var(--color-sand-200)] transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--color-sand-900)]">Acceso Gratuito</span>
                    <p className="text-[11px] text-[var(--color-sand-600)]">¿El evento es libre y sin costo?</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-emerald-portal-600)] cursor-pointer"
                  />
                </div>

                {!isFree && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                      Precio de Entrada (ARS)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={price ?? ''}
                      onChange={(e) => setPrice(Number(e.target.value) || undefined)}
                      placeholder="ej. 5000"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-white text-[var(--color-sand-900)] focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                  URL del Flyer / Fotografía
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                  Descripción Detallada
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles sobre las actividades, artistas, recomendaciones para el público..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--color-emerald-portal-600)]"
                  />
                  <span className="text-xs font-bold text-[var(--color-sand-900)]">
                    Publicar de inmediato en el portal
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--color-sand-200)] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--color-sand-200)] text-xs font-bold text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
