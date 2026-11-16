import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PLACES, type MapPlace } from '../data/mock-places';
import { api, type Accommodation } from '../services/api';
import { AccommodationDetailContainer } from '../components/accommodations/detail/AccommodationDetailContainer';

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
    description: item.description,
    category: typeMap[item.type] || 'Alojamiento',
    lat: item.latitude ?? -30.857,
    lng: item.longitude ?? -64.515,
    pricePerNight: isNaN(price) ? 95000 : price,
    rating: 0,
    reviewCount: 0,
    imageUrl: mainImage,
    galleryImages: item.images && item.images.length > 0 ? item.images.map((img) => img.url) : [mainImage],
    address: item.address,
    verified: item.isActive,
    amenities: item.amenities ?? [],
    capacity: `Hasta ${item.maxGuests} personas`,
    maxGuests: item.maxGuests,
    unitTitle: item.unitTitle,
    surfaceSqm: item.surfaceSqm,
    bedroomsSummary: item.bedroomsSummary,
    phone: item.phone,
    checkInTime: item.checkInTime,
    checkOutTime: item.checkOutTime,
    petPolicy: item.petPolicy,
    cancellationPolicy: item.cancellationPolicy,
    licenseNumber: item.licenseNumber,
    responseTime: item.responseTime,
    inventoryMode: item.inventoryMode,
    roomTypes:
      item.roomTypes && item.roomTypes.length > 0
        ? item.roomTypes.map((rt) => ({
            id: rt.id,
            name: rt.name,
            description: rt.description || `${rt.name} en ${item.name}`,
            capacityAdults: rt.baseCapacity ?? Math.max(1, (rt.maxCapacity ?? 2) - 1),
            capacityChildren: Math.max(0, (rt.maxCapacity ?? 2) - (rt.baseCapacity ?? 1)),
            maxGuests: rt.maxCapacity ?? 2,
            bedsSummary: rt.bedsSummary || `${rt.beds ?? 1} camas`,
            sizeSqm: rt.sizeSqm ?? 28,
            pricePerNight:
              typeof rt.basePricePerNight === 'string'
                ? parseFloat(rt.basePricePerNight)
                : (rt.basePricePerNight ?? (isNaN(price) ? 95000 : price)),
            totalStock: rt.totalUnits ?? 1,
            availableStock: rt.availableUnits ?? rt.totalUnits ?? 1,
            breakfastIncluded:
              rt.ratePlans?.some((p) => p.breakfastIncluded) ?? Boolean(item.hasBreakfast),
            amenities: rt.amenities && rt.amenities.length > 0 ? rt.amenities : (item.amenities ?? []),
            imageUrl: mainImage,
          }))
        : undefined,
    hostName: item.hostName || (item.host ? `${item.host.name} ${item.host.lastName}`.trim() : undefined),
    hostYearsHosting: item.host?.createdAt
      ? Math.max(1, new Date().getFullYear() - new Date(item.host.createdAt).getFullYear())
      : undefined,
    zone: item.locality || 'Capilla del Monte',
    ctaUrl: `/alojamientos/${item.id}`,
  };
}

export const AccommodationDetailPage: React.FC = () => {
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
        // Backend offline or item not in DB, keep initial mock fallback
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, [id]);

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

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900">
      <AccommodationDetailContainer place={place} />
    </div>
  );
};
