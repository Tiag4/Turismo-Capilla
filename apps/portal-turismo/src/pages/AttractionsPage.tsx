import React from 'react';
import { AttractionsCatalogContainer } from '../components/attractions/AttractionsCatalogContainer';

export const AttractionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-sand-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <AttractionsCatalogContainer />
      </div>
    </div>
  );
};
