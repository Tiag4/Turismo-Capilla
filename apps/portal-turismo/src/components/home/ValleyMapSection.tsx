import React from 'react';
import { InteractiveMapContainer } from '../map/InteractiveMapContainer';

export const ValleyMapSection: React.FC = () => {
  return (
    <section id="mapa-valle" className="py-16 sm:py-24 bg-sand-100/70">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div className="max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-sand-900 tracking-tight">
              Explorá el Valle en el Mapa
            </h2>
            <p className="mt-3 text-base text-sand-700 leading-relaxed font-normal">
              Ubicá cabañas habilitadas, senderos al Uritorco, balnearios y diques. Hacé zoom o click en cualquier punto para ver tarifas y distancias reales.
            </p>
          </div>

          <div className="mt-4 md:mt-0 text-xs font-medium text-sand-600">
            12 alojamientos verificados y 7 paseos geolocalizados
          </div>
        </div>

        <div className="gsap-map-container">
          <InteractiveMapContainer />
        </div>
      </div>
    </section>
  );
};
