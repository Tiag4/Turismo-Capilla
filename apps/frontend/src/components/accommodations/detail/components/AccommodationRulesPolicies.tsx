import React from 'react';
import { Clock, HeartHandshake, Volume2, CalendarX2 } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationRulesPoliciesProps {
  rules: AccommodationDetailData['rules'];
}

export const AccommodationRulesPolicies: React.FC<AccommodationRulesPoliciesProps> = ({ rules }) => {
  return (
    <section className="space-y-4 pt-6 border-t border-stone-200/80">
      <div>
        <h2 className="font-display font-black text-xl text-stone-900">
          Normas de Convivencia y Políticas
        </h2>
        <p className="text-xs text-stone-500 font-medium mt-0.5">
          Pautas para preservar la tranquilidad del entorno serrano
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Horarios de Ingreso / Egreso */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-terracotta-600">
            <Clock className="w-4 h-4" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              Horarios de Estadía
            </h3>
          </div>
          <div className="text-xs text-stone-700 space-y-1 font-medium">
            <p><strong>Check-in:</strong> a partir de las {rules.checkIn}</p>
            <p><strong>Check-out:</strong> hasta las {rules.checkOut}</p>
          </div>
        </div>

        {/* Mascotas */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-primary-600">
            <HeartHandshake className="w-4 h-4" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              Mascotas
            </h3>
          </div>
          <p className="text-xs text-stone-700 font-medium leading-relaxed">
            {rules.petPolicy}
          </p>
        </div>

        {/* Horas de Silencio */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-stone-600">
            <Volume2 className="w-4 h-4" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              Descanso Serrano
            </h3>
          </div>
          <p className="text-xs text-stone-700 font-medium leading-relaxed">
            {rules.quietHours}
          </p>
        </div>

        {/* Cancelación */}
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <CalendarX2 className="w-4 h-4" />
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-900">
              Cancelación
            </h3>
          </div>
          <p className="text-xs text-stone-700 font-medium leading-relaxed">
            {rules.cancellation}
          </p>
        </div>
      </div>
    </section>
  );
};
