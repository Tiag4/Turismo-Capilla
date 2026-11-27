import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSmartFloating } from '../useSmartFloating';
import { useAnimatedPresence } from '../../../hooks/useAnimatedPresence';
import type { DateRangePickerProps, FocusedRangeInput } from './types';
import { useDateRangePicker } from './useDateRangePicker';
import { DateRangePickerTrigger } from './DateRangePickerTrigger';
import { DateRangePickerPopover } from './DateRangePickerPopover';

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
  minDate,
  minNights = 1,
  blockedRanges = [],
  className = '',
  preferredPlacement = 'bottom',
  checkInLabel = 'Llegada',
  checkOutLabel = 'Salida',
  checkInPlaceholder = 'Seleccionar',
  checkOutPlaceholder = 'Seleccionar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const picker = useDateRangePicker({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange,
    minDate,
    minNights,
    blockedRanges,
    isOpen,
    onClose: handleClose,
  });

  const { shouldRender, isVisible } = useAnimatedPresence(isOpen, 160);

  const { triggerRef, popoverRef, coords } = useSmartFloating({
    isOpen,
    onClose: handleClose,
    preferredPlacement,
    estimatedHeight: 430,
    estimatedWidth: 640,
  });

  // Combine triggerContainerRef with triggerRef
  const setTriggerRefs = useCallback(
    (el: HTMLDivElement | null) => {
      triggerContainerRef.current = el;
      if (el) {
        // cast to HTMLButtonElement compatible ref for useSmartFloating triggerRef
        triggerRef.current = el as unknown as HTMLButtonElement;
      } else {
        triggerRef.current = null;
      }
    },
    [triggerRef]
  );

  const handleOpen = useCallback(
    (focus: FocusedRangeInput) => {
      picker.setFocusedInput(focus);
      setIsOpen(true);
    },
    [picker]
  );

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger visual sincronizado */}
      <DateRangePickerTrigger
        ref={setTriggerRefs}
        checkIn={checkIn}
        checkOut={checkOut}
        isOpen={isOpen}
        focusedInput={picker.focusedInput}
        onOpen={handleOpen}
        checkInLabel={checkInLabel}
        checkOutLabel={checkOutLabel}
        checkInPlaceholder={checkInPlaceholder}
        checkOutPlaceholder={checkOutPlaceholder}
        nightsCount={picker.nightsCount}
      />

      {/* Popover / Modal Flotante */}
      {shouldRender &&
        isMounted &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <DateRangePickerPopover
            ref={popoverRef}
            isOpen={isOpen}
            isVisible={isVisible}
            coords={coords}
            checkIn={checkIn}
            checkOut={checkOut}
            focusedInput={picker.focusedInput}
            hoverDate={picker.hoverDate}
            setHoverDate={picker.setHoverDate}
            viewYear={picker.viewYear}
            viewMonth={picker.viewMonth}
            secondMonthYear={picker.secondMonthYear}
            secondMonth={picker.secondMonth}
            canGoPrev={picker.canGoPrev}
            onPrevMonth={picker.handlePrevMonth}
            onNextMonth={picker.handleNextMonth}
            isDateDisabled={picker.isDateDisabled}
            onSelectDate={picker.handleSelectDate}
            onClearDates={picker.clearDates}
            nightsCount={picker.nightsCount}
            minNights={minNights}
            onClose={handleClose}
          />,
          document.body
        )}
    </div>
  );
};
