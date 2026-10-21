import React, { useState } from 'react';
import { Calendar, MapPin, ArrowLeft, Save } from 'lucide-react';
import type { CulturalEvent, CreateCulturalEventDTO, EventCategory } from '../../types/culturalEvent.types';
import { EventFlyerDropzone } from './EventFlyerDropzone';

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

export interface EventEditorFormProps {
  initialData?: CulturalEvent | null;
  onSubmit: (dto: CreateCulturalEventDTO) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const EventEditorForm: React.FC<EventEditorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState<EventCategory>(initialData?.category ?? 'FESTIVAL');
  const [startDate, setStartDate] = useState(
    initialData?.startDate ?? new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(initialData?.endDate ?? '');
  const [timeString, setTimeString] = useState(initialData?.timeString ?? '20:00 hs');
  const [location, setLocation] = useState(initialData?.location ?? VENUE_PRESETS[0]);
  const [isFree, setIsFree] = useState(initialData?.isFree ?? true);
  const [price, setPrice] = useState<number | undefined>(initialData?.price);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));

  const handleSubmit = (e: React.FormEvent) => {
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
      imageUrl: imageUrl.trim(),
      isActive,
      isFeatured,
    };

    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header con botón volver */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-emerald-portal-600)] mb-0.5">
              <Calendar className="w-4 h-4" />
              <span>Agenda Cultural Municipal</span>
            </div>
            <h1 className="font-display font-black text-2xl text-[var(--color-sand-900)]">
              {initialData ? 'Editar Evento Cultural' : 'Nuevo Evento Cultural'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-[var(--color-sand-200)] text-xs font-bold text-[var(--color-sand-700)] hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim() || !startDate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white text-xs font-bold tracking-wide shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Guardando...' : 'Guardar Evento'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: 2 columnas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Información General */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Información General
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                Título del Evento *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Festival Alienígena de Capilla del Monte"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                  Categoría del Evento *
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
                  Horario o Convocatoria
                </label>
                <input
                  type="text"
                  value={timeString}
                  onChange={(e) => setTimeString(e.target.value)}
                  placeholder="ej. 20:30 hs o 18:00 a 23:00 hs"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                Descripción Detallada
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles sobre actividades, artistas, recomendaciones para el público, estacionamiento..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)] resize-none"
              />
            </div>
          </section>

          {/* Card: Fechas y Sede */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Fechas y Ubicación
            </h2>

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
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                  Lugar o Sede *
                </label>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[var(--color-sand-400)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="ej. Predio Gabriel Suárez & Calle Techada"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {VENUE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setLocation(preset)}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-[var(--color-sand-100)] text-[var(--color-sand-700)] hover:bg-[var(--color-sand-200)] font-semibold transition-colors cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Card: Flyer Oficial */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Flyer o Fotografía Oficial
            </h2>
            <EventFlyerDropzone
              imageUrl={imageUrl}
              onChange={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl('')}
              disabled={isSubmitting}
            />
          </section>
        </div>

        {/* Columna Lateral: Estado, Entrada y Visibilidad */}
        <div className="space-y-6">
          {/* Card: Aranceles y Acceso */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Entradas y Acceso
            </h2>

            <div className="p-3.5 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Acceso Gratuito
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)]">
                    Entrada libre para turistas y vecinos
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--color-emerald-portal-600)] cursor-pointer"
                />
              </label>

              {!isFree && (
                <div className="pt-2 border-t border-[var(--color-sand-200)]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Costo de la Entrada (ARS)
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
          </section>

          {/* Card: Estado y Publicación */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Publicación en Portal
            </h2>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[var(--color-emerald-portal-600)] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Publicar de Inmediato
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)] leading-tight block mt-0.5">
                    El evento será visible de inmediato en la portada y el calendario oficial.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded text-[var(--color-terracotta-600)] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Evento Destacado
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)] leading-tight block mt-0.5">
                    Prioridad visual en la cinta de eventos de la portada.
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};
