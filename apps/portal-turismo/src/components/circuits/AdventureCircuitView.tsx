import React from 'react';
import { ArrowRight, Phone, Star } from 'lucide-react';
import { ADVENTURE_ACTIVITIES } from './data/circuitsData';

export const AdventureCircuitView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Cabecera Editorial Limpia */}
      <div className="bg-sand-100/70 rounded-2xl border border-sand-200 p-6 sm:p-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
          Turismo Activo & Prestadores Habilitados
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-sand-950">
          Aventura Segura en las Sierras de Punilla
        </h3>
        <p className="text-sand-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          Capilla del Monte y sus alrededores ofrecen escenarios naturales inmejorables para el vuelo libre, la escalada en roca y la exploración de cavernas milenarias. Todas las actividades cuentan con guías habilitados y cobertura de turismo activo.
        </p>
      </div>

      {/* Grilla con Estética de Catálogo de Senderos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
        {ADVENTURE_ACTIVITIES.map((act) => {
          const primaryProvider = act.certifiedProviders[0];
          return (
            <article
              key={act.id}
              id={act.id}
              className="group flex flex-col bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-xs hover:border-sand-400 hover:shadow-md transition-all duration-200"
            >
              {/* Portada Fotográfica */}
              <div className="relative aspect-16/10 overflow-hidden bg-sand-200">
                <img
                  src={act.image}
                  alt={act.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2.5 right-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Guías habilitados
                  </span>
                </div>
              </div>

              {/* Ficha Editorial */}
              <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-sand-800 uppercase tracking-wider text-[11px]">
                      {act.modalityLabel} · Dif. {act.difficulty}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-sand-900">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>4.9</span>
                      <span className="text-sand-400 font-normal">(94)</span>
                    </div>
                  </div>

                  <h4 className="font-display font-black text-xl text-sand-950 leading-snug group-hover:text-terracotta-600 transition-colors">
                    {act.title}
                  </h4>

                  <p className="text-terracotta-700 text-sm font-semibold line-clamp-1">
                    Ubicación: {act.location}
                  </p>

                  <p className="text-sand-600 text-sm line-clamp-3 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Equipamiento / Requisitos Clave */}
                <div className="pt-3 border-t border-sand-100 space-y-1.5 text-xs text-sand-700">
                  {act.suggestedGear.slice(0, 2).map((gear, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-terracotta-600 font-black">•</span>
                      <span className="line-clamp-1">{gear}</span>
                    </div>
                  ))}
                </div>

                {/* Telemetría: Duración y Prestador */}
                <div className="pt-3 border-t border-sand-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-sand-500 block text-[10px] font-bold uppercase tracking-wider">
                      Duración
                    </span>
                    <span className="font-black text-sand-900 text-xs line-clamp-1">
                      {act.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-sand-500 block text-[10px] font-bold uppercase tracking-wider">
                      Prestador
                    </span>
                    <span className="font-black text-sand-900 text-xs line-clamp-1">
                      {primaryProvider?.name ?? 'Guía Matriculado'}
                    </span>
                  </div>
                </div>

                {/* Acciones: Contacto y Mapa */}
                <div className="pt-1 grid grid-cols-2 gap-2">
                  {primaryProvider?.contact ? (
                    <a
                      href={`tel:${primaryProvider.contact}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-sand-100 text-sand-900 hover:bg-sand-200 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-uritorco-600" />
                      <span>Contactar</span>
                    </a>
                  ) : (
                    <div />
                  )}
                  <a
                    href="#mapa"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-sand-900 text-white hover:bg-terracotta-600 transition-colors"
                  >
                    <span>Ver mapa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
