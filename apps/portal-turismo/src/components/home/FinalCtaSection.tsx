import React from 'react';
import { Link } from 'react-router-dom';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="w-full relative min-h-[480px] sm:min-h-[560px] flex items-center justify-center bg-sand-950 text-white overflow-hidden py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
      {/* Fotografía Panorámica */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85"
        alt="Paisaje serrano de Capilla del Monte al anochecer"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.38] contrast-[1.15]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/40" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-5 text-center">
        <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.08] drop-shadow-sm">
          ¿Listo para descubrir Capilla del Monte?
        </h2>
        <p className="text-lg sm:text-2xl text-sand-100/90 font-normal max-w-2xl mx-auto leading-relaxed">
          Encontrá tu próximo lugar favorito y empezá a planificar tu visita.
        </p>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/alojamientos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold text-base tracking-wide transition-colors shadow-xl shadow-primary-500/30 cursor-pointer"
          >
            <span>Explorar ahora</span>
            <span>→</span>
          </Link>
          <a
            href="/#mapa-valle"
            className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-bold text-base tracking-wide transition-colors border border-white/30 text-center cursor-pointer"
          >
            Ver el mapa
          </a>
        </div>
      </div>
    </section>
  );
};
