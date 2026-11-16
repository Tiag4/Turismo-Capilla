import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass, Sparkles, Utensils, Mountain } from 'lucide-react';

export const CircuitsHeader: React.FC = () => {
  return (
    <header className="space-y-6">
      <nav aria-label="Navegación secundaria">
        <Link
          to="/atractivos"
          className="inline-flex items-center gap-2 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors bg-white/80 px-3 py-1.5 rounded-full border border-sand-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Senderos & Paseos</span>
        </Link>
      </nav>

      <div className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-uritorco-100 text-uritorco-800 border border-uritorco-200">
          <Compass className="w-3.5 h-3.5 text-uritorco-600" />
          <span>Experiencias Temáticas Oficiales de Capilla del Monte</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-sand-900 tracking-tight leading-tight">
          Circuitos <span className="text-terracotta-600">Temáticos</span>
        </h1>

        <p className="text-base sm:text-lg text-sand-700 leading-relaxed font-normal">
          Descubrí Capilla del Monte más allá de las caminatas tradicionales. Recorré tres propuestas diferenciadas: vivencias espirituales en vórtices energéticos, sabores serranos de identidad criolla y europea, y aventuras activas en la roca y el cielo.
        </p>
      </div>

      {/* Badges de los 3 Circuitos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Circuito Místico</span>
            <span className="text-sm font-bold text-sand-900 font-display">Vórtices & Energía</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Sabores Turísticos</span>
            <span className="text-sm font-bold text-sand-900 font-display">Gastronomía Serrana</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-uritorco-50 flex items-center justify-center text-uritorco-700 shrink-0">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Turismo Alternativo</span>
            <span className="text-sm font-bold text-sand-900 font-display">Aventura & Aire Libre</span>
          </div>
        </div>
      </div>
    </header>
  );
};
