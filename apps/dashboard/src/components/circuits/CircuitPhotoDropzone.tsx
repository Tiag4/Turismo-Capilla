import React, { useRef, useState } from 'react';
import { UploadCloud, Trash2, Star, Loader2, AlertCircle } from 'lucide-react';
import { mediaService } from '../../services/media.service';

export interface CircuitPhotoDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export const CircuitPhotoDropzone: React.FC<CircuitPhotoDropzoneProps> = ({
  images,
  onChange,
  maxImages = 8,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      setErrorMsg(`Límite máximo alcanzado (${maxImages} fotografías).`);
      return;
    }

    const validFiles = Array.from(files)
      .slice(0, remaining)
      .filter((f) => {
        if (!f.type.startsWith('image/')) {
          setErrorMsg('Solo se admiten imágenes (JPG, PNG, WebP).');
          return false;
        }
        if (f.size > 5 * 1024 * 1024) {
          setErrorMsg(`"${f.name}" supera el límite de 5 MB.`);
          return false;
        }
        return true;
      });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of validFiles) {
        const res = await mediaService.uploadImage(file, 'portal/circuits');
        if (res?.url) uploadedUrls.push(res.url);
      }
      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      } else {
        setErrorMsg('No se pudo obtener la URL de Cloudinary.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al subir fotografías a Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    onChange([images[index], ...images.filter((_, i) => i !== index)]);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          if (e.target.files?.length) void uploadFiles(e.target.files);
          e.target.value = '';
        }}
      />

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-16/10 rounded-xl overflow-hidden border border-[var(--color-sand-200)] bg-[var(--color-sand-100)]"
            >
              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-terracotta-600)] text-white">
                  Portada
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(idx)}
                    title="Marcar como portada"
                    className="p-1.5 rounded-lg bg-white text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Eliminar fotografía"
                  className="p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isUploading) setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (disabled || isUploading) return;
            if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
          }}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-[var(--color-terracotta-500)] bg-[var(--color-sand-100)]'
              : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-500)] bg-[var(--color-sand-50)]'
          }`}
        >
          <div className="flex flex-col items-center gap-1.5">
            {isUploading ? (
              <Loader2 className="w-7 h-7 text-[var(--color-terracotta-600)] animate-spin" />
            ) : (
              <UploadCloud className="w-7 h-7 text-[var(--color-terracotta-600)]" />
            )}
            <p className="text-xs sm:text-sm font-bold text-[var(--color-sand-900)]">
              {isUploading
                ? 'Subiendo fotografías a Cloudinary...'
                : `Agregar fotografías (${images.length}/${maxImages})`}
            </p>
            <p className="text-[11px] text-[var(--color-sand-500)]">
              Podés seleccionar múltiples imágenes JPG, PNG o WebP (máx. 5 MB c/u). La primera será la portada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
