import React from 'react';
import { HeroSearchBar } from '../search/HeroSearchBar';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between bg-sand-900 text-white z-30">
      {/* Imagen de Fondo Panorámica del Cerro Uritorco */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85"
          alt="Sierras de Capilla del Monte y Cerro Uritorco al atardecer"
          className="w-full h-full object-cover object-center brightness-[0.65] contrast-[1.05]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sand-900 via-sand-900/30 to-black/50" />
      </div>

      {/* Contenido Superior: Identidad Editorial */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 w-full">
        <div className="max-w-3xl space-y-5">
          <h1 className="hero-anim font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-[-0.03em] leading-[1.02]">
            El valle del Uritorco, directo y sin intermediarios.
          </h1>
          <p className="hero-anim text-base sm:text-xl text-sand-100/90 font-normal max-w-2xl leading-relaxed">
            Paseos de montaña, geología milenaria y reservas seguras con prestadores habilitados oficialmente por la Secretaría de Turismo.
          </p>
        </div>
      </div>

      {/* Buscador Integrado Horizontal (CRO) anclado al pie del Hero */}
      <div className="relative z-40 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 pb-14 w-full mt-10">
        <div className="hero-anim">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
};
