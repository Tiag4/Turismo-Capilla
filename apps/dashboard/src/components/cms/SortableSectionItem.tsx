import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';
import type { HomeSectionItem } from '../../types/portalConfig.types';

interface SortableSectionItemProps {
  section: HomeSectionItem;
  index: number;
  isVisible: boolean;
  isSelected: boolean;
  onToggleVisibility: (id: string) => void;
  onSelect: (id: string) => void;
}

export const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  index,
  isVisible,
  isSelected,
  onToggleVisibility,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all select-none ${
        isSelected
          ? 'bg-white border-[var(--color-terracotta-500)] shadow-md ring-2 ring-[var(--color-terracotta-200)]'
          : isVisible
          ? 'bg-white border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)] shadow-2xs'
          : 'bg-[var(--color-sand-100)] border-dashed border-[var(--color-sand-300)] opacity-60'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* Grip Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reordenar ${section.name}`}
          className="p-1 text-[var(--color-sand-400)] hover:text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] rounded-md cursor-grab active:cursor-grabbing shrink-0 transition-colors"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        {/* Index badge */}
        <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[var(--color-sand-100)] text-[var(--color-sand-600)] text-[10px] font-bold shrink-0">
          {index + 1}
        </span>

        {/* Info */}
        <button
          type="button"
          onClick={() => onSelect(section.id)}
          className="text-left min-w-0 flex-1 cursor-pointer"
        >
          <p className="text-xs font-bold text-[var(--color-sand-900)] truncate">
            {section.name}
          </p>
          <p className="text-[11px] text-[var(--color-sand-500)] truncate">
            {section.description}
          </p>
        </button>
      </div>

      {/* Visibility Toggle Switch */}
      <div className="flex items-center gap-1.5 pl-2 shrink-0">
        <button
          type="button"
          onClick={() => onToggleVisibility(section.id)}
          title={isVisible ? 'Ocultar sección en el portal' : 'Mostrar sección en el portal'}
          className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isVisible
              ? 'text-[var(--color-emerald-portal-600)] hover:bg-emerald-50'
              : 'text-[var(--color-sand-400)] hover:text-[var(--color-sand-700)] hover:bg-[var(--color-sand-200)]'
          }`}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
