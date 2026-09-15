import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col bg-sand-50 text-sand-900 font-sans antialiased">
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
            <a
              href="/#mapa-valle"
              className="text-sm font-semibold text-sand-700 hover:text-primary-600 transition-colors"
            >
              Mapa del Valle
            </a>
            <Link
              to="/atractivos/casonas"
              className="text-sm font-semibold text-sand-700 hover:text-primary-600 transition-colors"
            >
              Patrimonio
            </Link>
            <Link
              to="/astroturismo"
              className={`text-sm font-semibold transition-colors ${
                location.pathname === '/astroturismo'
                  ? 'text-primary-600'
                  : 'text-sand-700 hover:text-primary-600'
              }`}
            >
              Astroturismo
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
          <div className="flex items-center gap-3">
            <a
              href="/admin"
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
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-sand-200 bg-sand-50 px-4 py-4 space-y-3">
            <Link to="/" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-900 py-1.5">
              Inicio
            </Link>
            <Link to="/alojamientos" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Alojamientos
            </Link>
            <Link to="/atractivos" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Senderos & Paseos
            </Link>
            <a href="/#mapa-valle" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Mapa del Valle
            </a>
            <Link to="/atractivos/casonas" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Patrimonio
            </Link>
            <Link to="/astroturismo" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Astroturismo
            </Link>
            <Link to="/reservas/consulta" onClick={closeMobileMenu} className="block text-sm font-semibold text-sand-700 py-1.5">
              Mi Reserva
            </Link>
            <div className="pt-2 border-t border-sand-200">
              <a href="/admin" className="block w-full text-center text-xs font-semibold py-2.5 rounded-xl bg-sand-900 text-white">
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

      {/* Footer Institucional Limpio y Expansivo */}
      <footer className="bg-sand-900 text-sand-200 border-t border-sand-800 py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
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
                <span className="text-xs text-sand-400 font-medium">Pueblo Uritorco · Portal Oficial</span>
              </div>
            </div>
            <p className="text-sm text-sand-300 max-w-md leading-relaxed">
              Plataforma oficial desarrollada en conjunto con la Comisión de Turismo de Capilla del Monte. Información verificada de circuitos serranos y reservas directas con prestadores habilitados oficialmente, sin comisiones ocultas.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-sand-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-uritorco-500"></span>
                <span>Prestadores Habilitados</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary-500"></span>
                <span>Tarifa Transparente</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">
              Paseos & Naturaleza
            </h4>
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
            <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">
              Dónde Dormir
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-300">
              <li><Link to="/alojamientos?amenity=pileta-climatizada" className="hover:text-primary-400 transition-colors">Cabañas con pileta</Link></li>
              <li><Link to="/alojamientos?zone=falda-del-uritorco" className="hover:text-primary-400 transition-colors">Falda del Uritorco</Link></li>
              <li><Link to="/alojamientos?petFriendly=true" className="hover:text-primary-400 transition-colors">Alojamientos Pet-friendly</Link></li>
              <li><Link to="/alojamientos?zone=la-toma" className="hover:text-primary-400 transition-colors">Cerca del río</Link></li>
              <li><Link to="/alojamientos" className="hover:text-primary-400 transition-colors">Catálogo habilitado</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">
              Experiencias
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-300">
              <li><Link to="/astroturismo" className="hover:text-primary-400 transition-colors">Astroturismo Bortle 3</Link></li>
              <li><Link to="/atractivos/uritorco" className="hover:text-primary-400 transition-colors">Ascenso nocturno</Link></li>
              <li><a href="/#mapa-valle" className="hover:text-primary-400 transition-colors">Mapa interactivo</a></li>
              <li><Link to="/atractivos" className="hover:text-primary-400 transition-colors">Guías habilitados</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-4 text-sm tracking-wide">
              Atención Turística
            </h4>
            <ul className="space-y-2.5 text-sm text-sand-300">
              <li className="text-sand-200 font-medium">Secretaría de Turismo</li>
              <li>Predio Estación Ferrocarril</li>
              <li>Tel: +54 3548 481903</li>
              <li>Guardia Turística: 103</li>
              <li className="pt-1 text-xs text-sand-400">Capilla del Monte, Valle de Punilla, Córdoba</li>
            </ul>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 mt-12 pt-8 border-t border-sand-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-sand-400 gap-4">
          <span>© 2026 Comisión de Turismo de Capilla del Monte. Todos los derechos reservados.</span>
          <div className="flex items-center gap-6">
            <Link to="/astroturismo" className="hover:text-sand-300 transition-colors">Astroturismo</Link>
            <Link to="/alojamientos" className="hover:text-sand-300 transition-colors">Alojamientos</Link>
            <Link to="/atractivos" className="hover:text-sand-300 transition-colors">Paseos</Link>
            <span>Programación III — Cátedra Universitaria</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
