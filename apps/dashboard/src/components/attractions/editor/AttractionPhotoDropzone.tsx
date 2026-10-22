import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Star, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';

export interface AttractionPhotoDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export const AttractionPhotoDropzone: React.FC<AttractionPhotoDropzoneProps> = ({
  images,
  onChange,
  maxImages = 8,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (files: FileList | File[]) => {
    setErrorMsg(null);
    const remaining = maxImages - images.length;
    if (remaining <= 0) return setErrorMsg(`Límite máximo alcanzado (${maxImages} fotos).`);

    const validFiles = Array.from(files).slice(0, remaining).filter((f) => {
      if (!f.type.startsWith('image/')) { setErrorMsg('Solo imágenes (JPG, PNG, WebP).'); return false; }
      if (f.size > 5 * 1024 * 1024) { setErrorMsg(`"${f.name}" supera 5 MB.`); return false; }
      return true;
    });

    if (!validFiles.length) return;
    let done = 0;
    const batch: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) batch.push(e.target.result as string);
        if (++done === validFiles.length) onChange([...images, ...batch]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    onChange([images[index], ...images.filter((_, i) => i !== index)]);
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
            isDragOver ? 'border-emerald-600 bg-emerald-50/50 scale-[1.01]' : 'border-sand-300 hover:border-emerald-600 hover:bg-sand-50/60 bg-white'
          }`}
        >
          <div className="p-3 rounded-full bg-sand-100 text-emerald-700">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-sand-900">
              Arrastrá las fotos aquí o <span className="text-emerald-700 underline">buscalas en tu equipo</span>
            </p>
            <p className="text-[11px] text-sand-500">
              JPG, PNG o WebP (hasta 5 MB por archivo · máximo {maxImages} fotos)
            </p>
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {images.map((url, idx) => (
            <div
              key={idx}
              className={`relative group rounded-xl overflow-hidden border aspect-video bg-sand-100 shadow-xs ${
                idx === 0 ? 'border-emerald-600 ring-2 ring-emerald-600/30' : 'border-sand-200'
              }`}
            >
              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-md shadow-xs">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Portada</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                {idx !== 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSetMain(idx); }}
                    className="text-[10px] py-1 px-2 h-auto bg-white/90 text-sand-800 hover:bg-white font-bold"
                  >
                    Portada
                  </Button>
                )}
                <button
                  type="button"
                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); onChange(images.filter((_, i) => i !== idx)); }}
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
        <div className="p-6 text-center border border-sand-200 rounded-xl bg-sand-50/50 text-sand-400 text-xs">
          <ImageIcon className="w-5 h-5 mx-auto mb-1 text-sand-300" />
          <span>No hay fotografías cargadas aún. Subí al menos una foto para exhibir en el portal.</span>
        </div>
      )}
    </div>
  );
};
