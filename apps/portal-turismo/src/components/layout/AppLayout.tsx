import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { DASHBOARD_URL } from '../../config/navigation';
import { OfflineBanner } from '../emergencies/OfflineBanner';
import { EmergencyModal } from '../emergencies/EmergencyModal';
import { EmergencyFloatingButton } from '../emergencies/EmergencyFloatingButton';
import { PublicAlertBanner } from './PublicAlertBanner';
import { AppFooter } from './AppFooter';
import { useAnimatedPresence } from '../../hooks/useAnimatedPresence';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { shouldRender: shouldRenderMobileMenu, isVisible: isMobileMenuVisible } = useAnimatedPresence(mobileMenuOpen, 180);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const hasBottomDock =
    (location.pathname.startsWith('/alojamientos/') && location.pathname !== '/alojamientos/') ||
    location.pathname.includes('/reserva');

  const handleMapaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('mapa-valle');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      if (window.location.hash !== '#mapa-valle') {
        window.history.pushState(null, '', '/#mapa-valle');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-sand-900 font-sans antialiased">
      <OfflineBanner onOpenEmergencies={() => setEmergencyModalOpen(true)} />
      {/* Alerta meteorológica y de seguridad en tiempo real */}
      <PublicAlertBanner />

      {/* Navbar Oficial Bespoke */}
      <header className="sticky top-0 z-40 bg-sand-50/95 backdrop-blur-md border-b border-sand-200/80">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-17 flex items-center justify-between">
          {/* Logo Oficial de Capilla del Monte */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center group py-1"
            aria-label="Capilla del Monte — Pueblo Uritorco"
          >
            <img
              src="/cropped-logo-capilla-del-monte-2024.png"
              alt="Capilla del Monte — Pueblo Uritorco"
              className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              loading="eager"
            />
          </Link>

          {/* Enlaces Principales de Navegación */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/' ? 'text-primary-600' : 'text-sand-900 hover:text-primary-600'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/alojamientos"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/alojamientos')
                  ? 'text-primary-600'
                  : 'text-sand-700 hover:text-primary-600'
              }`}
            >
              Alojamientos
            </Link>
            <Link
              to="/atractivos"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/atractivos')
                  ? 'text-primary-600'
                  : 'text-sand-700 hover:text-primary-600'
              }`}
            >
              Senderos & Paseos
            </Link>
            <Link
              to="/como-llegar"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/como-llegar')
                  ? 'text-primary-600'
                  : 'text-sand-700 hover:text-primary-600'
              }`}
            >
              Cómo Llegar
            </Link>
            <Link
              to="/#mapa-valle"
              onClick={handleMapaClick}
              className="text-sm font-semibold text-sand-700 hover:text-primary-600 transition-colors"
            >
              Mapa del Valle
            </Link>
            <Link
              to="/reservas/consulta"
              className={`text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/reservas')
                  ? 'text-primary-600'
                  : 'text-sand-700 hover:text-primary-600'
              }`}
            >
              Mi Reserva
            </Link>
          </nav>

          {/* CTA Panel Prestador & Menú Móvil */}
          <div className="flex items-center gap-2.5">
            <a
              href={DASHBOARD_URL}
              className="hidden sm:inline-flex items-center justify-center text-xs font-semibold px-4 py-2.5 rounded-xl bg-sand-900 hover:bg-sand-800 text-white transition-colors cursor-pointer"
            >
              Acceso Prestadores
            </a>

            {/* Botón de Menú Móvil */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 rounded-xl text-sand-800 hover:bg-sand-200 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {shouldRenderMobileMenu && (
          <div className={`md:hidden border-t border-sand-200 bg-sand-50 px-4 py-4 space-y-3 origin-top transition-all duration-180 ease-out ${isMobileMenuVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            <Link to="/" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-900 py-1.5">
              Inicio
            </Link>
            <Link to="/alojamientos" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Alojamientos
            </Link>
            <Link to="/atractivos" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Senderos & Paseos
            </Link>
            <Link to="/como-llegar" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Cómo Llegar
            </Link>
            <Link
              to="/#mapa-valle"
              onClick={(e) => {
                closeMobileMenu();
                handleMapaClick(e);
              }}
              className="block text-sm font-semibold text-sand-700 py-1.5"
            >
              Mapa del Valle
            </Link>
            <Link to="/reservas/consulta" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Mi Reserva
            </Link>
            <div className="pt-2 border-t border-sand-200">
              <a
                href={DASHBOARD_URL}
                onClick={closeMobileMenu}
                className="block w-full text-center text-xs font-semibold py-2.5 rounded-xl bg-sand-900 text-white"
              >
                Acceso Prestadores
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <div className={hasBottomDock ? 'pb-24 sm:pb-28 bg-sand-900' : ''}>
        <AppFooter
          onMapaClick={handleMapaClick}
          onOpenEmergencies={() => setEmergencyModalOpen(true)}
        />
      </div>

      {/* Acceso Rápido Flotante & Modal de Emergencias (HU-25) */}
      <EmergencyFloatingButton onOpen={() => setEmergencyModalOpen(true)} />
      <EmergencyModal isOpen={emergencyModalOpen} onClose={() => setEmergencyModalOpen(false)} />
    </div>
  );
};
