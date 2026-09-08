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
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20">
      {/* Stepper Superior */}
      <BookingWizardStepper step={wizard.step} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {wizard.step === 'success' ? (
          <BookingWizardSuccess data={data} wizard={wizard} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Columna Izquierda: Resumen de la reserva (Capturas 3 y 4) */}
            <aside className="lg:col-span-5 order-2 lg:order-1 lg:sticky lg:top-8">
              <BookingWizardSummaryCol data={data} wizard={wizard} />
            </aside>

            {/* Columna Derecha: Formularios de Fase (Capturas 3 y 4) */}
            <section className="lg:col-span-7 order-1 lg:order-2">
              {wizard.step === 2 && <BookingWizardStep2Fields data={data} wizard={wizard} />}
              {wizard.step === 3 && <BookingWizardStep3Confirm data={data} wizard={wizard} />}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};
