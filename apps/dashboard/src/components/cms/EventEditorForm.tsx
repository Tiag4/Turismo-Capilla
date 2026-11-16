import React, { useState } from 'react';
import { Calendar, ArrowLeft, Save, Check } from 'lucide-react';
import type { CulturalEvent, CreateCulturalEventDTO, EventCategory } from '../../types/culturalEvent.types.ts';
import { useToast } from '../../context/ToastContext.tsx';
import { EventFlyerDropzone } from './EventFlyerDropzone.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import { CustomTimePicker } from '../ui/CustomTimePicker.tsx';

const VENUE_PRESETS = [
  'Predio Gabriel Suárez & Calle Techada',
  'Calle Techada',
  'Cine Teatro Enrique Muiño',
  'Base del Cerro Uritorco',
  'Balneario Municipal Calabalumba',
  'Plaza San Martín',
  'Parque Recreativo Los Terrones',
];

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'THEATER', label: 'Teatro' },
  { value: 'MUSIC', label: 'Música en Vivo' },
  { value: 'FAIR', label: 'Feria & Paseo' },
  { value: 'WORKSHOP', label: 'Taller & Charla' },
  { value: 'COMMUNITY', label: 'Comunitario' },
];

export interface EventEditorFormProps {
  initialData?: CulturalEvent | null;
  onSubmit: (dto: CreateCulturalEventDTO) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface EventFormErrors {
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  price?: string;
}

function parseInitialTime(raw?: string): { isAllDay: boolean; timeValue: string } {
  if (!raw || !raw.trim()) {
    return { isAllDay: false, timeValue: '20:00 hs' };
  }
  const normalized = raw.trim();
  if (/todo el d[ií]a/i.test(normalized)) {
    return { isAllDay: true, timeValue: '20:00 hs' };
  }
  const match = normalized.match(/(\d{1,2}:\d{2})/);
  if (match) {
    const [h, m] = match[1].split(':');
    return { isAllDay: false, timeValue: `${h.padStart(2, '0')}:${m} hs` };
  }
  return { isAllDay: false, timeValue: '20:00 hs' };
}

export const EventEditorForm: React.FC<EventEditorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const { showError } = useToast();
  const initialTime = parseInitialTime(initialData?.timeString);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState<EventCategory>(initialData?.category ?? 'FESTIVAL');
  const [startDate, setStartDate] = useState(
    initialData?.startDate ?? new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(initialData?.endDate ?? '');
  const [isAllDay, setIsAllDay] = useState(initialTime.isAllDay);
  const [timeString, setTimeString] = useState(initialTime.timeValue);
  const [location, setLocation] = useState(initialData?.location ?? VENUE_PRESETS[0]);
  const [isFree, setIsFree] = useState(initialData?.isFree ?? true);
  const [price, setPrice] = useState<number | undefined>(initialData?.price);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [errors, setErrors] = useState<EventFormErrors>({});

  const clearError = (field: keyof EventFormErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const validate = (): boolean => {
    const nextErrors: EventFormErrors = {};
    if (!title.trim()) {
      nextErrors.title = 'El título del evento es obligatorio.';
    }
    if (!startDate) {
      nextErrors.startDate = 'La fecha de inicio es obligatoria.';
    }
    if (endDate && startDate && endDate < startDate) {
      nextErrors.endDate = 'La fecha de fin no puede ser anterior a la de inicio.';
    }
    if (!location.trim()) {
      nextErrors.location = 'El lugar o sede es obligatorio.';
    }
    if (!isFree && (price === undefined || Number.isNaN(price) || price < 0)) {
      nextErrors.price = 'Ingresá un valor de entrada válido (0 o mayor).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      showError('No se pudo guardar el evento. Por favor revisá los campos obligatorios');
      return;
    }

    const formattedTime = isAllDay
      ? 'Todo el día'
      : timeString.includes('hs')
      ? timeString.trim()
      : `${timeString.trim()} hs`;

    const dto: CreateCulturalEventDTO = {
      title: title.trim(),
      description: description.trim(),
      category,
      startDate,
      endDate: endDate || undefined,
      timeString: formattedTime,
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
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="emerald"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialData ? 'Guardar Cambios' : 'Guardar Evento'}</span>
          </Button>
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

            <Input
              label="Título del Evento *"
              required
              value={title}
              error={errors.title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError('title');
              }}
              placeholder="ej. Festival Alienígena de Capilla del Monte"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <Select
                label="Categoría del Evento *"
                value={category}
                onChange={(val) => setCategory(val as EventCategory)}
                options={CATEGORY_OPTIONS}
              />

              <div className="space-y-2">
                <CustomTimePicker
                  label="Horario de Convocatoria"
                  value={isAllDay ? '' : timeString}
                  onChange={(val) => setTimeString(val)}
                  disabled={isAllDay || isSubmitting}
                  helperText={isAllDay ? 'Modalidad continua: Todo el día' : 'Formato 24 hs (ej. 20:30 hs)'}
                />
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="w-4 h-4 rounded border-[var(--color-sand-300)] text-[var(--color-emerald-portal-600)] focus:ring-[var(--color-emerald-portal-600)] cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[var(--color-sand-700)]">
                    Todo el día / Horario continuo
                  </span>
                </label>
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
                placeholder="Describí los detalles del evento, cronograma de actividades, artistas invitados..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)] resize-y"
              />
            </div>
          </section>

          {/* Card: Fechas y Ubicación */}
          <section className="bg-white p-6 rounded-2xl border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h2 className="font-display font-bold text-base text-[var(--color-sand-900)] border-b border-[var(--color-sand-100)] pb-2">
              Fechas y Ubicación
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Fecha de Inicio *"
                type="date"
                required
                value={startDate}
                error={errors.startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearError('startDate');
                }}
              />

              <Input
                label="Fecha de Fin (Opcional)"
                type="date"
                value={endDate}
                error={errors.endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  clearError('endDate');
                }}
              />
            </div>

            <Input
              label="Lugar o Sede *"
              required
              value={location}
              error={errors.location}
              onChange={(e) => {
                setLocation(e.target.value);
                clearError('location');
              }}
              placeholder="ej. Predio Gabriel Suárez & Calle Techada"
            />
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
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Acceso Gratuito
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)]">
                    Entrada libre para turistas y vecinos
                  </span>
                </div>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isFree}
                  onClick={() => setIsFree(!isFree)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                    isFree ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-sand-300 bg-white hover:border-sand-400'
                  }`}
                >
                  {isFree && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>

              {!isFree && (
                <div className="pt-2 border-t border-[var(--color-sand-200)]">
                  <Input
                    label="Costo de la Entrada (ARS)"
                    type="number"
                    min="0"
                    value={price ?? ''}
                    error={errors.price}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPrice(val === '' ? undefined : Number(val));
                      clearError('price');
                    }}
                    placeholder="ej. 5000"
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
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isActive}
                  onClick={() => setIsActive(!isActive)}
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isActive ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-sand-300 bg-white hover:border-sand-400'
                  }`}
                >
                  {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div onClick={() => setIsActive(!isActive)} className="cursor-pointer">
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Publicar de Inmediato
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)] leading-tight block mt-0.5">
                    El evento será visible de inmediato en la portada y el calendario oficial.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)]">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isFeatured}
                  onClick={() => setIsFeatured(!isFeatured)}
                  className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                    isFeatured ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-sand-300 bg-white hover:border-sand-400'
                  }`}
                >
                  {isFeatured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <div onClick={() => setIsFeatured(!isFeatured)} className="cursor-pointer">
                  <span className="text-xs font-bold text-[var(--color-sand-900)] block">
                    Evento Destacado
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)] leading-tight block mt-0.5">
                    Prioridad visual en la cinta de eventos de la portada.
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
};
