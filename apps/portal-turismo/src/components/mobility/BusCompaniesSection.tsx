import React from 'react';
import { Bus, Phone, MapPin, Clock } from 'lucide-react';
import type { BusTerminalConfig } from './types/mobility.types';

export interface BusCompaniesSectionProps {
  busTerminal?: BusTerminalConfig;
}

export const BusCompaniesSection: React.FC<BusCompaniesSectionProps> = ({ busTerminal }) => {
  const terminalAddress = busTerminal?.terminalAddress || 'Diagonal Buenos Aires s/n (a 3 cuadras de la Calle Techada)';
  const terminalPhone = busTerminal?.terminalPhone || '+54 3548 481123';
  const frequencyNote = busTerminal?.frequencyNote || 'Salidas cada 35-45 minutos';
  const interurbanTitle = busTerminal?.interurbanTitle || 'Interurbanos (Córdoba - Punilla - Capilla)';
  const interurbanDescription = busTerminal?.interurbanDescription || 'Parten desde la Nueva Terminal de Córdoba (T2) y realizan paradas sobre el corredor de Ruta 38 y Aeropuerto.';
  const interurbanPaymentNote = busTerminal?.interurbanPaymentNote || 'Abono mediante tarjeta TIN / Efectivo / Boleterías oficiales en Terminales.';
  const interurbanCompanies = busTerminal?.interurbanCompanies && busTerminal.interurbanCompanies.length > 0
    ? busTerminal.interurbanCompanies
    : ['Empresa Sarmiento', 'Lumasa', 'Ersa Interurbanos', 'FonoBus'];
  const longDistanceTitle = busTerminal?.longDistanceTitle || 'Empresas Nacionales con servicio directo:';
  const longDistanceCompanies = busTerminal?.longDistanceCompanies && busTerminal.longDistanceCompanies.length > 0
    ? busTerminal.longDistanceCompanies
    : ['Chevallier', 'Gral. Urquiza', 'Sierras Cordobesas', 'El Práctico'];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-4">
        <div>
          <h3 className="font-display font-bold text-xl text-sand-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-terracotta-600" />
            <span>Colectivos Interurbanos & Larga Distancia</span>
          </h3>
          <p className="text-xs sm:text-sm text-sand-600">
            Frecuencias diarias directas hacia y desde la Terminal de Capilla del Monte.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-sand-600 bg-sand-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Clock className="w-4 h-4 text-terracotta-600" />
          <span>{frequencyNote}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interurbanos desde Córdoba */}
        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200/80 space-y-3">
          <h4 className="text-sm font-bold text-sand-900 font-display">{interurbanTitle}</h4>
          <p className="text-xs text-sand-600 leading-relaxed">
            {interurbanDescription}
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            {interurbanCompanies.map((comp, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-sand-200 font-semibold text-sand-800">
                {comp}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-sand-500">
            {interurbanPaymentNote}
          </p>
        </div>

        {/* Larga Distancia y Terminal Capilla */}
        <div className="bg-sand-50 p-4 rounded-2xl border border-sand-200/80 space-y-3">
          <h4 className="text-sm font-bold text-sand-900 font-display">Terminal de Ómnibus de Capilla del Monte</h4>
          <div className="space-y-1.5 text-xs text-sand-700">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
              <span>{terminalAddress}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-uritorco-600 shrink-0" />
              <span>Informes y Boleterías: {terminalPhone}</span>
            </p>
          </div>
          <div className="pt-1">
            <span className="block text-[11px] font-semibold text-sand-500 uppercase tracking-wider mb-1">
              {longDistanceTitle}
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {longDistanceCompanies.map((comp, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-white text-sand-700 border border-sand-200">
                  {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
