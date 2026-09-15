import React from 'react';
import { Bed, ShieldCheck, Clock, Award } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationHostAndRoomsProps {
  data: AccommodationDetailData;
}

export const AccommodationHostAndRooms: React.FC<AccommodationHostAndRoomsProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      {/* Tarjeta del Anfitrión / Prestador Habilitado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={data.host.avatarUrl}
            alt={data.host.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-500 shadow-sm shrink-0"
            loading="lazy"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-base text-stone-900 leading-tight">
                {data.host.name}
              </h2>
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              {data.host.badgeText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-stone-600 border-t sm:border-t-0 sm:border-l border-stone-100 pt-3 sm:pt-0 sm:pl-6 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-terracotta-600" />
            <span>{data.host.responseTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-primary-600" />
            <span>{data.host.yearsHosting} años como prestador</span>
          </div>
        </div>
      </div>

      {/* Descripción Editorial Completa */}
      <div className="space-y-3">
        <h2 className="font-display font-black text-xl text-stone-900">
          Sobre este Hospedaje
        </h2>
        <div className="space-y-3 text-sm sm:text-base text-stone-700 leading-relaxed">
          {data.fullDescription.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Distribución de Dormitorios */}
      <div className="space-y-4 pt-4 border-t border-stone-200/80">
        <h2 className="font-display font-black text-xl text-stone-900">
          Dónde vas a descansar
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.bedrooms.map((room, idx) => (
            <div
              key={room.name + idx}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-2"
            >
              <div className="flex items-center gap-2 text-terracotta-600">
                <Bed className="w-5 h-5" />
                <h3 className="font-display font-bold text-sm text-stone-900">
                  {room.name}
                </h3>
              </div>
              <p className="text-xs font-bold text-stone-800">
                {room.beds}
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                {room.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
