import React, { useState } from 'react';
import {
  Compass,
  ArrowLeft,
  Save,
  Check,
  Plus,
  Trash2,
  Mountain,
  ShieldAlert,
  Backpack,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import { Select } from '../../ui/Select.tsx';
import { AttractionPhotoDropzone } from './AttractionPhotoDropzone.tsx';
import type {
  Attraction,
  CreateAttractionDto,
  AttractionCategory,
  AttractionStatus,
} from '../../../types/attraction.types.ts';

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

const TRAIL_TYPE_OPTIONS = [
  { value: 'Ida y vuelta', label: 'Ida y vuelta' },
  { value: 'Circuito cerrado', label: 'Circuito cerrado' },
  { value: 'Paseo libre', label: 'Paseo libre' },
  { value: 'Paseo costero', label: 'Paseo costero' },
  { value: 'Paseo urbano', label: 'Paseo urbano' },
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
  // Datos Generales
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

  // Telemetría de Montaña
  const [maxElevationMsnm, setMaxElevationMsnm] = useState<number | ''>(
    initialData?.maxElevationMsnm ?? '',
  );
  const [elevationGainMeters, setElevationGainMeters] = useState<number | ''>(
    initialData?.elevationGainMeters ?? '',
  );
  const [distanceKm, setDistanceKm] = useState<number | ''>(initialData?.distanceKm ?? '');
  const [trailType, setTrailType] = useState<string>(initialData?.trailType ?? 'Ida y vuelta');
  const [terrainType, setTerrainType] = useState<string>(initialData?.terrainType ?? '');

  // Horarios y Protocolos de Seguridad
  const [openingHours, setOpeningHours] = useState<string>(initialData?.openingHours ?? '');
  const [cutoffTime, setCutoffTime] = useState<string>(initialData?.cutoffTime ?? '');
  const [hydrationRequirement, setHydrationRequirement] = useState<string>(
    initialData?.hydrationRequirement ?? '',
  );

  // Listas Dinámicas
  const [highlights, setHighlights] = useState<string[]>(initialData?.highlights ?? []);
  const [newHighlight, setNewHighlight] = useState('');

  const [recommendedGear, setRecommendedGear] = useState<string[]>(
    initialData?.recommendedGear ?? [],
  );
  const [newGear, setNewGear] = useState('');

  const [safetyWarnings, setSafetyWarnings] = useState<string[]>(
    initialData?.safetyWarnings ?? [],
  );
  const [newWarning, setNewWarning] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);

  // Handlers para agregar a listas dinámicas
  const handleAddHighlight = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newHighlight.trim();
    if (val && !highlights.includes(val)) {
      setHighlights([...highlights, val]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddGear = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newGear.trim();
    if (val && !recommendedGear.includes(val)) {
      setRecommendedGear([...recommendedGear, val]);
      setNewGear('');
    }
  };

  const handleRemoveGear = (idx: number) => {
    setRecommendedGear(recommendedGear.filter((_, i) => i !== idx));
  };

  const handleAddWarning = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = newWarning.trim();
    if (val && !safetyWarnings.includes(val)) {
      setSafetyWarnings([...safetyWarnings, val]);
      setNewWarning('');
    }
  };

  const handleRemoveWarning = (idx: number) => {
    setSafetyWarnings(safetyWarnings.filter((_, i) => i !== idx));
  };

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
      // Telemetría
      elevationGainMeters: elevationGainMeters === '' ? null : Number(elevationGainMeters),
      maxElevationMsnm: maxElevationMsnm === '' ? null : Number(maxElevationMsnm),
      distanceKm: distanceKm === '' ? null : Number(distanceKm),
      trailType: trailType.trim() || undefined,
      terrainType: terrainType.trim() || undefined,
      // Protocolos y Horarios
      openingHours: openingHours.trim() || undefined,
      cutoffTime: cutoffTime.trim() || undefined,
      hydrationRequirement: hydrationRequirement.trim() || undefined,
      highlights,
      recommendedGear,
      safetyWarnings,
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
          <Button
            type="submit"
            variant="emerald"
            isLoading={isSubmitting}
            className="font-bold shadow-xs cursor-pointer"
          >
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
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
          Información General
        </h2>
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
            placeholder="Ej: 7 a 8 horas ida y vuelta"
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

      {/* 3. Sección: Telemetría de Montaña y Datos Técnicos */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
            Ficha Técnica y Telemetría de Montaña
          </h2>
        </div>
        <p className="text-xs text-sand-500">
          Datos altimétricos y métricas de recorrido consumidos por la barra de telemetría del portal.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Cota Máxima (msnm)"
            type="number"
            value={maxElevationMsnm}
            onChange={(e) =>
              setMaxElevationMsnm(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            placeholder="Ej: 1979"
            helperText="Altitud del punto más alto."
          />
          <Input
            label="Desnivel Positivo (+m)"
            type="number"
            value={elevationGainMeters}
            onChange={(e) =>
              setElevationGainMeters(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            placeholder="Ej: 979"
            helperText="Ascenso vertical acumulado."
          />
          <Input
            label="Distancia Total (km)"
            type="number"
            step="0.1"
            value={distanceKm}
            onChange={(e) =>
              setDistanceKm(e.target.value === '' ? '' : parseFloat(e.target.value))
            }
            placeholder="Ej: 11.6"
            helperText="Longitud total del recorrido."
          />
          <Select
            label="Modalidad de Sendero"
            value={trailType}
            onChange={(val) => setTrailType(val)}
            options={TRAIL_TYPE_OPTIONS}
          />
        </div>

        <div>
          <Input
            label="Tipo de Terreno"
            value={terrainType}
            onChange={(e) => setTerrainType(e.target.value)}
            placeholder="Ej: Sendero de montaña, piedra granítica suelta y acarreo final"
            helperText="Describe la superficie predominante y calzado requerido."
          />
        </div>
      </div>

      {/* 4. Sección: Protocolos de Seguridad y Horarios */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
            Horarios y Protocolos de Seguridad
          </h2>
        </div>
        <p className="text-xs text-sand-500">
          Horarios de control, corte obligatorio por guardaparques y normas de hidratación.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input
            label="Horario de Apertura / Operatividad"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
            placeholder="Ej: 07:00 a 18:00 hs (todos los días)"
          />
          <Input
            label="Horario Límite de Ingreso (Cutoff)"
            value={cutoffTime}
            onChange={(e) => setCutoffTime(e.target.value)}
            placeholder="Ej: 11:00 hs - Registro límite obligatorio"
            helperText="Hora máxima en que se permite iniciar el ascenso."
          />
          <Input
            label="Ración de Hidratación Obligatoria"
            value={hydrationRequirement}
            onChange={(e) => setHydrationRequirement(e.target.value)}
            placeholder="Ej: Mínimo 2 litros de agua por persona"
          />
        </div>

        {/* Pautas y Advertencias de Seguridad */}
        <div className="space-y-3 pt-3 border-t border-sand-100">
          <label className="block text-xs font-bold text-sand-700">
            Advertencias y Pautas de Seguridad (Guardaparques)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newWarning}
              onChange={(e) => setNewWarning(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddWarning();
                }
              }}
              placeholder="Ej: Prohibido el ascenso con calzado liso o sandalias..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddWarning()}
              className="cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar
            </Button>
          </div>

          {safetyWarnings.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {safetyWarnings.map((warn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900"
                >
                  <span className="leading-snug">{warn}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveWarning(idx)}
                    className="p-1 rounded-lg text-amber-700 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Eliminar advertencia"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-sand-400 italic">No hay advertencias personalizadas.</p>
          )}
        </div>
      </div>

      {/* 5. Sección: Equipamiento y Puntos Destacados */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Backpack className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
            Checklist de Mochila y Puntos Destacados
          </h2>
        </div>

        {/* Checklist de Equipamiento */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-sand-800">
              Equipamiento Recomendado (Checklist Interactivo del Turista)
            </span>
            <span className="text-xs text-sand-500 font-normal">
              ({recommendedGear.length} ítems)
            </span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newGear}
              onChange={(e) => setNewGear(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddGear();
                }
              }}
              placeholder="Ej: Calzado de trekking con suela adherente, linterna frontal..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddGear()}
              className="cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar
            </Button>
          </div>

          {recommendedGear.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {recommendedGear.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 border border-sand-200 text-xs font-medium text-sand-800"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGear(idx)}
                    className="p-0.5 rounded-md text-sand-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Eliminar elemento"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-sand-400 italic">No hay ítems cargados en el checklist.</p>
          )}
        </div>

        {/* Hitos / Puntos Destacados */}
        <div className="space-y-3 pt-4 border-t border-sand-100">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-bold text-sand-800">
              Puntos Destacados e Hitos del Recorrido
            </span>
            <span className="text-xs text-sand-500 font-normal">({highlights.length} hitos)</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddHighlight();
                }
              }}
              placeholder="Ej: Cumbre a 1.979 msnm con cruz panorámica, Quebrada del Huallpa..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddHighlight()}
              className="cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar
            </Button>
          </div>

          {highlights.length > 0 ? (
            <div className="space-y-1.5 pt-1">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-xs text-sand-800"
                >
                  <span className="leading-snug">{h}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1 rounded-lg text-sand-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Eliminar hito"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-sand-400 italic">No hay hitos destacados cargados.</p>
          )}
        </div>
      </div>

      {/* 6. Sección: Cómo Llegar y Ubicación */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
            Acceso y Localización
          </h2>
        </div>
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
            onChange={(e) =>
              setAdmissionFee(e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            helperText="Dejar en 0 si el acceso es libre y gratuito."
          />
          <div className="flex items-center gap-2.5 pt-6">
            <button
              type="button"
              role="checkbox"
              aria-checked={requiresGuide}
              onClick={() => setRequiresGuide(!requiresGuide)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                requiresGuide
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'border-sand-300 bg-white hover:border-sand-400'
              }`}
            >
              {requiresGuide && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <label
              onClick={() => setRequiresGuide(!requiresGuide)}
              className="text-xs font-bold text-sand-800 cursor-pointer"
            >
              Exige Guía Habilitado
            </label>
          </div>
        </div>
      </div>

      {/* 7. Sección: Estado y Portada */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
          Operatividad y Exhibición
        </h2>
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
                isFeatured
                  ? 'bg-emerald-700 border-emerald-700 text-white'
                  : 'border-sand-300 bg-white hover:border-sand-400'
              }`}
            >
              {isFeatured && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <label
              onClick={() => setIsFeatured(!isFeatured)}
              className="text-xs font-bold text-sand-800 cursor-pointer"
            >
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

      {/* 8. Sección: Galería Fotográfica */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
              Galería Fotográfica
            </h2>
            <p className="text-xs text-sand-500">
              Carga directa de fotografías desde tu dispositivo (arrastrá o seleccioná archivos)
            </p>
          </div>
          <span className="text-xs font-bold text-sand-500">{images.length} / 8 fotos</span>
        </div>

        <AttractionPhotoDropzone images={images} onChange={setImages} />
      </div>
    </form>
  );
};
