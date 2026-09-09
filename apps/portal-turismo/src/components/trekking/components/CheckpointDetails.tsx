import React from 'react';
import type { Checkpoint } from '../types';

interface CheckpointDetailsProps {
  checkpoint: Checkpoint;
}

export const CheckpointDetails: React.FC<CheckpointDetailsProps> = ({ checkpoint }) => {
  return (
    <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
      {/* Fotografía de la Posta */}
      <div className="relative md:w-5/12 h-56 md:h-auto min-h-[220px] bg-sand-200">
        <img
          src={checkpoint.imageUrl}
          alt={checkpoint.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-[11px] uppercase tracking-wider text-sand-300 font-semibold block">
            Hito del Sendero · Km {checkpoint.distanceKm.toFixed(1)}
          </span>
          <span className="font-display font-black text-2xl text-white">
            {checkpoint.elevationMsnm} msnm
          </span>
        </div>
      </div>

      {/* Contenido Editorial & Normativa */}
      <div className="p-6 md:w-7/12 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-black text-2xl text-sand-900 tracking-tight">
              {checkpoint.title}
            </h3>
            {checkpoint.cutoffTimeNotice && (
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                {checkpoint.cutoffTimeNotice}
              </span>
            )}
          </div>

          <p className="text-sm text-sand-700 leading-relaxed font-normal">
            {checkpoint.description}
          </p>

          <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs text-sand-800 space-y-1">
            <span className="font-bold block text-sand-900">Recomendación técnica:</span>
            <span>{checkpoint.keyAdvice}</span>
          </div>
        </div>

        {/* Puntos y Requisitos */}
        <div className="pt-2 border-t border-sand-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-sand-600">
          {checkpoint.features.map((feature, idx) => (
            <span key={idx} className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              <span>{feature}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
