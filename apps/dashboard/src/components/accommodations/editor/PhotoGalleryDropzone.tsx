import React, { useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';
import type { AccommodationImage } from '../../../types/accommodation.types.ts';
import { SortablePhotoItem } from './SortablePhotoItem.tsx';

export interface PhotoGalleryDropzoneProps {
  images: AccommodationImage[];
  onChange: (images: AccommodationImage[]) => void;
  maxImages?: number;
}

export const PhotoGalleryDropzone: React.FC<PhotoGalleryDropzoneProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const reordered = arrayMove(images, oldIndex, newIndex);

      // Si no hay imagen de portada definida, asignamos la primera
      const hasMain = reordered.some((img) => img.isMain);
      if (!hasMain && reordered.length > 0) {
        reordered[0].isMain = true;
      }

      onChange(reordered);
    }
  };

  const processFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Solo se admiten archivos de imagen (JPG, PNG, WebP).');
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg('Cada imagen debe pesar menos de 8 MB.');
        continue;
      }
      validFiles.push(file);
    }

    if (images.length + validFiles.length > maxImages) {
      setErrorMsg(`El cupo máximo es de ${maxImages} fotografías por establecimiento.`);
      validFiles.splice(maxImages - images.length);
    }

    if (validFiles.length === 0) return;

    const newImages: AccommodationImage[] = [];
    let completed = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          newImages.push({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: result,
            isMain: images.length === 0 && newImages.length === 0,
          });
        }
        completed++;
        if (completed === validFiles.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleSetMain = (targetId: string) => {
    const updated = images.map((img) => ({
      ...img,
      isMain: img.id === targetId,
    }));
    onChange(updated);
  };

  const handleRemove = (targetId: string) => {
    const remaining = images.filter((img) => img.id !== targetId);
    if (remaining.length > 0 && !remaining.some((img) => img.isMain)) {
      remaining[0].isMain = true;
    }
    onChange(remaining);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header and description */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-[var(--color-sand-800)] block">
            Galería fotográfica ({images.length}/{maxImages})
          </label>
          <span className="text-xs text-[var(--color-sand-500)]">
            Cargá imágenes reales y arrastralas para ordenar su presentación en el portal. La primera será la portada.
          </span>
        </div>
      </div>

      {/* Upload Dropzone (No URL input) */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragOver
              ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)]'
              : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-400)] bg-[var(--color-sand-50)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
          />
          <UploadCloud className="w-9 h-9 text-[var(--color-terracotta-500)] mb-2" />
          <span className="text-xs font-semibold text-[var(--color-sand-900)]">
            Arrastrá y soltá imágenes acá, o{' '}
            <span className="text-[var(--color-terracotta-600)] underline">examiná tus archivos</span>
          </span>
          <span className="text-[11px] text-[var(--color-sand-400)] mt-1">
            Archivos JPG, PNG o WebP de hasta 8 MB por fotografía
          </span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sortable Photo Grid */}
      {images.length === 0 ? (
        <div className="p-8 border border-[var(--color-sand-200)] rounded-2xl bg-white text-center flex flex-col items-center justify-center gap-1.5 text-xs text-[var(--color-sand-400)]">
          <ImageIcon className="w-6 h-6 text-[var(--color-sand-300)]" />
          <span>Aún no cargaste fotografías para este establecimiento</span>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
              {images.map((img, index) => (
                <SortablePhotoItem
                  key={img.id}
                  id={img.id}
                  url={img.url}
                  index={index}
                  isMain={img.isMain}
                  onSetMain={handleSetMain}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
