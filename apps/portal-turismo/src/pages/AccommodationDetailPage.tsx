import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PLACES } from '../data/mock-places';
import { AccommodationDetailContainer } from '../components/accommodations/detail/AccommodationDetailContainer';

export const AccommodationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const place = MOCK_PLACES.find((p) => p.type === 'accommodation' && p.id === id);

  if (!place) {
    return <Navigate to="/alojamientos" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      <AccommodationDetailContainer place={place} />
    </div>
  );
};
