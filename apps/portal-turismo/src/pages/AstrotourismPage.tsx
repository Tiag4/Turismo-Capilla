import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AstrotourismContainer } from '../components/astrotourism/AstrotourismContainer';

export const AstrotourismPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-sand-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Navegación secundaria">
            <Link
              to="/"
              className="inline-flex items-center gap-2 min-h-[44px] text-xs font-bold text-terracotta-700 hover:text-terracotta-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-700 rounded-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Volver al Inicio</span>
            </Link>
          </nav>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-sand-900 tracking-tight leading-tight">
              Astroturismo en <span className="text-terracotta-600">Capilla del Monte</span>
            </h1>

            <p className="text-base sm:text-lg text-sand-700 leading-relaxed font-normal max-w-[65ch]">
              Por su altitud y baja contaminación lumínica, las sierras que rodean al Cerro Uritorco ofrecen cielos rurales limpios para ver la Vía Láctea y constelaciones australes a simple vista. Conocé qué cambia en cada hora de la noche, dónde observar y cómo prepararte.
            </p>
          </div>
        </header>

        <AstrotourismContainer />
      </div>
    </div>
  );
};
