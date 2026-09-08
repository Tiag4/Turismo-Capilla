import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { AccommodationDetailData } from '../types';

interface AccommodationLeftColProps {
  data: AccommodationDetailData;
}

export const AccommodationLeftCol: React.FC<AccommodationLeftColProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-900 tracking-tight leading-tight">
          {data.title}
        </h1>

        {/* Badge Verified Host idéntico a la comp */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 fill-blue-600 text-white shrink-0" />
          <span>Verified Host</span>
        </div>
      </div>

      {/* Párrafo descriptivo fiel a la captura */}
      <p className="text-sm text-stone-600 leading-relaxed font-normal pt-1">
        {data.fullDescription?.[0] ?? `${data.title} is an luxury rustic mountain cabin rental. 5-photo terrace. Construction and modern amenities to provide private vacation in Capilla del Monte, Cordoba, Argentina.`}
      </p>
    </div>
  );
};
