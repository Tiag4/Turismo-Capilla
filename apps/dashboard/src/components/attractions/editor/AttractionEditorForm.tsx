import React, { useState } from 'react';
import { Compass, ArrowLeft, Save, Check } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Select } from '../../ui/Select.tsx';
import { AttractionPhotoDropzone } from './AttractionPhotoDropzone.tsx';
import type { Attraction, CreateAttractionDto, AttractionCategory, AttractionStatus } from '../../../types/attraction.types.ts';

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

export interface AttractionEditorFormProps {
  initialData?: Attraction | null;
  onSubmit: (dto: CreateAttractionDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AttractionEditorForm: React.FC<AttractionEditorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category, setCategory] = useState<AttractionCategory>(initialData?.category ?? 'HILL');
  const [difficulty, setDifficulty] = useState(initialData?.difficulty ?? 'BAJA');
  const [estimatedDuration, setEstimatedDuration] = useState(initialData?.estimatedDuration ?? '');
  const [howToGet, setHowToGet] = useState(initialData?.howToGet ?? '');
  const [requiresGuide, setRequiresGuide] = useState(Boolean(initialData?.requiresGuide));
  const [admissionFee, setAdmissionFee] = useState<number | ''>(initialData?.admissionFee ?? 0);
  const [latitude, setLatitude] = useState<number | ''>(initialData?.latitude ?? -30.85);
  const [longitude, setLongitude] = useState<number | ''>(initialData?.longitude ?? -64.52);
  const [status, setStatus] = useState<AttractionStatus>(initialData?.status ?? 'OPEN');
  const [statusNotice, setStatusNotice] = useState(initialData?.statusNotice ?? '');
  const [isFeatured, setIsFeatured] = useState(Boolean(initialData?.isFeatured));
  const [images, setImages] = useState<string[]>(initialData?.images?.map((img) => img.url) ?? []);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('El nombre del atractivo o sendero es obligatorio.');
      return;
    }
    if (!description.trim()) {
      setValidationError('La descripción del paseo es obligatoria.');
      return;
    }

    const dto: CreateAttractionDto = {
      name: name.trim(),
      description: description.trim(),
      category,
      difficulty,
      estimatedDuration: estimatedDuration.trim() || undefined,
      howToGet: howToGet.trim() || undefined,
      requiresGuide,
      admissionFee: admissionFee === '' ? 0 : Number(admissionFee),
      latitude: latitude === '' ? -30.85 : Number(latitude),
      longitude: longitude === '' ? -64.52 : Number(longitude),
      status,
      statusNotice: status !== 'OPEN' && statusNotice.trim() ? statusNotice.trim() : undefined,
      isFeatured,
      images,
    };

    setValidationError(null);
    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Header con botón volver */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
            title="Volver al catálogo"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-0.5">
              <Compass className="w-4 h-4" />
              <span>Catálogo Municipal de Atractivos</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              {initialData ? `Editar "${initialData.name}"` : 'Nuevo Atractivo o Sendero'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="emerald" isLoading={isSubmitting} className="font-bold shadow-xs cursor-pointer">
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialData ? 'Guardar Cambios' : 'Registrar Atractivo'}</span>
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {validationError}
        </div>
      )}

      {/* 2. Sección: Datos Principales */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">Información General</h2>
        <Input
          label="Nombre del Atractivo o Sendero"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Cerro Uritorco, Balneario La Toma, Dique El Cajón..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Categoría Oficial"
            value={category}
            onChange={(val) => setCategory(val as AttractionCategory)}
            options={CATEGORY_OPTIONS}
          />
          <Select
            label="Dificultad Estimada"
            value={difficulty}
            onChange={(val) => setDifficulty(val)}
            options={DIFFICULTY_OPTIONS}
          />
          <Input
            label="Duración Estimada"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
            placeholder="Ej: 3 horas ida y vuelta"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1.5">
            Descripción y Reseña Informativa
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describí las características del paseo, atractivos naturales, flora, fauna y recomendaciones para el visitante..."
            className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-y"
            required
          />
        </div>
      </div>

      {/* 3. Sección: Cómo Llegar y Ubicación */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">Acceso y Localización</h2>
        <Input
          label="Cómo Llegar (Indicaciones viales / peatonales)"
          value={howToGet}
          onChange={(e) => setHowToGet(e.target.value)}
          placeholder="Ej: A 3 km del centro por calle Sabattini hasta el parador comunal."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Latitud GPS"
            type="number"
            step="0.0001"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
          />
          <Input
            label="Longitud GPS"
            type="number"
            step="0.0001"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value === '' ? '' : parseFloat(e.target.value))}
          />
          <Input
            label="Tarifa de Entrada / Ingreso ($)"
            type="number"
            value={admissionFee}
            onChange={(e) => setAdmissionFee(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            helperText="Dejar en 0 si el acceso es libre y gratuito."
          />
          <div className="flex items-center gap-2.5 pt-6">
            <button
              type="button"
              role="checkbox"
              aria-checked={requiresGuide}
              onClick={() => setRequiresGuide(!requiresGuide)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                requiresGuide ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-sand-300 bg-white hover:border-sand-400'
              }`}
            >
              {requiresGuide && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <label onClick={() => setRequiresGuide(!requiresGuide)} className="text-xs font-bold text-sand-800 cursor-pointer">
              Exige Guía Habilitado
            </label>
          </div>
        </div>
      </div>

      {/* 4. Sección: Estado y Portada */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">Operatividad y Exhibición</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Estado Operativo Actual"
            value={status}
            onChange={(val) => setStatus(val as AttractionStatus)}
            options={STATUS_OPTIONS}
          />
          <div className="flex items-center gap-2.5 pt-6">
            <button
              type="button"
              role="checkbox"
              aria-checked={isFeatured}
              onClick={() => setIsFeatured(!isFeatured)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                isFeatured ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-sand-300 bg-white hover:border-sand-400'
              }`}
            >
              {isFeatured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <label onClick={() => setIsFeatured(!isFeatured)} className="text-xs font-bold text-sand-800 cursor-pointer">
              Destacar en Portada del Portal Turístico
            </label>
          </div>
        </div>

        {status !== 'OPEN' && (
          <Input
            label="Aviso Oficial / Motivo de Restricción"
            value={statusNotice}
            onChange={(e) => setStatusNotice(e.target.value)}
            placeholder="Ej: Cerrado por alerta de tormenta eléctrica o crecida de arroyo..."
            helperText="Este aviso se mostrará prominentemente al turista en el portal."
          />
        )}
      </div>

      {/* 5. Sección: Galería Fotográfica (Carga exclusiva por archivo / Dropzone) */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">Galería Fotográfica</h2>
            <p className="text-xs text-sand-500">Carga directa de fotografías desde tu dispositivo (arrastrá o seleccioná archivos)</p>
          </div>
          <span className="text-xs font-bold text-sand-500">{images.length} / 8 fotos</span>
        </div>

        <AttractionPhotoDropzone images={images} onChange={setImages} />
      </div>
    </form>
  );
};
