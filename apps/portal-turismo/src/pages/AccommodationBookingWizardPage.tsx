import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PLACES } from '../data/mock-places';
import { BookingWizardContainer } from '../components/booking-wizard/BookingWizardContainer';

export const AccommodationBookingWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const place = MOCK_PLACES.find((p) => p.type === 'accommodation' && p.id === id);

  if (!place) {
    return <Navigate to="/alojamientos" replace />;
  }

  return <BookingWizardContainer place={place} />;
};
