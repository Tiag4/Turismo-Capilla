import React from 'react';
import { Modal } from '../ui/Modal.tsx';
import { AccommodationForm } from './AccommodationForm.tsx';
import type { Accommodation, CreateAccommodationDto } from '../../types/accommodation.types.ts';

export interface AccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accommodation: Accommodation | null;
  onSubmit: (dto: CreateAccommodationDto) => Promise<void>;
  isLoading: boolean;
}

export const AccommodationModal: React.FC<AccommodationModalProps> = ({
  isOpen,
  onClose,
  accommodation,
  onSubmit,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={accommodation ? 'Editar Alojamiento' : 'Registrar Nuevo Alojamiento'}
      subtitle="Datos visibles en el portal turístico oficial de Capilla del Monte"
      maxWidth="xl"
    >
      <AccommodationForm
        initialData={accommodation}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};
