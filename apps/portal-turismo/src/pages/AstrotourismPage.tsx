import React from 'react';
import { Link } from 'react-router-dom';
import { AstrotourismContainer } from '../components/astrotourism/AstrotourismContainer';

export const AstrotourismPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-16 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Encabezado Editorial */}
        <div className="max-w-3xl space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span>← Volver al Inicio</span>
          </Link>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-sand-900 tracking-tight leading-tight">
            La Noche del Uritorco & Astroturismo
          </h1>

          <p className="text-base sm:text-lg text-sand-700 leading-relaxed font-normal">
            Capilla del Monte cuenta con certificación de cielos limpios clase Bortle 3. Este simulador te permite explorar cómo gira la bóveda celeste sobre la cumbre (1.979 msnm), cuándo asoma el centro de la Vía Láctea y cuáles son los miradores oficiales de astrofotografía.
          </p>
        </div>

        {/* Simulador Interactivo Completo */}
        <AstrotourismContainer />
      </div>
    </div>
  );
};
