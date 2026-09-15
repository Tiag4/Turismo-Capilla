import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PLACES } from '../../data/mock-places';

export const FeaturedCabinsSection: React.FC = () => {
  const featuredCabins = MOCK_PLACES.filter((p) => p.type === 'accommodation');

  return (
    <section className="py-16 sm:py-24 bg-sand-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-sand-900 tracking-tight">
              Cabañas y Posadas del Valle
            </h2>
            <p className="mt-3 text-base text-sand-700 leading-relaxed font-normal">
              Establecimientos formalmente inspeccionados por la Secretaría de Turismo, con habilitación vigente y contacto directo.
            </p>
          </div>
          <Link
            to="/alojamientos"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 group"
          >
            <span>Ver catálogo completo ({featuredCabins.length})</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 gsap-cabins-grid">
          {featuredCabins.map((cabin, idx) => (
            <article
              key={cabin.id}
              className="gsap-cabin-card bg-white rounded-3xl border border-sand-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 flex flex-col group"
            >
              <div className="relative h-60 w-full overflow-hidden bg-sand-200">
                <img
                  src={cabin.imageUrl}
                  alt={cabin.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-xs text-sand-200 font-medium block">
                    {cabin.category} · {cabin.zone}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl text-sand-900 group-hover:text-primary-600 transition-colors leading-snug">
                    {cabin.title}
                  </h3>
                  <p className="text-xs text-sand-600 line-clamp-2 leading-relaxed">
                    {cabin.subtitle}
                  </p>

                  {cabin.capacity && (
                    <p className="text-xs font-semibold text-sand-800">
                      Capacidad: {cabin.capacity}
                    </p>
                  )}

                  {cabin.amenities && (
                    <p className="text-xs text-sand-500 line-clamp-1 pt-1">
                      {cabin.amenities.join(' · ')}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-sand-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-emerald-portal-700 font-medium block mb-0.5">
                      Habilitación Municipal Nº {140 + idx}
                    </span>
                    <span className="text-[11px] text-sand-500 block">Por noche desde</span>
                    <span className="text-xl font-black text-sand-900">
                      ${(cabin.pricePerNight ?? 0).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <Link
                    to={cabin.ctaUrl}
                    className="px-4 py-2.5 rounded-xl bg-sand-900 hover:bg-primary-600 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Consultar →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
