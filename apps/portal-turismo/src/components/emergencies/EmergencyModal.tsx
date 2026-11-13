import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Phone, X, AlertTriangle, MapPin, Clock, ExternalLink } from 'lucide-react';
import { EMERGENCY_CONTACTS } from './data/emergenciesData';
import { EmergencyProtocolAccordion } from './EmergencyProtocolAccordion';
import { usePharmacyDuty } from './hooks/usePharmacyDuty';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { activePharmacy } = usePharmacyDuty();
  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 200);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (isVisible) {
      closeBtnRef.current?.focus();
    } else if (!shouldRender) {
      previousFocusRef.current?.focus?.();
    }
  }, [isVisible, shouldRender]);

  useBodyScrollLock(shouldRender);

  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-modal-title"
      aria-describedby="emergency-modal-desc"
      onClick={onClose}
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-sand-50 rounded-3xl max-w-3xl w-full max-h-[88vh] overflow-hidden border border-sand-300 shadow-2xl flex flex-col transition-all duration-200 ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2'
        }`}
      >
        {/* Cabecera fija */}
        <div className="shrink-0 flex items-start justify-between gap-4 px-6 py-5 sm:px-8 sm:py-6 border-b border-sand-200 bg-sand-50">
          <div className="space-y-1">
            <h2
              id="emergency-modal-title"
              className="font-display font-black text-2xl sm:text-3xl text-sand-900 tracking-tight"
            >
              Emergencias y Seguridad Serrana
            </h2>
            <p id="emergency-modal-desc" className="text-sm text-sand-700 leading-relaxed">
              Discado directo de auxilio médico, rescate en montaña e incendios en Capilla del Monte (guardia 24 hs).
            </p>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de emergencias"
            className="p-2.5 rounded-xl bg-sand-200/80 hover:bg-sand-300 text-sand-900 transition-colors cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-900"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8 sm:py-6 space-y-6">
          {/* Farmacia de Turno */}
          {activePharmacy && (
            <section aria-label="Farmacia de turno" className="p-4 sm:p-5 rounded-2xl bg-white border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-emerald-800">
                  Farmacia de turno hoy
                </p>
                <h3 className="font-display font-bold text-base text-sand-900">
                  {activePharmacy.name}
                </h3>
                <p className="text-xs text-sand-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sand-600 shrink-0" aria-hidden="true" />
                  <span>{activePharmacy.address} · {activePharmacy.dutyHours}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${activePharmacy.phone.replace(/\s+/g, '')}`}
                  className="py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800"
                >
                  <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Llamar</span>
                </a>
                <a
                  href="/emergencias"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-sand-900 font-bold text-xs inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-900"
                >
                  <span>Ver ficha</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </section>
          )}

          {/* Lista de teléfonos de emergencia */}
          <section aria-labelledby="emergency-phones-heading" className="space-y-3">
            <h3 id="emergency-phones-heading" className="font-display font-bold text-sm text-sand-900">
              Números de emergencia con discado directo
            </h3>
            <div className="rounded-2xl border border-sand-200 bg-white divide-y divide-sand-200 overflow-hidden">
              {EMERGENCY_CONTACTS.map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-display font-bold text-sm sm:text-base text-sand-900">
                      {c.name}
                    </h4>
                    <p className="text-xs text-sand-700 leading-relaxed">
                      {c.description}
                    </p>
                    {c.address && (
                      <p className="text-xs text-sand-700 flex items-center gap-1.5 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-sand-600 shrink-0" aria-hidden="true" />
                        <span>{c.address}</span>
                      </p>
                    )}
                  </div>

                  <a
                    href={`tel:${c.fullPhone}`}
                    aria-label={`Llamar a ${c.name} al ${c.shortNumber}, teléfono ${c.fullPhone}`}
                    className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>Llamar al {c.shortNumber}</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Protocolos de Seguridad */}
          <section aria-labelledby="emergency-protocols-heading" className="space-y-3">
            <h3 id="emergency-protocols-heading" className="font-display font-bold text-sm text-sand-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span>Protocolos de seguridad en senderos y ríos</span>
            </h3>
            <EmergencyProtocolAccordion />
          </section>
        </div>

        {/* Pie fijo */}
        <div className="shrink-0 px-6 py-4 sm:px-8 border-t border-sand-200 bg-sand-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand-700">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sand-600 shrink-0" aria-hidden="true" />
            <span>Datos verificados por Defensa Civil y la Cámara de Turismo de Capilla del Monte.</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-sand-900 hover:text-terracotta-700 font-bold underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand-900 rounded-sm px-1"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
