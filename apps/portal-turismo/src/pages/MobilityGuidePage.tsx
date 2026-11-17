import React from 'react';
import { MobilityHeader } from '../components/mobility/MobilityHeader';
import { TransitAlertBanner } from '../components/mobility/TransitAlertBanner';
import { RouteOriginsTabs } from '../components/mobility/RouteOriginsTabs';
import { TrenSierrasSection } from '../components/mobility/TrenSierrasSection';
import { BusCompaniesSection } from '../components/mobility/BusCompaniesSection';
import { MobilityInteractiveMap } from '../components/mobility/MobilityInteractiveMap';
import { useMobilityData } from '../components/mobility/hooks/useMobilityData';

export const MobilityGuidePage: React.FC = () => {
  const { config } = useMobilityData();

  return (
    <div className="py-10 sm:py-16 bg-sand-50/60 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        <MobilityHeader />
        {config.transitAlert && <TransitAlertBanner alert={config.transitAlert} />}
        <RouteOriginsTabs originsData={config.originsData} />
        <TrenSierrasSection train={config.train} />
        <BusCompaniesSection busTerminal={config.busTerminal} />
        <MobilityInteractiveMap />
      </div>
    </div>
  );
};
