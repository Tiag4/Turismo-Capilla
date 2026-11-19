import React, { useRef, useState } from 'react';
import { UploadCloud, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { mediaService } from '../../services/media.service';

export interface CircuitPhotoDropzoneProps {
  imageUrl: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export const CircuitPhotoDropzone: React.FC<CircuitPhotoDropzoneProps> = ({
  imageUrl,
  onChange,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Solo se admiten archivos de imagen (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('La fotografía no debe superar los 5 MB.');
      return;
    }

    setIsUploading(true);
    try {
      const result = await mediaService.uploadImage(file, 'portal/circuits');
      if (!result?.url) {
        setErrorMsg('No se recibió la URL de Cloudinary.');
        return;
      }
      onChange(result.url);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al subir la fotografía a Cloudinary.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadFile(file);
          e.target.value = '';
        }}
      />

      {imageUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[var(--color-sand-200)] bg-[var(--color-sand-100)] max-w-xl aspect-16/9">
          <img
            src={imageUrl}
            alt="Fotografía del circuito"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[var(--color-sand-900)] text-xs font-bold hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'Subiendo...' : 'Cambiar fotografía'}</span>
            </button>
            <button
              type="button"
              disabled={disabled || isUploading}
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Quitar</span>
            </button>
          </div>
        </div>
      ) : (
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
            const file = e.dataTransfer.files?.[0];
            if (file) void uploadFile(file);
          }}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`max-w-xl rounded-2xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-[var(--color-terracotta-500)] bg-[var(--color-sand-100)]'
              : 'border-[var(--color-sand-300)] hover:border-[var(--color-sand-500)] bg-[var(--color-sand-50)]'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-[var(--color-terracotta-600)] animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-[var(--color-terracotta-600)]" />
            )}
            <p className="text-sm font-bold text-[var(--color-sand-900)]">
              {isUploading ? 'Subiendo fotografía a Cloudinary...' : 'Arrastrá una fotografía o hacé clic para subir'}
            </p>
            <p className="text-xs text-[var(--color-sand-500)]">
              JPG, PNG o WebP hasta 5 MB. Se almacena automáticamente en Cloudinary.
            </p>
          </div>
        </div>
      )}

      {errorMsg && <p className="text-xs font-semibold text-rose-700">{errorMsg}</p>}
    </div>
  );
};
