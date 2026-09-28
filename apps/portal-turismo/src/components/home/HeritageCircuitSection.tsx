import React from 'react';
import { Link } from 'react-router-dom';

export const HeritageCircuitSection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-stone-950 text-white overflow-hidden">
      {/* Fotografía Panorámica */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&w=2000&q=85"
          alt="Casona señorial histórica de piedra con arquitectura de época y cantería centenaria"
          className="w-full h-full object-cover object-center brightness-[0.38] contrast-[1.1]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="max-w-3xl space-y-6 gsap-casonas-content">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight drop-shadow-sm">
            Casonas con Historia
          </h2>
          <p className="text-base sm:text-lg text-sand-100 leading-relaxed font-normal">
            A principios del siglo XX, la llegada del ferrocarril convirtió a Capilla del Monte en una distinguida villa de veraneo. Familias notables construyeron residencias señoriales de estilos normando, pintoresquista y Tudor con piedras de las canteras locales.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/20">
            <div>
              <span className="block font-display font-black text-2xl sm:text-3xl text-terracotta-400">14</span>
              <span className="text-xs text-sand-200 font-medium">Residencias catalogadas</span>
            </div>
            <div>
              <span className="block font-display font-black text-2xl sm:text-3xl text-terracotta-400">2.5 km</span>
              <span className="text-xs text-sand-200 font-medium">Circuito peatonal autoguiado</span>
            </div>
            <div>
              <span className="block font-display font-black text-2xl sm:text-3xl text-terracotta-400">1910–1930</span>
              <span className="text-xs text-sand-200 font-medium">Época dorada fundacional</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/atractivos/casonas"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 active:bg-terracotta-700 text-white font-bold text-xs tracking-wide shadow-xl transition-all cursor-pointer"
            >
              Descargar Mapa y Guía del Circuito Patrimonial →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
