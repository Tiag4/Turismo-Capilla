import React from 'react';
import { CustomSelect, type CustomSelectOption } from './CustomSelect.tsx';

export type SelectOption = CustomSelectOption;

export type SelectChangeEvent = string & {
  target: { value: string; name?: string };
  currentTarget: { value: string; name?: string };
  value: string;
};

class SelectValueEvent extends String {
  target: { value: string; name?: string };
  currentTarget: { value: string; name?: string };
  value: string;

  constructor(val: string, name?: string) {
    super(val);
    this.value = val;
    this.target = { value: val, name };
    this.currentTarget = { value: val, name };
  }
}

export interface SelectProps {
  label?: string;
  value?: string | number;
  onChange?: (e: SelectChangeEvent) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  name?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  helperText,
  className = '',
  disabled = false,
  name,
}) => {
  const handleChange = (val: string) => {
    if (!onChange) return;
    const event = new SelectValueEvent(val, name) as unknown as SelectChangeEvent;
    onChange(event);
  };

  return (
    <CustomSelect
      label={label}
      value={value !== undefined ? String(value) : ''}
      onChange={handleChange}
      options={options}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      className={className}
      disabled={disabled}
    />
  );
};
