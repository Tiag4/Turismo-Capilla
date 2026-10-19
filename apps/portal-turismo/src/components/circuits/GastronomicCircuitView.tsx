import React from 'react';
import { Utensils, Phone, Clock, MapPin, Award, CheckCircle } from 'lucide-react';
import { GASTRONOMIC_VENUES } from './data/circuitsData';

export const GastronomicCircuitView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Banner de Sabores Serranos */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-sand-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
          <Utensils className="w-3.5 h-3.5" />
          <span>Ruta Gastronómica Oficial</span>
        </div>

        <h3 className="font-display font-black text-xl sm:text-3xl text-white">
          Sabores Turísticos de las Sierras
        </h3>

        <p className="text-sm text-sand-200 leading-relaxed max-w-3xl font-light">
          La cocina de Capilla del Monte fusiona la herencia criolla con la tradición repostera y de chacinados de inmigrantes europeos. Disfrutá de truchas frescas de aguas de deshielo, el auténtico cabrito a la llama, hierbas aromáticas silvestres y cervezas artesanales con agua pura de montaña.
        </p>

        <div className="flex flex-wrap gap-2 pt-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Chacinados & Salames</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Té & Repostería Centroeuropea</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Trucha de Criadero</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Cabrito a la Llama</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Miel & Apicultura Orgánica</span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/10">Cervecerías Artesanales</span>
        </div>
      </div>

      {/* Directorio de Locales Adheridos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GASTRONOMIC_VENUES.map((venue) => (
          <div
            key={venue.id}
            className="bg-white rounded-3xl p-6 border border-sand-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {venue.categoryLabel}
                </span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>

              <h4 className="font-display font-bold text-lg sm:text-xl text-sand-900 leading-tight">
                {venue.name}
              </h4>

              {/* Especialidad de la casa */}
              <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase text-amber-900 tracking-wider block">
                  Especialidad de la casa:
                </span>
                <p className="text-xs font-medium text-amber-950">
                  {venue.specialty}
                </p>
              </div>

              <p className="text-xs text-sand-600 leading-relaxed">
                {venue.description}
              </p>

              {/* Atributos / Servicios */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {venue.features.map((feat, fIdx) => (
                  <span key={fIdx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 text-[11px]">
                    <CheckCircle className="w-3 h-3 text-uritorco-600" />
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Datos de contacto y ubicación */}
            <div className="pt-4 border-t border-sand-200 space-y-2 text-xs text-sand-700">
              <div className="flex items-center gap-2 text-sand-800">
                <MapPin className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
                <span className="truncate">{venue.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sand-800">
                <Phone className="w-3.5 h-3.5 text-uritorco-600 shrink-0" />
                <a href={`tel:${venue.phone}`} className="hover:text-terracotta-600 font-semibold transition-colors">
                  {venue.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sand-500 text-[11px]">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{venue.hours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
