import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Ticket, ArrowRight, X, Sparkles } from 'lucide-react';
import { culturalEventsService } from '../../services/culturalEvents.service';
import type { CulturalEvent, EventCategory } from '../../types/culturalEvent.types';

const CATEGORY_LABELS: Record<EventCategory, string> = {
  FESTIVAL: 'Festival',
  THEATER: 'Teatro',
  MUSIC: 'Música en Vivo',
  FAIR: 'Feria & Paseo',
  WORKSHOP: 'Taller & Charla',
  COMMUNITY: 'Comunitario',
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  FESTIVAL: 'bg-amber-100 text-amber-900 border-amber-200',
  THEATER: 'bg-purple-100 text-purple-900 border-purple-200',
  MUSIC: 'bg-rose-100 text-rose-900 border-rose-200',
  FAIR: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  WORKSHOP: 'bg-sky-100 text-sky-900 border-sky-200',
  COMMUNITY: 'bg-stone-100 text-stone-900 border-stone-200',
};

const MONTH_NAMES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
];

interface CulturalAgendaSectionProps {
  eventsOverride?: CulturalEvent[];
}

export const CulturalAgendaSection: React.FC<CulturalAgendaSectionProps> = ({ eventsOverride }) => {
  const events = eventsOverride ?? culturalEventsService.getActiveEvents();
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(null);

  const formatDateParts = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      return {
        day: day || 1,
        month: MONTH_NAMES[(month || 1) - 1] || 'Mes',
        year: year || 2026,
      };
    } catch {
      return { day: 1, month: 'Nov', year: 2026 };
    }
  };

  return (
    <section
      id="section-culturalAgenda"
      data-editable="culturalAgenda"
      className="relative py-20 sm:py-28 bg-[var(--color-sand-50,#FAF8F5)] border-y border-[var(--color-sand-200,#E6E0D4)] overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Encabezado de Sección */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-terracotta-100,#FCECE6)] text-[var(--color-terracotta-600,#C95627)] text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda Cultural y Eventos</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl text-[var(--color-sand-900,#22201E)] tracking-tight">
              Viví la Cultura de Capilla
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-sand-600,#66615B)] leading-relaxed">
              Festivales, peñas, astroturismo y ferias comunitarias durante todo el año. Consultá las próximas actividades organizadas por la Secretaría y prestadores locales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[var(--color-sand-600)] uppercase tracking-wider">
              {events.length} Eventos Programados
            </span>
          </div>
        </div>

        {/* Grilla de Eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {events.map((evt) => {
            const date = formatDateParts(evt.startDate);
            return (
              <article
                key={evt.id}
                className="group flex flex-col bg-white rounded-2xl border border-[var(--color-sand-200)] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Imagen del Evento / Flyer */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Badge de Categoría */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border shadow-xs ${CATEGORY_COLORS[evt.category]}`}>
                      {CATEGORY_LABELS[evt.category]}
                    </span>
                  </div>

                  {/* Badge de Entrada Gratuita o Costo */}
                  <div className="absolute top-3 right-3 z-10">
                    {evt.isFree ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wide bg-emerald-600 text-white shadow-xs">
                        <Sparkles className="w-3 h-3" />
                        Gratuito
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-wide bg-stone-900/90 text-white border border-white/20 shadow-xs">
                        <Ticket className="w-3 h-3 text-[var(--color-terracotta-400)]" />
                        ${(evt.price ?? 0).toLocaleString('es-AR')}
                      </span>
                    )}
                  </div>

                  {/* Fecha Estilo Calendario sobre la foto */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-3">
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-white/95 text-[var(--color-sand-900)] shadow-lg backdrop-blur-xs">
                      <span className="text-[10px] font-black uppercase text-[var(--color-terracotta-600)] leading-none">
                        {date.month}
                      </span>
                      <span className="text-lg font-black leading-tight">
                        {date.day}
                      </span>
                    </div>
                    <div className="text-white text-xs font-semibold flex items-center gap-1.5 drop-shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-white/80" />
                      <span>{evt.timeString}</span>
                    </div>
                  </div>
                </div>

                {/* Contenido */}
                <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--color-sand-500)] font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-terracotta-500)] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-[var(--color-sand-900)] line-clamp-2 group-hover:text-[var(--color-terracotta-600)] transition-colors">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-[var(--color-sand-600)] line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-sand-100)] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedEvent(evt)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-terracotta-600)] hover:text-[var(--color-terracotta-700)] transition-colors cursor-pointer"
                    >
                      <span>Ver detalles completos</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal de Detalle de Evento */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[var(--color-sand-200)] animate-in zoom-in-95 duration-200"
          >
            <div className="relative aspect-[16/9] bg-stone-900">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border shadow-xs ${CATEGORY_COLORS[selectedEvent.category]}`}>
                  {CATEGORY_LABELS[selectedEvent.category]}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-display font-extrabold text-2xl text-[var(--color-sand-900)] leading-tight">
                  {selectedEvent.title}
                </h3>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-[var(--color-sand-600)] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                    <span>{selectedEvent.startDate} ({selectedEvent.timeString})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--color-terracotta-500)]" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--color-sand-100)] border border-[var(--color-sand-200)] flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--color-sand-700)]">Acceso:</span>
                {selectedEvent.isFree ? (
                  <span className="text-xs font-extrabold text-emerald-700 uppercase">
                    Entrada Libre y Gratuita
                  </span>
                ) : (
                  <span className="text-sm font-black text-[var(--color-terracotta-600)]">
                    ${(selectedEvent.price ?? 0).toLocaleString('es-AR')} por persona
                  </span>
                )}
              </div>

              <p className="text-sm text-[var(--color-sand-700)] leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 px-4 rounded-xl bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] text-white text-xs font-bold tracking-wide transition-colors cursor-pointer"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
