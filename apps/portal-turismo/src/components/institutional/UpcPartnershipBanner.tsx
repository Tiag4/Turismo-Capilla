import React from 'react';
import { GraduationCap, Award, Compass, ShieldCheck } from 'lucide-react';

export const UpcPartnershipBanner: React.FC = () => {
  return (
    <section className="rounded-3xl bg-sand-900 text-sand-100 p-8 sm:p-12 relative overflow-hidden shadow-lg border border-sand-800">
      {/* Detalle decorativo de fondo orgánico */}
      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-uritorco-600/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute right-10 top-0 w-64 h-64 rounded-full bg-terracotta-500/10 blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-8 max-w-4xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-800 text-primary-300 text-xs font-bold border border-sand-700">
            <GraduationCap className="w-4 h-4 text-primary-400 shrink-0" aria-hidden="true" />
            <span>Iniciativa Académica Intercátedras</span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Universidad Provincial de Córdoba & Cámara de Turismo
          </h2>

          <p className="text-sm sm:text-base text-sand-300 leading-relaxed font-normal">
            Esta plataforma surge como un proyecto de extensión y articulación universitaria entre diversas cátedras de informática de la <strong className="text-white font-semibold">Universidad Provincial de Córdoba (UPC)</strong> y la <strong className="text-white font-semibold">Cámara de Turismo de Capilla del Monte</strong>. Su objetivo es aportar soluciones tecnológicas reales, soberanas y de trato directo a la comunidad serrana.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-sand-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-uritorco-400 shrink-0" aria-hidden="true" />
              <span>Soberanía Digital</span>
            </div>
            <p className="text-xs text-sand-400 leading-relaxed">
              Reserva directa con prestadores locales habilitados, erradicando comisiones abusivas de intermediarios multinacionales.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Award className="w-4 h-4 text-primary-400 shrink-0" aria-hidden="true" />
              <span>Formación Profesional</span>
            </div>
            <p className="text-xs text-sand-400 leading-relaxed">
              Estudiantes aplicando ingeniería de software, arquitectura limpia y diseño accesible sobre problemáticas reales del territorio.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Compass className="w-4 h-4 text-terracotta-400 shrink-0" aria-hidden="true" />
              <span>Turismo Responsable</span>
            </div>
            <p className="text-xs text-sand-400 leading-relaxed">
              Divulgación del patrimonio geológico, senderismo seguro en el Valle de Punilla y preservación de la identidad del Uritorco.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
