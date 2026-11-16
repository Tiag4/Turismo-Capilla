import React from 'react';
import { Star } from 'lucide-react';
import { ReviewSubmissionContainer } from '../components/reviews/ReviewSubmissionContainer';

export const ReviewSubmissionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-sand-900 py-8 sm:py-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-sand-300 text-[11px] font-extrabold uppercase tracking-wider text-terracotta-600">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Opiniones verificadas de huéspedes
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-sand-950 tracking-tight">
            Calificá tu estadía en Capilla del Monte
          </h1>
          <p className="text-sand-600 text-sm sm:text-base max-w-xl mx-auto">
            Tu testimonio ayuda a otros viajeros a elegir alojamientos confiables y alimenta el sistema
            de reputación transparente de la Cámara de Turismo.
          </p>
        </div>

        <ReviewSubmissionContainer />
      </div>
    </div>
  );
};
