import React, { useEffect } from 'react';
import { Phone, X, ShieldAlert, AlertTriangle, MapPin, Clock } from 'lucide-react';
import { EMERGENCY_CONTACTS } from './data/emergenciesData';
import { EmergencyProtocolAccordion } from './EmergencyProtocolAccordion';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    // Bloqueo de scroll en body al abrir modal
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        className="bg-sand-50 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-sand-300 shadow-2xl flex flex-col space-y-6 p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="flex items-start justify-between gap-4 border-b border-sand-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
              <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
              <span>Guardia Activa 24hs · Valle de Punilla</span>
            </div>
            <h3 id="emergency-modal-title" className="font-display font-black text-2xl sm:text-3xl text-sand-900">
              Emergencias & Seguridad Serrana
            </h3>
            <p className="text-xs sm:text-sm text-sand-600">
              Discado directo de auxilio médico, rescate en montaña e incendios forestales en Capilla del Monte.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de emergencias"
            className="p-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-sand-700 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Directorio Telefónico de Discado Rápido */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-sand-700 uppercase tracking-wider">
            Números de Emergencia con Discado Inmediato:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EMERGENCY_CONTACTS.map((c) => (
              <div
                key={c.id}
                className="bg-white p-4 rounded-2xl border border-sand-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800">
                      {c.badge}
                    </span>
                    <span className="text-xs font-black text-red-600 font-display">
                      Discado: {c.shortNumber}
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-sand-900 leading-tight">
                    {c.name}
                  </h5>
                  <p className="text-[11px] text-sand-600 leading-relaxed">
                    {c.description}
                  </p>
                  {c.address && (
                    <p className="text-[10px] text-sand-500 flex items-center gap-1 pt-0.5">
                      <MapPin className="w-3 h-3 text-sand-400 shrink-0" />
                      <span>{c.address}</span>
                    </p>
                  )}
                </div>

                <a
                  href={`tel:${c.fullPhone}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Llamar al {c.shortNumber} ({c.fullPhone})</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Protocolos de Seguridad en Montaña */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-sand-700 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Protocolos de Seguridad en Senderos y Ríos:
          </h4>
          <EmergencyProtocolAccordion />
        </div>

        {/* Pie del Modal */}
        <div className="pt-2 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sand-400" />
            <span>Datos actualizados por Defensa Civil y la Secretaría de Turismo.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-terracotta-600 hover:text-terracotta-700 font-bold underline cursor-pointer"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
};
