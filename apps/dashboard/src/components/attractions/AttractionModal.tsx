import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import type { Attraction, CreateAttractionDto, AttractionCategory, AttractionStatus } from '../../types/attraction.types.ts';

interface AttractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateAttractionDto) => Promise<void>;
  attraction?: Attraction | null;
}

const CATEGORY_OPTIONS: { value: AttractionCategory; label: string }[] = [
  { value: 'HILL', label: 'Cerro / Montaña' },
  { value: 'NATURE_TRAIL', label: 'Sendero de Naturaleza / Trekking' },
  { value: 'RIVER_BEACH', label: 'Río / Balneario' },
  { value: 'CULTURAL', label: 'Patrimonio Cultural / Urbano' },
  { value: 'NIGHT', label: 'Nocturno / Astroturismo' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'BAJA', label: 'Baja (Familiar)' },
  { value: 'MEDIA', label: 'Media (Exigencia moderada)' },
  { value: 'ALTA', label: 'Alta (Exigencia física alta)' },
];

const STATUS_OPTIONS: { value: AttractionStatus; label: string }[] = [
  { value: 'OPEN', label: 'Abierto y Habilitado' },
  { value: 'WEATHER_RESTRICTED', label: 'Con Precaución Meteorológica' },
  { value: 'CLOSED', label: 'Clausurado Temporalmente' },
];

export const AttractionModal: React.FC<AttractionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  attraction,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AttractionCategory>('HILL');
  const [difficulty, setDifficulty] = useState('BAJA');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [howToGet, setHowToGet] = useState('');
  const [requiresGuide, setRequiresGuide] = useState(false);
  const [admissionFee, setAdmissionFee] = useState<number | ''>(0);
  const [latitude, setLatitude] = useState<number | ''>(-30.85);
  const [longitude, setLongitude] = useState<number | ''>(-64.52);
  const [status, setStatus] = useState<AttractionStatus>('OPEN');
  const [statusNotice, setStatusNotice] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (attraction) {
      setName(attraction.name || '');
      setDescription(attraction.description || '');
      setCategory(attraction.category || 'HILL');
      setDifficulty(attraction.difficulty || 'BAJA');
      setEstimatedDuration(attraction.estimatedDuration || '');
      setHowToGet(attraction.howToGet || '');
      setRequiresGuide(Boolean(attraction.requiresGuide));
      setAdmissionFee(attraction.admissionFee ?? 0);
      setLatitude(attraction.latitude ?? -30.85);
      setLongitude(attraction.longitude ?? -64.52);
      setStatus(attraction.status || 'OPEN');
      setStatusNotice(attraction.statusNotice || '');
      setIsFeatured(Boolean(attraction.isFeatured));
      setImages(attraction.images?.map((img) => img.url) || []);
    } else {
      setName('');
      setDescription('');
      setCategory('HILL');
      setDifficulty('BAJA');
      setEstimatedDuration('');
      setHowToGet('');
      setRequiresGuide(false);
      setAdmissionFee(0);
      setLatitude(-30.85);
      setLongitude(-64.52);
      setStatus('OPEN');
      setStatusNotice('');
      setIsFeatured(false);
      setImages([]);
    }
    setImageUrlInput('');
    setError(null);
  }, [attraction, isOpen]);

  const handleAddImage = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (!images.includes(trimmed)) {
      setImages([...images, trimmed]);
    }
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre del atractivo es obligatorio.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      const dto: CreateAttractionDto = {
        name: name.trim(),
        description: description.trim(),
        category,
        difficulty,
        estimatedDuration: estimatedDuration.trim(),
        howToGet: howToGet.trim(),
        requiresGuide,
        admissionFee: admissionFee === '' ? 0 : Number(admissionFee),
        latitude: latitude === '' ? null : Number(latitude),
        longitude: longitude === '' ? null : Number(longitude),
        status,
        statusNotice: status !== 'OPEN' && statusNotice.trim() ? statusNotice.trim() : null,
        isFeatured,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'],
      };

      await onSubmit(dto);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el paseo';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={attraction ? 'Editar Atractivo / Sendero' : 'Nuevo Atractivo o Paseo'}
      subtitle="Gestioná la ficha técnica, disponibilidad operativa y visibilidad en el portal."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Datos Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Nombre del Atractivo o Sendero *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Los Terrones, Sendero al Dique..."
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Categoría *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AttractionCategory)}
              className="w-full h-11 px-3.5 py-2 bg-white border border-sand-300 rounded-xl text-sm font-medium text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Dificultad
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full h-11 px-3.5 py-2 bg-white border border-sand-300 rounded-xl text-sm font-medium text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
            >
              {DIFFICULTY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Estado y Destacado */}
        <div className="p-4 rounded-2xl bg-sand-50/80 border border-sand-200/90 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sand-800 mb-1.5">
                Estado Operativo / Disponibilidad
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AttractionStatus)}
                className="w-full h-11 px-3.5 py-2 bg-white border border-sand-300 rounded-xl text-sm font-bold text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-xl border border-sand-200 bg-white cursor-pointer hover:border-amber-400 transition-colors">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500 cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-sand-900 flex items-center gap-1.5">
                    ★ Destacar en Portada
                  </span>
                  <span className="text-xs text-sand-500 block">
                    Aparece con prioridad en el portal turístico
                  </span>
                </div>
              </label>
            </div>
          </div>

          {status !== 'OPEN' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Aviso a Turistas (Motivo de cierre o precaución)
              </label>
              <Input
                value={statusNotice}
                onChange={(e) => setStatusNotice(e.target.value)}
                placeholder="Ej. Precaución por alerta meteorológica de tormentas fuertes / Crecida de río"
              />
            </div>
          )}
        </div>

        {/* Descripción y Detalles */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
            Descripción y Atractivo
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Reseña del sendero, paisaje, recomendaciones y valor turístico..."
            className="w-full px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors resize-none"
          />
        </div>

        {/* Telemetría y Guía */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Duración Estimada
            </label>
            <Input
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="Ej. 3 a 4 horas"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Tarifa Entrada ($ ARS)
            </label>
            <Input
              type="number"
              min="0"
              value={admissionFee}
              onChange={(e) => setAdmissionFee(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="0 = Gratuito"
            />
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-3 p-2.5 rounded-xl border border-sand-200 bg-white cursor-pointer hover:border-sand-400 transition-colors h-11">
              <input
                type="checkbox"
                checked={requiresGuide}
                onChange={(e) => setRequiresGuide(e.target.checked)}
                className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-sand-800">
                Requiere Guía Habilitado
              </span>
            </label>
          </div>
        </div>

        {/* Cómo llegar y Coordenadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Cómo Llegar / Acceso
            </label>
            <Input
              value={howToGet}
              onChange={(e) => setHowToGet(e.target.value)}
              placeholder="Ej. Por RN 38 Km 92, camino consolidado señalizado..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Latitud
            </label>
            <Input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="-30.8522"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-sand-700 mb-1.5">
              Longitud
            </label>
            <Input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="-64.5241"
            />
          </div>
        </div>

        {/* Galería de Fotos */}
        <div className="space-y-3 pt-2 border-t border-sand-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-sand-700">
            Galería Fotográfica (URLs)
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... o enlace de foto"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
            </div>
            <Button type="button" variant="outline" onClick={handleAddImage} className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {images.map((url, idx) => (
                <div key={idx} className="group relative aspect-4/3 rounded-xl overflow-hidden border border-sand-200 bg-sand-100">
                  <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors opacity-90 group-hover:opacity-100"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sand-900/80 text-white">
                      Principal
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          {images.length === 0 && (
            <p className="text-xs text-sand-500 flex items-center gap-1.5 italic">
              <ImageIcon className="w-4 h-4 text-sand-400" />
              Si no agregás imágenes, se asignará una portada de paisajes por defecto.
            </p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="terracotta" isLoading={isSubmitting}>
            {attraction ? 'Guardar Cambios' : 'Crear Atractivo'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
