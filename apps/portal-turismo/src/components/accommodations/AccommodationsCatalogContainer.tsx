import React from 'react';
import { useAccommodationsFilter } from './hooks/useAccommodationsFilter';
import { AccommodationsHeader } from './components/AccommodationsHeader';
import { AccommodationsTypeTabs } from './components/AccommodationsTypeTabs';
import { AccommodationsFilterPills } from './components/AccommodationsFilterPills';
import { AccommodationCard } from './components/AccommodationCard';
import { AccommodationsEmptyState } from './components/AccommodationsEmptyState';
import { AccommodationsMapModal } from './components/AccommodationsMapModal';
import { FloatingMapTrigger } from './components/FloatingMapTrigger';

export const AccommodationsCatalogContainer: React.FC = () => {
  const {
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
    totalCount,
    isLoading,
    resetFilters,
  } = useAccommodationsFilter();

  return (
    <div className="space-y-6">
      {/* Cabecera y Buscador Cápsula */}
      <AccommodationsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        checkIn={checkIn}
        onCheckInChange={setCheckIn}
        checkOut={checkOut}
        onCheckOutChange={setCheckOut}
        guests={guests}
        onGuestsChange={setGuests}
        nightsCount={nightsCount}
      />

      {/* Selector de Categorías / Tipos de Alojamiento */}
      <AccommodationsTypeTabs
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      {/* Píldoras de Comodidades y Selector de Orden */}
      <AccommodationsFilterPills
        selectedAmenities={selectedAmenities}
        onToggleAmenity={toggleAmenity}
        sortOption={sortOption}
        onSortChange={setSortOption}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Grilla de Alojamientos Adheridos */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-sand-200/50 animate-pulse border border-sand-200" />
          ))}
        </div>
      ) : totalCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-2">
          {filteredAccommodations.map((place) => (
            <AccommodationCard
              key={place.id}
              place={place}
              nightsCount={nightsCount}
            />
          ))}
        </div>
      ) : (
        <AccommodationsEmptyState onResetFilters={resetFilters} />
      )}

      {/* Botón Flotante para Abrir Mapa */}
      <FloatingMapTrigger totalCount={totalCount} onOpenMap={openMap} />

      {/* Modal Drawer con Mapa Interactivo */}
      {isMapOpen && <AccommodationsMapModal isOpen={isMapOpen} onClose={closeMap} />}
    </div>
  );
};
