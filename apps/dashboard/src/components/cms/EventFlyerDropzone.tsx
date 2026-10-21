import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';

export interface EventFlyerDropzoneProps {
  imageUrl: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export const EventFlyerDropzone: React.FC<EventFlyerDropzoneProps> = ({
  imageUrl,
  onChange,
  onRemove,
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Solo se admiten archivos de imagen (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('El flyer no debe superar los 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Ocurrió un error al leer el archivo seleccionado.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
      />

      {imageUrl ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[var(--color-sand-200)] bg-[var(--color-sand-100)] max-w-lg aspect-16/9 shadow-2xs">
          <img
            src={imageUrl}
            alt="Flyer del evento"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-[var(--color-sand-900)] text-xs font-bold rounded-lg shadow-sm hover:bg-[var(--color-sand-100)] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Cambiar imagen</span>
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-rose-700 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Quitar</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragOver
              ? 'border-[var(--color-terracotta-500)] bg-orange-50/50'
              : 'border-[var(--color-sand-300)] bg-white hover:bg-[var(--color-sand-50)]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="w-12 h-12 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-terracotta-600)] flex items-center justify-center mb-3">
            {isDragOver ? <UploadCloud className="w-6 h-6 animate-bounce" /> : <ImageIcon className="w-6 h-6" />}
          </div>
          <p className="text-xs font-bold text-[var(--color-sand-800)] text-center">
            Hacé clic o arrastrá el flyer del evento aquí
          </p>
          <p className="text-[11px] text-[var(--color-sand-500)] mt-1 text-center">
            Formatos admitidos: JPG, PNG, WebP (máximo 5 MB)
          </p>
        </div>
      )}

      {errorMsg && (
        <p className="text-xs font-semibold text-rose-600 mt-1">{errorMsg}</p>
      )}
    </div>
  );
};
