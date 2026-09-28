import React, { useMemo } from 'react';
import type { MapPlace } from '../../data/mock-places';
import { getAccommodationDetail } from '../accommodations/detail/getAccommodationDetail';
import { useBookingWizard } from './hooks/useBookingWizard';
import { BookingWizardStepper } from './components/BookingWizardStepper';
import { BookingWizardSummaryCol } from './components/BookingWizardSummaryCol';
import { BookingWizardStep2Fields } from './components/BookingWizardStep2Fields';
import { BookingWizardStep3Confirm } from './components/BookingWizardStep3Confirm';
import { BookingWizardSuccess } from './components/BookingWizardSuccess';

interface BookingWizardContainerProps {
  place: MapPlace;
}

export const BookingWizardContainer: React.FC<BookingWizardContainerProps> = ({ place }) => {
  const data = useMemo(() => getAccommodationDetail(place), [place]);
  const wizard = useBookingWizard(data);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24">
      {/* Stepper Superior con espaciado amplio respecto al navbar sticky */}
      <div className="pt-3 sm:pt-5">
        <BookingWizardStepper step={wizard.step} />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {wizard.step === 'success' ? (
          <BookingWizardSuccess data={data} wizard={wizard} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Columna Izquierda: Sticky a top-24 (96px) para quedar holgadamente debajo del navbar (68px) */}
            <aside className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-24">
              <BookingWizardSummaryCol data={data} wizard={wizard} />
            </aside>

            {/* Columna Derecha: Formularios de Fase */}
            <section className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              {wizard.step === 2 && <BookingWizardStep2Fields data={data} wizard={wizard} />}
              {wizard.step === 3 && <BookingWizardStep3Confirm data={data} wizard={wizard} />}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
