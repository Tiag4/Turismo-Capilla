import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { InstitutionalTeamContainer } from '../components/institutional/InstitutionalTeamContainer';

export const InstitutionalTeamPage: React.FC = () => {
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
              Desarrollado por <span className="text-terracotta-600">estudiantes de la UPC</span>
            </h1>

            <p className="text-base sm:text-lg text-sand-700 leading-relaxed font-normal max-w-[65ch]">
              Plataforma desarrollada en el marco de la práctica profesional de diversas cátedras de la Universidad Provincial de Córdoba (Sede Capilla del Monte), en articulación con la Cámara de Turismo de Capilla del Monte.
            </p>
          </div>
        </header>

        <InstitutionalTeamContainer />
      </div>
    </div>
  );
};
