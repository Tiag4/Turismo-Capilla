import React from 'react';
import { CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { TollDetail } from './types/mobility.types';

interface TollAlertCardProps {
  tolls: TollDetail[];
  precautions?: string;
}

export const TollAlertCard: React.FC<TollAlertCardProps> = ({ tolls, precautions }) => {
  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
          <CreditCard className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-950 font-display">
            Información de Peajes & Métodos de Pago
          </h4>
          <span className="text-xs text-amber-800">Tarifas estimadas vigentes para vehículos particulares (Categoría 2)</span>
        </div>
      </div>

      {tolls.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-amber-900 bg-white/70 p-3 rounded-xl border border-amber-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Este trazado no cuenta con cabinas de peaje en su tramo principal hacia Capilla del Monte.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {tolls.map((toll, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-xs space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-sm font-bold text-sand-900">{toll.name}</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-terracotta-100 text-terracotta-800 self-start sm:self-auto">
                  {toll.estimatedFee} aprox.
                </span>
              </div>
              <div className="text-xs text-sand-600 space-y-1">
                <p><span className="font-semibold text-sand-800">Concesión:</span> {toll.operator} ({toll.road})</p>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="font-semibold text-sand-800">Medios aceptados:</span>
                  {toll.paymentMethods.map((method, mIdx) => (
                    <span key={mIdx} className="px-2 py-0.5 rounded-md bg-sand-100 text-sand-700 text-[11px] font-medium">
                      {method}
                    </span>
                  ))}
                </div>
                {toll.notes && <p className="text-sand-500 italic pt-0.5">{toll.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {precautions && (
        <div className="flex items-start gap-2.5 text-xs text-amber-900 bg-amber-100/60 p-3 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Consejo de tránsito en temporada alta: </span>
            <span>{precautions}</span>
          </div>
        </div>
      )}
    </div>
  );
};
