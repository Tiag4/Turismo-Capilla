import React from 'react';
import { AccommodationsCatalogContainer } from '../components/accommodations/AccommodationsCatalogContainer';

export const AccommodationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <AccommodationsCatalogContainer />
      </div>
    </div>
  );
};
