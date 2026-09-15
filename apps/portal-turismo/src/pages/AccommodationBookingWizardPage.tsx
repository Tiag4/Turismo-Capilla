import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PLACES, type MapPlace } from '../data/mock-places';
import { api, type Accommodation } from '../services/api';
import { BookingWizardContainer } from '../components/booking-wizard/BookingWizardContainer';

function mapApiToPlace(item: Accommodation): MapPlace {
  const price = typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
  const mainImage =
    item.images?.find((img) => img.isMain)?.url ||
    item.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80';

  const typeMap: Record<string, string> = {
    CABIN: 'Cabaña de Montaña',
    HOTEL: 'Hotel Serrano',
    APARTMENT: 'Departamento',
    HOSTEL: 'Hostería',
    CAMPING: 'Camping & Glamping',
  };

  return {
    id: item.id,
    type: 'accommodation',
    title: item.name,
    subtitle: item.description,
    category: typeMap[item.type] || 'Alojamiento',
    lat: -30.857,
    lng: -64.515,
    pricePerNight: isNaN(price) ? 95000 : price,
    rating: 4.9,
    reviewCount: 20,
    imageUrl: mainImage,
    address: item.address,
    verified: item.isActive,
    amenities: item.amenities ?? [],
    capacity: `Hasta ${item.maxGuests} personas`,
    zone: item.locality || 'Capilla del Monte',
    ctaUrl: `/alojamientos/${item.id}`,
  };
}

export const AccommodationBookingWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<MapPlace | null>(() => {
    return MOCK_PLACES.find((p) => p.type === 'accommodation' && p.id === id) ?? null;
  });
  const [loading, setLoading] = useState(!place);

  useEffect(() => {
    if (place) return;
    let active = true;
    async function loadData() {
      try {
        if (id) {
          const apiItem = await api.getAccommodationById(id);
          if (active && apiItem) {
            setPlace(mapApiToPlace(apiItem));
          }
        }
      } catch {
        // Not found or backend offline
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [id, place]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500" />
      </div>
    );
  }

  if (!place) {
    return <Navigate to="/alojamientos" replace />;
  }

  return <BookingWizardContainer place={place} />;
};
