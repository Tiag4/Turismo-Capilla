import React from 'react';
import { Link } from 'react-router-dom';

export const AstrotourismTeaserSection: React.FC = () => {
  return (
    <section id="astroturismo" className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="relative rounded-3xl overflow-hidden bg-sand-900 text-white min-h-[380px] sm:min-h-[440px] flex flex-col justify-end p-8 sm:p-14 border border-sand-800 shadow-xl group">
          {/* Imagen Panorámica Nocturna */}
          <img
            src="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1800&q=85"
            alt="Bóveda celeste estrellada sobre las sierras de Capilla del Monte"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-90 contrast-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-primary-300">
              <span>Cielos Bortle 3</span>
              <span className="text-sand-500">•</span>
              <span>Vía Láctea a simple vista</span>
              <span className="text-sand-500">•</span>
              <span>3 miradores certificados</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              La Noche del Uritorco & Astroturismo
            </h2>

            <p className="text-sm sm:text-base text-sand-200 leading-relaxed font-normal">
              Capilla del Monte alberga uno de los firmamentos más limpios y magnéticos del continente. Descubrí cómo se transforma la bóveda celeste a lo largo de la noche, cuándo asoma el centro galáctico y cuáles son los miradores oficiales de astrofotografía.
            </p>

            <div className="pt-2">
              <Link
                to="/astroturismo"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-bold text-xs tracking-wide transition-colors shadow-lg shadow-primary-500/25 cursor-pointer group/cta"
              >
                <span>Abrir Simulador y Guía de Astroturismo</span>
                <span className="group-hover/cta:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
