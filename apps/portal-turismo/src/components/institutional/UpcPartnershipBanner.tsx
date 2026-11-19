import React from 'react';

export const UpcPartnershipBanner: React.FC = () => {
  return (
    <section className="rounded-2xl bg-sand-900 text-sand-100 p-8 sm:p-10 border border-sand-800">
      <div className="max-w-3xl space-y-4">
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-snug">
          Universidad Provincial de Córdoba — Sede Capilla del Monte
        </h2>

        <p className="text-sm sm:text-base text-sand-300 leading-relaxed font-normal">
          Esta plataforma fue realizada como proyecto de práctica profesional y articulación académica entre diversas cátedras de informática de la <strong className="text-white font-semibold">Universidad Provincial de Córdoba (Sede Capilla del Monte)</strong> y la <strong className="text-white font-semibold">Cámara de Turismo de Capilla del Monte</strong>, con el objetivo de brindar una herramienta digital accesible y de gestión directa para prestadores y visitantes de nuestra comunidad serrana.
        </p>
      </div>
    </section>
  );
};
