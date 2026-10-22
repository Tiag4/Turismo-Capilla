import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Star, AlertCircle } from 'lucide-react';
import type { AccommodationImage } from '../../types/accommodation.types.ts';
import { Button } from '../ui/Button.tsx';

export interface ImageGalleryUploaderProps {
  images: AccommodationImage[];
  onChange: (images: AccommodationImage[]) => void;
  maxImages?: number;
}

export const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const remaining = maxImages - images.length;
    if (remaining <= 0) return setErrorMsg(`Límite máximo alcanzado (${maxImages} fotos).`);

    const validFiles = Array.from(files).slice(0, remaining).filter((f) => {
      if (!f.type.startsWith('image/')) { setErrorMsg('Solo se admiten imágenes (JPG, PNG, WebP).'); return false; }
      if (f.size > 8 * 1024 * 1024) { setErrorMsg(`"${f.name}" supera el límite de 8 MB.`); return false; }
      return true;
    });

    if (!validFiles.length) return;
    let done = 0;
    const batch: AccommodationImage[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          batch.push({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url: e.target.result as string,
            isMain: images.length === 0 && batch.length === 0,
          });
        }
        if (++done === validFiles.length) {
          onChange([...images, ...batch]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleSetMain = (targetId: string) => {
    onChange(images.map((img) => ({ ...img, isMain: img.id === targetId })));
  };

  const handleRemove = (targetId: string) => {
    const remaining = images.filter((img) => img.id !== targetId);
    if (remaining.length > 0 && !remaining.some((img) => img.isMain)) {
      remaining[0].isMain = true;
    }
    onChange(remaining);
  };

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) { handleFiles(e.target.files); e.target.value = ''; }
        }}
      />

      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
            isDragOver ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)]/50 scale-[1.01]' : 'border-[var(--color-sand-300)] hover:border-[var(--color-terracotta-500)] hover:bg-[var(--color-sand-50)]/60 bg-white'
          }`}
        >
          <div className="p-3 rounded-full bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)]">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-[var(--color-sand-900)]">
              Arrastrá las fotos aquí o <span className="text-[var(--color-terracotta-600)] underline">buscalas en tu equipo</span>
            </p>
            <p className="text-[11px] text-[var(--color-sand-500)]">
              JPG, PNG o WebP (hasta 8 MB por archivo · máximo {maxImages} fotos)
            </p>
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-xl overflow-hidden border aspect-video bg-[var(--color-sand-100)] shadow-xs ${
                img.isMain ? 'border-2 border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-100)]' : 'border-[var(--color-sand-200)]'
              }`}
            >
              <img src={img.url} alt="Foto de cabaña" className="w-full h-full object-cover" />
              {img.isMain && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-[var(--color-terracotta-600)] text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Portada</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                {!img.isMain && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleSetMain(img.id); }}
                    className="text-[10px] py-1 px-2 h-auto bg-white/90 text-[var(--color-sand-800)] hover:bg-white font-bold"
                  >
                    Portada
                  </Button>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(img.id); }}
                  className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
                  title="Eliminar foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center border border-[var(--color-sand-200)] rounded-xl bg-[var(--color-sand-50)]/50 text-[var(--color-sand-400)] text-xs">
          <ImageIcon className="w-5 h-5 mx-auto mb-1 text-[var(--color-sand-300)]" />
          <span>No hay fotografías cargadas aún. Subí al menos una foto para exhibir las instalaciones.</span>
        </div>
      )}
    </div>
  );
};
