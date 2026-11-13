import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, GraduationCap } from 'lucide-react';
import { DASHBOARD_URL } from '../../config/navigation';

export interface AppFooterProps {
  onMapaClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onOpenEmergencies: () => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/turismocapilladelmonte', label: 'Instagram', icon: InstagramIcon, color: 'text-primary-400' },
  { href: 'https://www.facebook.com/turismocapilladelmonte', label: 'Facebook', icon: FacebookIcon, color: 'text-primary-400' },
  { href: 'https://wa.me/5493548569415', label: 'WhatsApp', icon: MessageCircle, color: 'text-uritorco-400' },
];

export const AppFooter: React.FC<AppFooterProps> = ({ onMapaClick, onOpenEmergencies }) => {
  return (
    <footer className="bg-sand-900 text-sand-200 border-t border-sand-800 py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img
              src="/cropped-logo-capilla-del-monte-2024.png"
              alt="Capilla del Monte — Pueblo Uritorco"
              className="h-11 w-auto object-contain bg-white/95 px-2.5 py-1.5 rounded-xl shadow-sm"
              loading="lazy"
            />
            <div>
              <span className="font-display font-extrabold text-xl text-white block leading-tight">
                Turismo Capilla del Monte
              </span>
              <span className="text-xs text-sand-400 font-medium">
                Cámara de Turismo · Portal Oficial
              </span>
            </div>
          </div>

          <p className="text-sm text-sand-300 max-w-md leading-relaxed">
            Plataforma oficial de la Cámara de Turismo de Capilla del Monte. Información verificada de circuitos serranos y reservas directas con prestadores habilitados oficialmente, sin comisiones ocultas.
          </p>

          <div className="pt-3 border-t border-sand-800/90 max-w-md space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <GraduationCap className="w-4 h-4 text-primary-400 shrink-0" />
              <span>Convenio Institucional UPC</span>
            </div>
            <p className="text-xs text-sand-400 leading-relaxed">
              Alianza estratégica con la <strong className="text-sand-200 font-semibold">Universidad Provincial de Córdoba (UPC)</strong> para la profesionalización del sector, prácticas profesionales y desarrollo turístico sostenible en el Valle de Punilla.
            </p>
          </div>

          <div className="flex items-center gap-2.5 pt-1 flex-wrap">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} oficial de la Cámara de Turismo`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sand-800 hover:bg-sand-700 text-xs font-semibold text-sand-200 hover:text-white transition-colors"
              >
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">Paseos & Naturaleza</h4>
          <ul className="space-y-2.5 text-sm text-sand-300">
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Cerro Uritorco</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Los Terrones</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Dique El Cajón</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Balneario La Toma</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Paseo El Zapato</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Los Mogotes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">Dónde Dormir</h4>
          <ul className="space-y-2.5 text-sm text-sand-300">
            <li><Link to="/alojamientos?amenity=pileta-climatizada" className="hover:text-primary-400 transition-colors">Cabañas con pileta</Link></li>
            <li><Link to="/alojamientos?zone=falda-del-uritorco" className="hover:text-primary-400 transition-colors">Falda del Uritorco</Link></li>
            <li><Link to="/alojamientos?petFriendly=true" className="hover:text-primary-400 transition-colors">Alojamientos Pet-friendly</Link></li>
            <li><Link to="/alojamientos?zone=la-toma" className="hover:text-primary-400 transition-colors">Cerca del río</Link></li>
            <li><Link to="/alojamientos" className="hover:text-primary-400 transition-colors">Catálogo habilitado</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">Experiencias</h4>
          <ul className="space-y-2.5 text-sm text-sand-300">
            <li><Link to="/atractivos/uritorco" className="hover:text-primary-400 transition-colors">Ascenso nocturno</Link></li>
            <li><Link to="/#mapa-valle" onClick={onMapaClick} className="hover:text-primary-400 transition-colors">Mapa interactivo</Link></li>
            <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Guías habilitados</Link></li>
            <li><Link to="/atractivos?modo=circuitos" className="hover:text-primary-400 transition-colors">Circuitos Temáticos</Link></li>
            <li><Link to="/como-llegar" className="hover:text-primary-400 transition-colors">Cómo llegar & Peajes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">Contacto Cámara de Turismo</h4>
          <ul className="space-y-2.5 text-sm text-sand-300">
            <li className="text-sand-200 font-semibold">Cámara de Turismo de Capilla del Monte</li>
            <li className="text-xs text-sand-400">Predio Estación Ferrocarril · 08:00 a 20:00 hs</li>
            <li>
              <a href="tel:+543548481903" className="inline-flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                <Phone className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>+54 3548 481903</span>
              </a>
            </li>
            <li>
              <a href="https://wa.me/5493548569415" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>+54 9 3548 569415</span>
              </a>
            </li>
            <li>
              <a href="mailto:contacto@camaraturismocapilla.org.ar" className="inline-flex items-center gap-1.5 hover:text-primary-400 transition-colors break-all text-xs">
                <Mail className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>contacto@camaraturismocapilla.org.ar</span>
              </a>
            </li>
            <li className="text-xs text-sand-300">Guardia Turística: <strong>103</strong></li>
            <li>
              <button type="button" onClick={onOpenEmergencies} className="text-red-400 hover:text-red-300 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>SOS Emergencias 24hs (100 / 107)</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 pt-8 border-t border-sand-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-sand-400 gap-4">
        <span>© 2026 Cámara de Turismo de Capilla del Monte · Convenio Institucional UPC.</span>
        <div className="flex items-center gap-6 flex-wrap justify-center">
          <Link to="/alojamientos" className="hover:text-sand-300 transition-colors">Alojamientos</Link>
          <Link to="/atractivos" className="hover:text-sand-300 transition-colors">Paseos</Link>
          <Link to="/atractivos?modo=circuitos" className="hover:text-sand-300 transition-colors">Circuitos</Link>
          <Link to="/como-llegar" className="hover:text-sand-300 transition-colors">Cómo Llegar</Link>
          <Link to="/emergencias" className="hover:text-red-300 text-red-400 font-semibold transition-colors">Emergencias</Link>
          <a href={DASHBOARD_URL} className="hover:text-sand-300 transition-colors">Panel Prestadores</a>
        </div>
      </div>
    </footer>
  );
};
