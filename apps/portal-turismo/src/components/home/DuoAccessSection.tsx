import React from 'react';
import { Link } from 'react-router-dom';

export const DEFAULT_WHAT_TO_DO_IMG =
  '/images/attractions/los-terrones/los-terrones-01.jpg';
export const DEFAULT_WHAT_TO_DO_SUBTITLE =
  '12 senderos catalogados: ascensos al Cerro Uritorco, cañadones rojizos en Los Terrones, ollas de agua en La Toma y espejos del dique El Cajón.';

export const DEFAULT_WHERE_TO_SLEEP_IMG =
  '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg';
export const DEFAULT_WHERE_TO_SLEEP_SUBTITLE =
  'Cabañas de piedra y algarrobo, posadas de montaña y hosterías de época. Trato directo con el prestador, sin comisiones ni sobreprecios.';

export interface DuoAccessSectionProps {
  whatToDoImageUrl?: string;
  whatToDoSubtitle?: string;
  whereToSleepImageUrl?: string;
  whereToSleepSubtitle?: string;
}

export const DuoAccessSection: React.FC<DuoAccessSectionProps> = ({
  whatToDoImageUrl,
  whatToDoSubtitle,
  whereToSleepImageUrl,
  whereToSleepSubtitle,
}) => {
  const activeWhatImg = whatToDoImageUrl || DEFAULT_WHAT_TO_DO_IMG;
  const activeWhatSub = whatToDoSubtitle || DEFAULT_WHAT_TO_DO_SUBTITLE;
  const activeSleepImg = whereToSleepImageUrl || DEFAULT_WHERE_TO_SLEEP_IMG;
  const activeSleepSub = whereToSleepSubtitle || DEFAULT_WHERE_TO_SLEEP_SUBTITLE;

  return (
    <section className="relative z-10 py-16 sm:py-24 bg-sand-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 gsap-duo-container">
          {/* Tarjeta Qué Hacer */}
          <Link
            to="/atractivos"
            className="gsap-duo-card group relative h-[440px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-end p-8 sm:p-12 border border-sand-200"
          >
            <img
              data-duo-what-img
              src={activeWhatImg}
              alt="Parque Los Terrones y senderos de montaña"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== DEFAULT_WHAT_TO_DO_IMG) {
                  target.src = DEFAULT_WHAT_TO_DO_IMG;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />

            <div className="relative z-10 space-y-3">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Qué Hacer
              </h2>
              <p
                data-duo-what-desc
                className="text-sm text-sand-200 line-clamp-2 max-w-md font-normal leading-relaxed"
              >
                {activeWhatSub}
              </p>
              <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-white group-hover:text-uritorco-300 transition-colors">
                <span>Explorar los circuitos y requisitos técnicos</span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Tarjeta Dónde Dormir */}
          <Link
            to="/alojamientos"
            className="gsap-duo-card group relative h-[440px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-end p-8 sm:p-12 border border-sand-200"
          >
            <img
              data-duo-sleep-img
              src={activeSleepImg}
              alt="Cabañas serranas al pie del cerro con vista nocturna cálida"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out brightness-90 contrast-105"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== DEFAULT_WHERE_TO_SLEEP_IMG) {
                  target.src = DEFAULT_WHERE_TO_SLEEP_IMG;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />

            <div className="relative z-10 space-y-3">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
                Dónde Dormir
              </h2>
              <p
                data-duo-sleep-desc
                className="text-sm text-sand-200 line-clamp-2 max-w-md font-normal leading-relaxed"
              >
                {activeSleepSub}
              </p>
              <div className="pt-2 flex items-center gap-2 text-sm font-semibold text-white group-hover:text-primary-300 transition-colors">
                <span>Ver catálogo con tarifas transparentes</span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
