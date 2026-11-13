import React from 'react';
import { ArrowRight, Phone, Star } from 'lucide-react';
import { GASTRONOMIC_VENUES } from './data/circuitsData';

export const GastronomicCircuitView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Cabecera Editorial Limpia */}
      <div className="bg-sand-100/70 rounded-2xl border border-sand-200 p-6 sm:p-8 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 block">
          Ruta Gastronómica Oficial · Valle de Punilla
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-sand-950">
          Sabores Turísticos de las Sierras
        </h3>
        <p className="text-sand-600 text-sm sm:text-base leading-relaxed max-w-3xl">
          La cocina de Capilla del Monte fusiona la tradición criolla con la herencia repostera y de chacinados centroeuropeos. Disfrutá de truchas de montaña, cabrito a la llama con leña serrana, hierbas silvestres y cervezas artesanales con agua pura de vertiente.
        </p>
      </div>

      {/* Grilla con Estética de Catálogo de Senderos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
        {GASTRONOMIC_VENUES.map((venue) => (
          <article
            key={venue.id}
            id={venue.id}
            className="group flex flex-col bg-white rounded-2xl border border-sand-200/90 overflow-hidden shadow-xs hover:border-sand-400 hover:shadow-md transition-all duration-200"
          >
            {/* Portada Fotográfica */}
            <div className="relative aspect-16/10 overflow-hidden bg-sand-200">
              <img
                src={venue.image}
                alt={venue.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2.5 right-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  Abierto hoy
                </span>
              </div>
            </div>

            {/* Ficha Editorial */}
            <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-sand-800 uppercase tracking-wider text-[11px]">
                    {venue.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-sand-900">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>4.8</span>
                    <span className="text-sand-400 font-normal">(85)</span>
                  </div>
                </div>

                <h4 className="font-display font-black text-xl text-sand-950 leading-snug group-hover:text-terracotta-600 transition-colors">
                  {venue.name}
                </h4>

                <p className="text-terracotta-700 text-sm font-semibold line-clamp-1">
                  Especialidad: {venue.specialty}
                </p>

                <p className="text-sand-600 text-sm line-clamp-3 leading-relaxed">
                  {venue.description}
                </p>
              </div>

              {/* Características del Local */}
              <div className="pt-3 border-t border-sand-100 space-y-1.5 text-xs text-sand-700">
                {venue.features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-terracotta-600 font-black">•</span>
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Telemetría: Horarios y Dirección */}
              <div className="pt-3 border-t border-sand-100 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-sand-500 block text-[10px] font-bold uppercase tracking-wider">
                    Ubicación
                  </span>
                  <span className="font-black text-sand-900 text-xs line-clamp-1">
                    {venue.address}
                  </span>
                </div>
                <div>
                  <span className="text-sand-500 block text-[10px] font-bold uppercase tracking-wider">
                    Horario
                  </span>
                  <span className="font-black text-sand-900 text-xs line-clamp-1">
                    {venue.hours}
                  </span>
                </div>
              </div>

              {/* Acciones: Llamar y Mapa */}
              <div className="pt-1 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${venue.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-sand-100 text-sand-900 hover:bg-sand-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-uritorco-600" />
                  <span>Llamar</span>
                </a>
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
        ))}
      </div>
    </div>
  );
};
