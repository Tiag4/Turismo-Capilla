import React, { useState } from 'react';
import { Star, Trash2, Plus, Image as ImageIcon, AlertTriangle, Check } from 'lucide-react';
import type { AccommodationImage } from '../../types/accommodation.types.ts';
import { Button } from '../ui/Button.tsx';
import { Modal } from '../ui/Modal.tsx';

export interface ImageGalleryUploaderProps {
  images: AccommodationImage[];
  onChange: (images: AccommodationImage[]) => void;
  maxImages?: number;
}

const SERRANO_PHOTO_PRESETS = [
  {
    label: 'Exterior & Cerro Uritorco',
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Interior con hogar a leña',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Deck serrano & Atardecer',
    url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Piscina & Solarium',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
  },
];

export const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<AccommodationImage | null>(null);

  const handleAddImage = (urlToAdd?: string) => {
    const targetUrl = (urlToAdd || newImageUrl).trim();

    if (!targetUrl) {
      setUrlError('Ingresá una URL de imagen válida');
      return;
    }

    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      setUrlError('La URL debe comenzar con http:// o https://');
      return;
    }

    if (images.some((img) => img.url === targetUrl)) {
      setUrlError('Esta fotografía ya está presente en la galería');
      return;
    }

    if (images.length >= maxImages) {
      setUrlError(`Límite alcanzado (máximo ${maxImages} fotos)`);
      return;
    }

    const newImage: AccommodationImage = {
      id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: targetUrl,
      isMain: images.length === 0, // Primera imagen es principal por defecto
    };

    onChange([...images, newImage]);
    setNewImageUrl('');
    setUrlError(null);
  };

  const handleSetMain = (targetId: string) => {
    const updated = images.map((img) => ({
      ...img,
      isMain: img.id === targetId,
    }));
    onChange(updated);
  };

  const handleConfirmDelete = () => {
    if (!imageToDelete) return;

    const remaining = images.filter((img) => img.id !== imageToDelete.id);

    // Si borramos la portada y aún quedan fotos, reasignamos la primera como principal
    if (imageToDelete.isMain && remaining.length > 0) {
      remaining[0].isMain = true;
    }

    onChange(remaining);
    setImageToDelete(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header and counter */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)] block">
            Galería Fotográfica ({images.length}/{maxImages})
          </label>
          <span className="text-xs text-[var(--color-sand-400)]">
            Elegí la foto de portada que verán los turistas en las tarjetas de búsqueda.
          </span>
        </div>
      </div>

      {/* Add photo input row */}
      <div className="flex flex-col gap-2 p-3.5 bg-[var(--color-sand-50)] rounded-2xl border border-[var(--color-sand-200)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="Pegar URL de foto (ej. https://...)"
              value={newImageUrl}
              onChange={(e) => {
                setNewImageUrl(e.target.value);
                if (urlError) setUrlError(null);
              }}
              className={`w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-[var(--color-sand-900)] focus:outline-none ${
                urlError
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-[var(--color-sand-300)] focus:border-[var(--color-terracotta-500)]'
              }`}
            />
          </div>
          <Button
            type="button"
            variant="terracotta"
            size="sm"
            onClick={() => handleAddImage()}
            disabled={images.length >= maxImages}
            className="shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Foto</span>
          </Button>
        </div>

        {urlError && (
          <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{urlError}</span>
          </p>
        )}

        {/* Quick presets for testing */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-[var(--color-sand-200)]">
          <span className="text-[11px] font-semibold text-[var(--color-sand-400)]">
            Fotos sugeridas:
          </span>
          {SERRANO_PHOTO_PRESETS.map((preset) => {
            const isAlreadyAdded = images.some((img) => img.url === preset.url);
            return (
              <button
                key={preset.label}
                type="button"
                disabled={isAlreadyAdded || images.length >= maxImages}
                onClick={() => handleAddImage(preset.url)}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors cursor-pointer ${
                  isAlreadyAdded
                    ? 'border-[var(--color-sand-200)] bg-[var(--color-sand-100)] text-[var(--color-sand-400)] cursor-not-allowed'
                    : 'border-[var(--color-sand-300)] bg-white text-[var(--color-sand-800)] hover:border-[var(--color-terracotta-500)] hover:text-[var(--color-terracotta-600)]'
                }`}
              >
                + {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-[var(--color-sand-300)] flex flex-col items-center gap-2">
          <ImageIcon className="w-8 h-8 text-[var(--color-sand-400)]" />
          <p className="text-sm font-medium text-[var(--color-sand-800)]">
            No hay fotografías cargadas aún
          </p>
          <p className="text-xs text-[var(--color-sand-400)] max-w-sm">
            Agregá al menos una foto representativa para que los huéspedes puedan conocer las instalaciones.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((img) => {
            return (
              <div
                key={img.id}
                className={`group relative rounded-xl overflow-hidden border bg-white flex flex-col transition-all ${
                  img.isMain
                    ? 'border-2 border-[var(--color-terracotta-500)] ring-2 ring-[var(--color-terracotta-100)]'
                    : 'border-[var(--color-sand-200)] hover:border-[var(--color-sand-300)]'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full bg-[var(--color-sand-100)] overflow-hidden">
                  <img
                    src={img.url}
                    alt="Foto del alojamiento"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Main Badge */}
                  {img.isMain && (
                    <div className="absolute top-2 left-2">
                      <span className="bg-[var(--color-terracotta-500)] text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-white" />
                        Portada Principal
                      </span>
                    </div>
                  )}

                  {/* Top-right delete button */}
                  <button
                    type="button"
                    onClick={() => setImageToDelete(img)}
                    title="Eliminar foto"
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Footer Controls */}
                <div className="p-2.5 bg-[var(--color-sand-50)] flex items-center justify-between border-t border-[var(--color-sand-200)]">
                  {img.isMain ? (
                    <span className="text-[11px] font-bold text-[var(--color-terracotta-600)] flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Portada activa
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetMain(img.id)}
                      className="text-[11px] font-semibold text-[var(--color-sand-800)] hover:text-[var(--color-terracotta-600)] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 text-[var(--color-sand-400)]" />
                      Establecer como portada
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setImageToDelete(img)}
                    className="text-[11px] font-medium text-[var(--color-sand-400)] hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Accessible Delete Confirmation Modal (NO native confirm()) */}
      <Modal
        isOpen={Boolean(imageToDelete)}
        onClose={() => setImageToDelete(null)}
        title="¿Eliminar fotografía?"
        subtitle="Esta acción quitará la foto de la galería del alojamiento"
        maxWidth="sm"
      >
        <div className="flex flex-col gap-4">
          {imageToDelete && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-[var(--color-sand-200)]">
              <img
                src={imageToDelete.url}
                alt="Foto a eliminar"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <p className="text-xs text-[var(--color-sand-800)] leading-relaxed">
            {imageToDelete?.isMain ? (
              <span className="text-amber-800 font-semibold block">
                Atención: Esta fotografía es la portada actual. Al eliminarla, otra foto de la galería se seleccionará automáticamente como nueva portada.
              </span>
            ) : (
              'La imagen dejará de visualizarse en el portal público de Turismo Capilla.'
            )}
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-sand-200)]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setImageToDelete(null)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar foto</span>
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
