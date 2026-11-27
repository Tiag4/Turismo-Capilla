import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Car, Train, Navigation, ShieldCheck } from 'lucide-react';

export const MobilityHeader: React.FC = () => {
  return (
    <header className="space-y-6">
      <nav aria-label="Navegación secundaria">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors bg-white/80 px-3 py-1.5 rounded-full border border-sand-200 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </Link>
      </nav>

      <div className="space-y-3 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-uritorco-100 text-uritorco-800 border border-uritorco-200">
          <Navigation className="w-3.5 h-3.5 text-uritorco-600" />
          <span>Conectividad & Accesos Oficiales al Valle de Punilla</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-sand-900 tracking-tight leading-tight">
          Cómo Llegar a <span className="text-terracotta-600">Capilla del Monte</span>
        </h1>

        <p className="text-base sm:text-lg text-sand-700 leading-relaxed font-normal">
          Guía integral de movilidad para planificar tu viaje a los pies del Cerro Uritorco. Consultá las mejores rutas terrestres desde todo el país, valores y métodos de pago de peajes vigentes, y el servicio histórico del Tren de las Sierras.
        </p>
      </div>

      {/* Badges de Información Inmediata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-50 flex items-center justify-center text-terracotta-600 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Distancia de Córdoba</span>
            <span className="text-sm font-bold text-sand-900 font-display">105 km · ~1h 40m</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-uritorco-50 flex items-center justify-center text-uritorco-600 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Corredor Principal</span>
            <span className="text-sm font-bold text-sand-900 font-display">Ruta Nacional 38</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Tren de las Sierras</span>
            <span className="text-sm font-bold text-sand-900 font-display">Estación Centro</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-sand-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs text-sand-500 font-medium">Peaje Habilitado</span>
            <span className="text-sm font-bold text-sand-900 font-display">TelePASE & Efectivo</span>
          </div>
        </div>
      </div>
    </header>
  );
};
