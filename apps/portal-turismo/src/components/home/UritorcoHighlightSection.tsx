import React from 'react';
import { Link } from 'react-router-dom';

export const UritorcoHighlightSection: React.FC = () => {
  return (
    <section className="w-full bg-[#0e261d] text-white overflow-hidden relative">
      {/* Fotografía Panorámica */}
      <div className="w-full relative h-[500px] sm:h-[620px] lg:h-[720px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=2400&q=85"
          alt="Cerro Uritorco y las Sierras Chicas al atardecer"
          className="w-full h-full object-cover object-center brightness-95 contrast-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e261d] via-black/20 to-black/60" />
      </div>

      {/* Panel de Información */}
      <div className="w-full bg-[#0e261d] -mt-16 sm:-mt-28 relative z-10 rounded-t-[32px] sm:rounded-t-[48px] border-t border-white/10 pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
          <div className="max-w-4xl space-y-4">
            <h2 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-[1.05]">
              Cerro Uritorco
            </h2>
            <p className="text-base sm:text-xl text-sand-100/90 leading-relaxed font-normal max-w-3xl">
              El pico más alto de las Sierras Chicas y el símbolo indiscutido de Capilla del Monte. Se sube desde el Camino al Cerro, temprano a la mañana, y desde la cumbre se ve todo el Valle de Punilla, Los Gigantes y las Salinas Grandes.
            </p>
          </div>

          <div className="border-t border-white/15 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sand-300">Altura</span>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">1.979 m s. n. m.</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sand-300">Ascenso</span>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">5 a 7 h ida y vuelta</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-primary-400">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[11px] font-bold tracking-widest uppercase text-sand-300">Acceso</span>
              </div>
              <p className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">Camino al Cerro, 4 km</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              to="/atractivos/uritorco"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold text-xs tracking-wide transition-colors shadow-xl shadow-primary-500/25 cursor-pointer"
            >
              <span>Descubrir destino</span>
              <span>→</span>
            </Link>
            <Link
              to="/alojamientos?zone=la-toma"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-bold text-xs tracking-wide transition-colors border border-white/20 text-center cursor-pointer"
            >
              Dormir cerca del cerro
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
