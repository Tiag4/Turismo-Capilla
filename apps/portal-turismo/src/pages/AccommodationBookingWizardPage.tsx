import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PLACES, type MapPlace } from '../data/mock-places';
import { api, type Accommodation } from '../services/api';
import { BookingWizardContainer } from '../components/booking-wizard/BookingWizardContainer';

function mapApiToPlace(item: Accommodation): MapPlace {
  const price = typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
  const mainImage = item.images?.find((img) => img.isMain)?.url || item.images?.[0]?.url || '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg';

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
    lat: item.latitude ?? -30.857,
    lng: item.longitude ?? -64.515,
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
    downPaymentPercentage: item.downPaymentPercentage ?? 50,
    bankAccountHolder: item.bankAccountHolder || 'Administración Cabañas Capilla',
    bankCbu: item.bankCbu || '0110485530048500123456',
    bankAlias: item.bankAlias || 'CAPILLA.RESERVA.OFICIAL',
    bankName: item.bankName || 'Banco de la Nación Argentina',
  };
}

export const AccommodationBookingWizardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<MapPlace | null>(() => {
    return MOCK_PLACES.find((p) => p.type === 'accommodation' && p.id === id) ?? null;
  });
  const [loading, setLoading] = useState(!place);

  useEffect(() => {
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

  if (place.verified === false) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold font-display text-stone-900">
            Alojamiento no disponible
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Este alojamiento se encuentra temporalmente pausado por su prestador y no está recibiendo nuevas solicitudes de reserva.
          </p>
          <a
            href="/alojamientos"
            className="inline-block py-2.5 px-5 rounded-xl bg-[#C95627] hover:bg-[#b0481e] text-white font-bold text-sm transition-colors"
          >
            Ver otros alojamientos
          </a>
        </div>
      </div>
    );
  }

  return <BookingWizardContainer place={place} />;
};
