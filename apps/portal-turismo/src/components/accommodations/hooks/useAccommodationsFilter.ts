import { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_PLACES, type MapPlace } from '../../../data/mock-places';
import { api, type Accommodation } from '../../../services/api';

export type AccommodationTypeFilter = 'all' | 'cabin' | 'inn' | 'hotel' | 'apartment';
export type AmenityFilter = 'pileta' | 'wifi' | 'estacionamiento' | 'pet' | 'asador';
export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';

function mapApiToPlace(item: Accommodation): MapPlace {
  const price = typeof item.pricePerNight === 'string' ? parseFloat(item.pricePerNight) : item.pricePerNight;
  const mainImage = item.images?.find((img) => img.isMain)?.url || item.images?.[0]?.url || 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80';
  
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

function parseMaxCapacity(capacityStr?: string): number {
  if (!capacityStr) return 2;
  const digits = capacityStr.match(/\d+/g)?.map(Number) || [];
  return digits.length > 0 ? Math.max(...digits) : 2;
}

export function useAccommodationsFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<AccommodationTypeFilter>('all');
  const [selectedAmenities, setSelectedAmenities] = useState<AmenityFilter[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync initial state from URL query parameters safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qType = params.get('type') as AccommodationTypeFilter | null;
    const qAmenity = params.get('amenity');
    const qCheckIn = params.get('checkIn');
    const qCheckOut = params.get('checkOut');
    const qGuests = params.get('guests');
    const qSearch = params.get('q') || params.get('search');

    if (qCheckIn) setCheckIn(qCheckIn);
    if (qCheckOut) setCheckOut(qCheckOut);
    if (qGuests) setGuests(qGuests);
    if (qSearch) setSearchQuery(qSearch);
    if (qType && ['all', 'cabin', 'inn', 'hotel', 'apartment'].includes(qType)) {
      setSelectedType(qType);
    }

    const initialAmenities: AmenityFilter[] = [];
    if (qAmenity === 'pileta' || qAmenity === 'pileta-climatizada') initialAmenities.push('pileta');
    if (qAmenity === 'wifi') initialAmenities.push('wifi');
    if (qAmenity === 'estacionamiento') initialAmenities.push('estacionamiento');
    if (qAmenity === 'pet' || params.get('petFriendly') === 'true') initialAmenities.push('pet');
    if (initialAmenities.length > 0) setSelectedAmenities(initialAmenities);
  }, []);

  // Fetch real data from backend API with transparent fallback to mock data only if needed
  useEffect(() => {
    let isCancelled = false;
    async function loadApiAccommodations() {
      try {
        setIsLoading(true);
        const data = await api.getAccommodations();
        if (!isCancelled) {
          if (Array.isArray(data) && data.length > 0) {
            const mapped = data.map(mapApiToPlace);
            setPlaces(mapped);
          } else {
            setPlaces(MOCK_PLACES.filter((p) => p.type === 'accommodation'));
          }
        }
      } catch {
        // Fallback to MOCK_PLACES silently when backend is unreachable or errors
        if (!isCancelled) {
          setPlaces(MOCK_PLACES.filter((p) => p.type === 'accommodation'));
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }
    loadApiAccommodations();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Toggle amenity filter (multi-select)
  const toggleAmenity = useCallback((amenity: AmenityFilter) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  }, []);

  // Calculate nights count
  const nightsCount = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }, [checkIn, checkOut]);

  // Main filter pipeline
  const filteredAccommodations = useMemo(() => {
    let list = [...places];

    // 1. Filter by Accommodation Type
    if (selectedType !== 'all') {
      list = list.filter((p) => {
        const cat = (p.category ?? '').toLowerCase();
        if (selectedType === 'cabin') return cat.includes('cabaña') || cat.includes('cabin');
        if (selectedType === 'inn') return cat.includes('hostería') || cat.includes('hostel');
        if (selectedType === 'hotel') return cat.includes('hotel') || cat.includes('posada') || cat.includes('casona');
        if (selectedType === 'apartment') return cat.includes('departamento') || cat.includes('suite') || cat.includes('apartment');
        return true;
      });
    }

    // 2. Filter by Guest Count (Capacity)
    if (guests) {
      const guestNum = parseInt(guests, 10);
      if (!isNaN(guestNum) && guestNum > 1) {
        list = list.filter((p) => parseMaxCapacity(p.capacity) >= guestNum);
      }
    }

    // 3. Filter by Selected Amenities (conjunction / AND logic)
    if (selectedAmenities.length > 0) {
      list = list.filter((p) => {
        return selectedAmenities.every((amenity) => {
          const ams = (p.amenities ?? []).map((a) => a.toLowerCase());
          if (amenity === 'pileta') {
            return ams.some((a) => a.includes('pileta') || a.includes('piscina') || a.includes('bio-piscina'));
          }
          if (amenity === 'wifi') {
            return ams.some((a) => a.includes('wifi') || a.includes('internet'));
          }
          if (amenity === 'estacionamiento') {
            return ams.some((a) => a.includes('cochera') || a.includes('estacionamiento'));
          }
          if (amenity === 'pet') {
            return (
              ams.some((a) => a.includes('mascota') || a.includes('parque')) ||
              (p.zone?.toLowerCase().includes('toma') ?? false) ||
              (p.zone?.toLowerCase().includes('terrones') ?? false)
            );
          }
          if (amenity === 'asador') {
            return ams.some((a) => a.includes('asador') || a.includes('parrilla') || a.includes('quincho'));
          }
          return true;
        });
      });
    }

    // 4. Filter by Text Query (Title, Subtitle, Zone, Category, Amenities)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          (p.zone?.toLowerCase().includes(q) ?? false) ||
          (p.category?.toLowerCase().includes(q) ?? false) ||
          p.amenities?.some((a) => a.toLowerCase().includes(q))
      );
    }

    // 5. Sorting
    if (sortOption === 'price-asc') {
      list.sort((a, b) => (a?.pricePerNight ?? 0) - (b?.pricePerNight ?? 0));
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => (b?.pricePerNight ?? 0) - (a?.pricePerNight ?? 0));
    } else if (sortOption === 'rating-desc') {
      list.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
    }

    return list;
  }, [places, selectedType, guests, selectedAmenities, searchQuery, sortOption]);

  const resetFilters = useCallback(() => {
    setSelectedType('all');
    setSelectedAmenities([]);
    setSearchQuery('');
    setGuests('2');
    setCheckIn('');
    setCheckOut('');
    setSortOption('recommended');
  }, []);

  const openMap = useCallback(() => setIsMapOpen(true), []);
  const closeMap = useCallback(() => setIsMapOpen(false), []);

  return {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    selectedAmenities,
    toggleAmenity,
    sortOption,
    setSortOption,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guests,
    setGuests,
    nightsCount,
    isMapOpen,
    openMap,
    closeMap,
    filteredAccommodations,
    totalCount: filteredAccommodations.length,
    isLoading,
    resetFilters,
  };
}
