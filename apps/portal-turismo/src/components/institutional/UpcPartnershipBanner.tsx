import React from 'react';

export const UpcPartnershipBanner: React.FC = () => {
  return (
    <section className="rounded-2xl bg-sand-900 text-sand-100 p-8 sm:p-10 border border-sand-800">
      <div className="max-w-3xl space-y-6">
        <a
          href="https://www.upc.edu.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-md"
          aria-label="Sitio web oficial de la Universidad Provincial de Córdoba (se abre en nueva pestaña)"
        >
          <img
            src="/logo-upc-white.png"
            alt="Logotipo oficial de la Universidad Provincial de Córdoba"
            className="h-10 sm:h-12 w-auto object-contain"
            loading="lazy"
          />
        </a>

        <div className="space-y-3">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
            Universidad Provincial de Córdoba — Sede Capilla del Monte
          </h2>

          <p className="text-sm sm:text-base text-sand-300 leading-relaxed font-normal">
            Esta plataforma fue realizada como proyecto de práctica profesional y articulación académica por estudiantes del último año de la Tecnicatura en Desarrollo de Software de la <strong className="text-white font-semibold">Universidad Provincial de Córdoba (Sede Capilla del Monte)</strong> junto a la <strong className="text-white font-semibold">Cámara de Turismo de Capilla del Monte</strong>, con el objetivo de brindar una herramienta digital accesible y de gestión directa para prestadores y visitantes de nuestra comunidad serrana.
          </p>
        </div>
      </div>
    </section>
  );
};
