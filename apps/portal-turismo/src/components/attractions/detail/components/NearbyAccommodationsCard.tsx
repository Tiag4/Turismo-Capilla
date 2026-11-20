import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PLACES } from '../../../../data/mock-places';
import { api } from '../../../../services/api';

interface NearbyStaySummary {
  id: string;
  title: string;
  zone: string;
  imageUrl: string;
  pricePerNight: number;
}

function getFallbackStays(): NearbyStaySummary[] {
  return MOCK_PLACES.filter((p) => p.type === 'accommodation')
    .slice(0, 2)
    .map((p) => ({
      id: p.id,
      title: p.title,
      zone: p.zone || 'Capilla del Monte',
      imageUrl: p.imageUrl,
      pricePerNight: p.pricePerNight ?? 0,
    }));
}

export const NearbyAccommodationsCard: React.FC = () => {
  const [nearbyStays, setNearbyStays] = useState<NearbyStaySummary[]>(() => getFallbackStays());

  useEffect(() => {
    let active = true;
    api
      .getAccommodations()
      .then((items) => {
        if (!active || !Array.isArray(items) || items.length === 0) return;

        const sorted = [...items]
          .filter((item) => item.isActive)
          .sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)))
          .slice(0, 2);

        if (sorted.length === 0) return;

        setNearbyStays(
          sorted.map((item) => {
            const parsedPrice =
              typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
            return {
              id: item.id,
              title: item.name,
              zone: item.locality || 'Capilla del Monte',
              imageUrl:
                item.images?.find((img) => img.isMain)?.url ||
                item.images?.[0]?.url ||
                '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg',
              pricePerNight: isNaN(parsedPrice) ? 0 : parsedPrice,
            };
          }),
        );
      })
      .catch(() => {
        // Keep static fallback if backend is unreachable
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4 pb-6 border-b border-sand-200/80">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-base text-sand-950 flex items-center gap-2">
          <svg className="w-5 h-5 text-terracotta-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Alojamientos Cercanos</span>
        </h3>
        <Link to="/alojamientos" className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700">
          Ver todos
        </Link>
      </div>

      <div className="space-y-2.5">
        {nearbyStays.map((stay) => (
          <Link
            key={stay.id}
            to={`/alojamientos/${stay.id}`}
            className="group flex items-center gap-3 p-2 rounded-xl border border-sand-200/60 hover:bg-sand-100/70 transition-all"
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
          </Link>
        ))}
      </div>
    </div>
  );
};
