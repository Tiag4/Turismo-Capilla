import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, Phone, AlertTriangle, MapPin } from 'lucide-react';
import { EMERGENCY_CONTACTS } from '../components/emergencies/data/emergenciesData';
import { EmergencyProtocolAccordion } from '../components/emergencies/EmergencyProtocolAccordion';

export const EmergencyPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-sand-50/60 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Navegación secundaria">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors bg-white/80 px-3 py-1.5 rounded-full border border-sand-200 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Inicio</span>
            </Link>
          </nav>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Central Oficial de Seguridad & Auxilio · Valle de Punilla</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-sand-900 tracking-tight">
              Ficha de Emergencias & <span className="text-red-600">Números Útiles</span>
            </h1>

            <p className="text-base text-sand-700 leading-relaxed font-normal max-w-3xl">
              Información de auxilio directo disponible offline para turistas y senderistas en Capilla del Monte. Hacé clic en cualquier número para discar inmediatamente desde tu teléfono.
            </p>
          </div>
        </header>

        {/* Directorio Telefónico */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-sand-900 font-display flex items-center gap-2">
            <Phone className="w-5 h-5 text-red-600" />
            <span>Teléfonos de Urgencia & Rescate Directo</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMERGENCY_CONTACTS.map((c) => (
              <div
                key={c.id}
                className="bg-white p-5 rounded-3xl border border-sand-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-red-100 text-red-800">
                      {c.badge}
                    </span>
                    <span className="text-sm font-black text-red-600 font-display">
                      Discado: {c.shortNumber}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-sand-900 leading-tight">
                    {c.name}
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed">
                    {c.description}
                  </p>
                  {c.address && (
                    <p className="text-xs text-sand-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                      <span>{c.address}</span>
                    </p>
                  )}
                </div>

                <a
                  href={`tel:${c.fullPhone}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Llamar al {c.shortNumber} ({c.fullPhone})</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Protocolos de Seguridad */}
        <section className="space-y-4 pt-4 border-t border-sand-200">
          <h2 className="text-lg font-bold text-sand-900 font-display flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Protocolos de Seguridad en Senderos y Ríos</span>
          </h2>
          <EmergencyProtocolAccordion />
        </section>
      </div>
    </div>
  );
};
