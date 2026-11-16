import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  helperText?: string;
  size?: 'sm' | 'md';
}

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  label,
  value,
  onChange,
  helperText,
  size = 'md',
}) => {
  const [hovered, setHovered] = useState(0);
  const activeValue = hovered || value;
  const starSize = size === 'sm' ? 'w-5 h-5' : 'w-7 h-7';

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-bold uppercase tracking-wider text-sand-600">
        {label}
      </legend>
      <div className="flex items-center gap-1.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onFocus={() => setHovered(star)}
            onBlur={() => setHovered(0)}
            className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            <Star
              className={`${starSize} transition-colors ${
                star <= activeValue
                  ? 'fill-amber-500 text-amber-500'
                  : 'fill-transparent text-sand-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-xs font-bold text-sand-700">
          {activeValue} / 5
        </span>
      </div>
      {helperText && <p className="text-[11px] text-sand-500">{helperText}</p>}
    </fieldset>
  );
};
