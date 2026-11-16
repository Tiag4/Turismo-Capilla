import React from 'react';
import { MobilityHeader } from '../components/mobility/MobilityHeader';
import { RouteOriginsTabs } from '../components/mobility/RouteOriginsTabs';
import { TrenSierrasSection } from '../components/mobility/TrenSierrasSection';
import { BusCompaniesSection } from '../components/mobility/BusCompaniesSection';
import { MobilityInteractiveMap } from '../components/mobility/MobilityInteractiveMap';

export const MobilityGuidePage: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-sand-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <MobilityHeader />
        <RouteOriginsTabs />
        <TrenSierrasSection />
        <BusCompaniesSection />
        <MobilityInteractiveMap />
      </div>
    </div>
  );
};
