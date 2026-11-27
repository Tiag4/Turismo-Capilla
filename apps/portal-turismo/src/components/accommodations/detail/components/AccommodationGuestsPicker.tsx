import React from 'react';
import { GuestsPicker, type GuestsSelection } from '../../../ui/GuestsPicker';

export type { GuestsSelection };

interface AccommodationGuestsPickerProps {
  value: GuestsSelection;
  onChange: (val: GuestsSelection) => void;
}

export const AccommodationGuestsPicker: React.FC<AccommodationGuestsPickerProps> = ({ value, onChange }) => {
  return (
    <GuestsPicker
      value={value}
      onChange={onChange}
      label="Ocupación"
      variant="compact"
      showRooms={true}
      showChildAges={true}
    />
  );
};
