import { useState, useMemo, useEffect, useCallback } from 'react';
import { MOCK_PLACES, type MapPlace } from '../../../data/mock-places';

export type PillFilter = 'all' | 'pileta' | 'falda' | 'pet' | 'asador' | 'rio';
export type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';

export function useAccommodationsFilter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPills, setSelectedPills] = useState<PillFilter[]>(['all']);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Sync initial state from URL query parameters safely
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qZone = params.get('zone');
    const qAmenity = params.get('amenity');
    const qCheckIn = params.get('checkIn');
    const qCheckOut = params.get('checkOut');
    const qGuests = params.get('guests');

    if (qCheckIn) setCheckIn(qCheckIn);
    if (qCheckOut) setCheckOut(qCheckOut);
    if (qGuests) setGuests(qGuests);

    const initialPills: PillFilter[] = [];
    if (qAmenity === 'pileta-climatizada' || qAmenity === 'pileta') {
      initialPills.push('pileta');
    }
    if (qAmenity === 'petFriendly' || params.get('petFriendly') === 'true') {
      initialPills.push('pet');
    }
    if (qZone === 'falda-del-uritorco') {
      initialPills.push('falda');
    }
    if (qZone === 'la-toma') {
      initialPills.push('rio');
    }

    if (initialPills.length > 0) {
      setSelectedPills(initialPills);
    }
  }, []);

  // Multi-select toggle handler
  const togglePill = useCallback((pill: PillFilter) => {
    if (pill === 'all') {
      setSelectedPills(['all']);
      return;
    }

    setSelectedPills((prev) => {
      const withoutAll = prev.filter((p) => p !== 'all');
      const exists = withoutAll.includes(pill);
      const next = exists ? withoutAll.filter((p) => p !== pill) : [...withoutAll, pill];
      return next.length === 0 ? ['all'] : next;
    });
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

  // Filter accommodations
  const rawAccommodations = useMemo(() => {
    return MOCK_PLACES.filter((p) => p.type === 'accommodation');
  }, []);

  const filteredAccommodations = useMemo(() => {
    let list = [...rawAccommodations];

    // Multi-Pill filters (conjunction/AND logic)
    if (!selectedPills.includes('all') && selectedPills.length > 0) {
      list = list.filter((p) => {
        return selectedPills.every((pill) => {
          if (pill === 'pileta') {
            return p.amenities?.some((a) => a.toLowerCase().includes('pileta') || a.toLowerCase().includes('piscina'));
          }
          if (pill === 'falda') {
            return p.zone?.toLowerCase().includes('falda') || p.title.toLowerCase().includes('uritorco');
          }
          if (pill === 'pet') {
            return (
              p.amenities?.some((a) => a.toLowerCase().includes('mascota') || a.toLowerCase().includes('parque')) ||
              p.zone?.toLowerCase().includes('terrones') ||
              p.zone?.toLowerCase().includes('toma')
            );
          }
          if (pill === 'asador') {
            return p.amenities?.some((a) => a.toLowerCase().includes('asador') || a.toLowerCase().includes('parrilla'));
          }
          if (pill === 'rio') {
            return (
              p.zone?.toLowerCase().includes('río') ||
              p.zone?.toLowerCase().includes('toma') ||
              p.subtitle.toLowerCase().includes('río')
            );
          }
          return true;
        });
      });
    }

    // Live Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        (p.zone?.toLowerCase().includes(q) ?? false) ||
        (p.category?.toLowerCase().includes(q) ?? false) ||
        p.amenities?.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortOption === 'price-asc') {
      list.sort((a, b) => (a?.pricePerNight ?? 0) - (b?.pricePerNight ?? 0));
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => (b?.pricePerNight ?? 0) - (a?.pricePerNight ?? 0));
    } else if (sortOption === 'rating-desc') {
      list.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
    }

    return list;
  }, [rawAccommodations, selectedPills, searchQuery, sortOption]);

  const resetFilters = useCallback(() => {
    setSelectedPills(['all']);
    setSearchQuery('');
    setSortOption('recommended');
  }, []);

  const openMap = useCallback(() => setIsMapOpen(true), []);
  const closeMap = useCallback(() => setIsMapOpen(false), []);

  return {
    searchQuery,
    setSearchQuery,
    selectedPills,
    setSelectedPills,
    togglePill,
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
    resetFilters,
  };
}
