import React, { useEffect, useRef, useState } from 'react';
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
import { UploadCloud, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import type { AccommodationImage } from '../../../types/accommodation.types.ts';
import { mediaService } from '../../../services/media.service.ts';
import { SortablePhotoItem } from './SortablePhotoItem.tsx';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface PendingUpload {
  id: string;
  fileName: string;
  status: 'uploading' | 'error';
  error?: string;
}

export interface PhotoGalleryDropzoneProps {
  images: AccommodationImage[];
  onChange: (images: AccommodationImage[]) => void;
  maxImages?: number;
  onUploadingChange?: (isUploading: boolean) => void;
}

export const PhotoGalleryDropzone: React.FC<PhotoGalleryDropzoneProps> = ({
  images,
  onChange,
  maxImages = 10,
  onUploadingChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const isUploading = pendingUploads.some((item) => item.status === 'uploading');

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

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

  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const pendingId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setPendingUploads((prev) => [
        ...prev,
        { id: pendingId, fileName: file.name, status: 'uploading' },
      ]);

      try {
        const uploaded = await mediaService.uploadImage(file);
        const current = imagesRef.current;
        const nextImage: AccommodationImage = {
          id: uploaded.publicId || `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: uploaded.url,
          publicId: uploaded.publicId,
          isMain: current.length === 0 || !current.some((img) => img.isMain),
        };

        imagesRef.current = [...current, nextImage];
        onChange(imagesRef.current);
        setPendingUploads((prev) => prev.filter((item) => item.id !== pendingId));
      } catch (err: any) {
        setPendingUploads((prev) =>
          prev.map((item) =>
            item.id === pendingId
              ? {
                  ...item,
                  status: 'error',
                  error: err?.message || 'No se pudo subir la imagen al almacenamiento.',
                }
              : item
          )
        );
      }
    }
  };

  const processFiles = (files: FileList | File[]) => {
    setErrorMsg(null);

    const pendingCount = pendingUploads.filter((item) => item.status === 'uploading').length;
    let availableSlots = maxImages - images.length - pendingCount;
    const accepted: File[] = [];
    const validationErrors: string[] = [];

    for (const file of Array.from(files)) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        validationErrors.push(`"${file.name}" no es un formato válido. Usá JPG, PNG o WebP.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        validationErrors.push(`"${file.name}" supera el límite de 5 MB.`);
        continue;
      }
      if (availableSlots <= 0) {
        validationErrors.push(`El cupo máximo es de ${maxImages} fotografías por establecimiento.`);
        break;
      }
      accepted.push(file);
      availableSlots -= 1;
    }

    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors.join(' '));
    }
    if (accepted.length > 0) {
      void uploadFiles(accepted);
    }
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
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Subir fotografías del alojamiento"
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
            Archivos JPG, PNG o WebP de hasta 5 MB por fotografía
          </span>
        </div>
      )}

      {errorMsg && (
        <div role="alert" className="flex items-start gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Per-file upload status (flat list, no upload yet = not in gallery) */}
      {pendingUploads.length > 0 && (
        <ul
          aria-live="polite"
          aria-busy={isUploading}
          className="divide-y divide-[var(--color-sand-200)] border-y border-[var(--color-sand-200)]"
        >
          {pendingUploads.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="truncate text-[var(--color-sand-700)]">{item.fileName}</span>
              {item.status === 'uploading' ? (
                <span className="flex items-center gap-1.5 shrink-0 text-[var(--color-sand-500)]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo…</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 shrink-0 text-rose-700 max-w-[65%]">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate" title={item.error}>
                    {item.error}
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
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
