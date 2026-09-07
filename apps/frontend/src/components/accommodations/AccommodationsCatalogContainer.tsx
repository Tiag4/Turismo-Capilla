import React from 'react';
import { useAccommodationsFilter } from './hooks/useAccommodationsFilter';
import { AccommodationsHeader } from './components/AccommodationsHeader';
import { AccommodationsFilterPills } from './components/AccommodationsFilterPills';
import { AccommodationCard } from './components/AccommodationCard';
import { AccommodationsEmptyState } from './components/AccommodationsEmptyState';
import { AccommodationsMapModal } from './components/AccommodationsMapModal';
import { FloatingMapTrigger } from './components/FloatingMapTrigger';

export const AccommodationsCatalogContainer: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedPills,
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
    totalCount,
    resetFilters,
  } = useAccommodationsFilter();

  return (
    <div className="space-y-8">
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

      {/* Píldoras de Filtro Rápido Multi-selección y Selector de Orden Custom */}
      <AccommodationsFilterPills
        selectedPills={selectedPills}
        onTogglePill={togglePill}
        sortOption={sortOption}
        onSortChange={setSortOption}
        totalCount={totalCount}
      />

      {/* Grilla Expansiva de 3 Columnas (Opción 2: Desktop Wide) */}
      {totalCount > 0 ? (
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

      {/* Modal Drawer con Mapa Interactivo (Carga defensiva bajo demanda) */}
      {isMapOpen && <AccommodationsMapModal isOpen={isMapOpen} onClose={closeMap} />}
    </div>
  );
};
