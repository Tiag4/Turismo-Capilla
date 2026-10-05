import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Star } from 'lucide-react';

export interface SortablePhotoItemProps {
  id: string;
  url: string;
  index: number;
  isMain: boolean;
  onSetMain: (id: string) => void;
  onRemove: (id: string) => void;
}

export const SortablePhotoItem: React.FC<SortablePhotoItemProps> = ({
  id,
  url,
  index,
  isMain,
  onSetMain,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all shadow-xs flex flex-col ${
        isMain
          ? 'border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-500)]/20'
          : 'border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)]'
      }`}
    >
      {/* Image Preview with Drag Handle */}
      <div className="relative aspect-4/3 w-full bg-[var(--color-sand-100)] overflow-hidden">
        <img
          src={url}
          alt={`Fotografía ${index + 1}`}
          className="w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Drag Handle Overlay */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Arrastrar para reordenar foto"
          className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white cursor-grab active:cursor-grabbing transition-colors shadow-xs"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        {/* Index Pill */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono font-bold">
          #{index + 1}
        </div>

        {/* Cover Badge */}
        {isMain && (
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-[var(--color-terracotta-500)] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-current" />
            <span>Foto de Portada</span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="p-2.5 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-between text-xs">
        {!isMain ? (
          <button
            type="button"
            onClick={() => onSetMain(id)}
            className="text-[11px] font-semibold text-[var(--color-sand-700)] hover:text-[var(--color-terracotta-600)] transition-colors cursor-pointer"
          >
            Establecer portada
          </button>
        ) : (
          <span className="text-[11px] font-bold text-[var(--color-terracotta-600)]">
            Portada activa
          </span>
        )}

        <button
          type="button"
          onClick={() => onRemove(id)}
          title="Eliminar fotografía"
          className="p-1 rounded-md text-[var(--color-sand-500)] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
