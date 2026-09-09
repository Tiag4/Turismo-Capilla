import React from 'react';
import { MOCK_PLACES } from '../../../../data/mock-places';

export const NearbyAccommodationsCard: React.FC = () => {
  // Select 2 verified accommodations
  const nearbyStays = MOCK_PLACES.filter((p) => p.type === 'accommodation').slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-base text-sand-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Alojamientos Cercanos</span>
        </h3>
        <a href="/alojamientos" className="text-xs font-semibold text-terracotta-600 hover:text-terracotta-700">
          Ver todos
        </a>
      </div>

      <div className="space-y-3">
        {nearbyStays.map((stay) => (
          <a
            key={stay.id}
            href={`/alojamientos/${stay.id}`}
            className="group flex items-center gap-3 p-2.5 rounded-xl border border-sand-100 hover:border-sand-200 hover:bg-sand-50/50 transition-all"
          >
            <img
              src={stay.imageUrl}
              alt={stay.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
              loading="lazy"
            />
            <div className="min-w-0 flex-grow">
              <span className="text-[10px] font-bold uppercase tracking-wider text-uritorco-700 block">
                {stay.zone}
              </span>
              <h4 className="font-display font-bold text-xs sm:text-sm text-sand-900 truncate group-hover:text-terracotta-600 transition-colors">
                {stay.title}
              </h4>
              <span className="text-xs font-extrabold text-sand-900 block mt-0.5">
                ${(stay.pricePerNight ?? 0).toLocaleString('es-AR')}{' '}
                <span className="text-[10px] font-normal text-sand-500">/ noche</span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
