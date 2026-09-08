import React from 'react';
import type { AccommodationDetailData } from '../types';

interface AccommodationLeftColProps {
  data: AccommodationDetailData;
}

export const AccommodationLeftCol: React.FC<AccommodationLeftColProps> = ({ data }) => {
  return (
    <div className="space-y-3">
      <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-900 tracking-tight leading-tight">
        {data.title}
      </h1>

      {/* Párrafo descriptivo fiel a la captura */}
      <p className="text-sm text-stone-600 leading-relaxed font-normal pt-1">
        {data.fullDescription?.[0] ?? `${data.title} is an luxury rustic mountain cabin rental. 5-photo terrace. Construction and modern amenities to provide private vacation in Capilla del Monte, Cordoba, Argentina.`}
      </p>
    </div>
  );
};

export interface AccommodationDescriptionProps {
  description?: string[];
}

export const AccommodationDescription: React.FC<AccommodationDescriptionProps> = ({ description }) => {
  return (
    <div className="space-y-3 pt-6 border-t border-stone-200">
      <h2 className="font-display font-bold text-lg text-stone-900">Sobre este hospedaje</h2>
      {description?.map((para, i) => (
        <p key={i} className="text-sm text-stone-600 leading-relaxed">
          {para}
        </p>
      ))}
    </div>
  );
};

