import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import { circuitsConfigService, DEFAULT_CIRCUITS_CONFIG } from '../../../services/circuitsConfig.service';
import type { AdventureActivity, CircuitSpot, CircuitsConfig } from '../../../types/circuits.types';
import { CircuitPhotoDropzone } from '../CircuitPhotoDropzone';
import { MapLocationPicker } from '../../accommodations/editor/MapLocationPicker';

export interface CircuitEditorPageProps {
  mode: 'create' | 'edit';
  category: 'mistico' | 'aventura';
  circuitId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

interface StringListEditorProps {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (next: string[]) => void;
}

const StringListEditor: React.FC<StringListEditorProps> = ({ label, placeholder, items, onChange }) => {
  const [draft, setDraft] = useState('');

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-[var(--color-sand-700)]">{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem();
            }
          }}
          className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm bg-white"
        />
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-[var(--color-sand-900)] text-white text-xs font-bold shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar
        </button>
      </div>
      {items.length > 0 && (
        <ul className="divide-y divide-[var(--color-sand-200)] border border-[var(--color-sand-200)] rounded-xl bg-[var(--color-sand-50)]">
          {items.map((item, idx) => (
            <li key={`${item}-${idx}`} className="px-3 py-2 flex items-center justify-between gap-2 text-xs text-[var(--color-sand-800)]">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
                className="text-rose-700 hover:text-rose-900 cursor-pointer"
                aria-label="Quitar elemento"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const createEmptySpot = (): CircuitSpot => ({
  id: `spot-${Date.now()}`,
  title: '',
  subtitle: '',
  description: '',
  highlights: [],
  energyAttribute: '',
  recommendations: [],
  coordinates: { lat: -30.8654, lng: -64.5241 },
  image: '',
  badge: 'Punto Oficial',
  bestTime: 'Mañana temprana',
});

const createEmptyActivity = (): AdventureActivity => ({
  id: `act-${Date.now()}`,
  title: '',
  modality: 'parapente',
  modalityLabel: 'Parapente & Vuelo Libre',
  location: 'Capilla del Monte',
  difficulty: 'Media',
  duration: '1 a 2 horas',
  description: '',
  suggestedGear: [],
  safetyRequirements: [],
  certifiedProviders: [{ name: '', contact: '', certificationBadge: 'Habilitación Municipal' }],
  coordinates: { lat: -30.8654, lng: -64.5241 },
  image: '',
});

export const CircuitEditorPage: React.FC<CircuitEditorPageProps> = ({
  mode,
  category,
  circuitId,
  onBack,
  onSuccess,
}) => {
  const [config, setConfig] = useState<CircuitsConfig>(DEFAULT_CIRCUITS_CONFIG);
  const [spot, setSpot] = useState<CircuitSpot>(createEmptySpot);
  const [activity, setActivity] = useState<AdventureActivity>(createEmptyActivity);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    circuitsConfigService
      .fetchConfig()
      .then((loaded) => {
        if (!active) return;
        setConfig(loaded);
        if (mode === 'edit' && circuitId) {
          if (category === 'mistico') {
            const found = loaded.mysticSpots.find((s) => s.id === circuitId);
            if (found) setSpot({ ...found });
          } else {
            const found = loaded.adventureActivities.find((a) => a.id === circuitId);
            if (found) setActivity({ ...found });
          }
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [mode, category, circuitId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const currentImage = category === 'mistico' ? spot.image : activity.image;
    if (!currentImage) {
      setErrorMsg('Subí una fotografía principal para publicar en el circuito.');
      return;
    }

    setIsSaving(true);
    try {
      let nextConfig: CircuitsConfig;
      if (category === 'mistico') {
        const exists = config.mysticSpots.some((s) => s.id === spot.id);
        nextConfig = {
          ...config,
          mysticSpots: exists
            ? config.mysticSpots.map((s) => (s.id === spot.id ? spot : s))
            : [...config.mysticSpots, spot],
        };
      } else {
        const exists = config.adventureActivities.some((a) => a.id === activity.id);
        nextConfig = {
          ...config,
          adventureActivities: exists
            ? config.adventureActivities.map((a) => (a.id === activity.id ? activity : a))
            : [...config.adventureActivities, activity],
        };
      }
      await circuitsConfigService.saveConfig(nextConfig);
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar en el servidor.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-16 text-center text-sm text-[var(--color-sand-500)]">Cargando ficha técnica...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a Circuitos Temáticos</span>
          </button>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] font-['Outfit']">
            {mode === 'create' ? 'Nueva Ficha de Circuito' : 'Editar Ficha de Circuito'} —{' '}
            {category === 'mistico' ? 'Místico & Energético' : 'Turismo Alternativo & Aventura'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[var(--color-sand-200)] p-6 sm:p-8 space-y-8">
        {/* 1. Fotografía en Cloudinary */}
        <section className="space-y-2">
          <h2 className="text-sm font-black text-[var(--color-sand-900)]">Fotografía Principal (Cloudinary)</h2>
          <CircuitPhotoDropzone
            imageUrl={category === 'mistico' ? spot.image : activity.image || ''}
            onChange={(url) =>
              category === 'mistico'
                ? setSpot({ ...spot, image: url })
                : setActivity({ ...activity, image: url })
            }
          />
        </section>

        {/* 2. Ficha Técnica según categoría */}
        {category === 'mistico' ? (
          <section className="space-y-4 pt-4 border-t border-[var(--color-sand-200)]">
            <h2 className="text-sm font-black text-[var(--color-sand-900)]">Ficha Técnica de la Parada Mística</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Título *</span>
                <input
                  required
                  value={spot.title}
                  onChange={(e) => setSpot({ ...spot, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Subtítulo *</span>
                <input
                  required
                  value={spot.subtitle}
                  onChange={(e) => setSpot({ ...spot, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Atributo Telúrico / Energético</span>
                <input
                  value={spot.energyAttribute || ''}
                  placeholder="Ej: Resonancia Acústica & Silencio Profundo"
                  onChange={(e) => setSpot({ ...spot, energyAttribute: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                  <span>Insignia</span>
                  <input
                    value={spot.badge}
                    onChange={(e) => setSpot({ ...spot, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                  />
                </label>
                <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                  <span>Horario Sugerido</span>
                  <input
                    value={spot.bestTime || ''}
                    onChange={(e) => setSpot({ ...spot, bestTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                  />
                </label>
              </div>
            </div>

            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Descripción Editorial *</span>
              <textarea
                required
                rows={4}
                value={spot.description}
                onChange={(e) => setSpot({ ...spot, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StringListEditor
                label="Aspectos Clave del Recorrido"
                placeholder="Ej: Cumbre a 1.979 msnm con vista 360°"
                items={spot.highlights}
                onChange={(highlights) => setSpot({ ...spot, highlights })}
              />
              <StringListEditor
                label="Recomendaciones Oficiales"
                placeholder="Ej: Llevar mínimo 1.5L de agua"
                items={spot.recommendations}
                onChange={(recommendations) => setSpot({ ...spot, recommendations })}
              />
            </div>
          </section>
        ) : (
          <section className="space-y-4 pt-4 border-t border-[var(--color-sand-200)]">
            <h2 className="text-sm font-black text-[var(--color-sand-900)]">Ficha Técnica de Turismo Activo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Título de la Actividad *</span>
                <input
                  required
                  value={activity.title}
                  onChange={(e) => setActivity({ ...activity, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Ubicación / Sector *</span>
                <input
                  required
                  value={activity.location}
                  onChange={(e) => setActivity({ ...activity, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Modalidad</span>
                <select
                  value={activity.modality}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      modality: e.target.value as AdventureActivity['modality'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal bg-white"
                >
                  <option value="parapente">Parapente & Vuelo Libre</option>
                  <option value="rappel">Rappel & Escalada</option>
                  <option value="espeleologia">Espeleología</option>
                  <option value="astroturismo">Astroturismo</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                  <span>Dificultad</span>
                  <select
                    value={activity.difficulty}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        difficulty: e.target.value as AdventureActivity['difficulty'],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal bg-white"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                  </select>
                </label>
                <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                  <span>Duración</span>
                  <input
                    value={activity.duration}
                    onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                  />
                </label>
              </div>
            </div>

            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Descripción *</span>
              <textarea
                required
                rows={4}
                value={activity.description}
                onChange={(e) => setActivity({ ...activity, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Prestador Habilitado *</span>
                <input
                  required
                  value={activity.certifiedProviders?.[0]?.name || ''}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      certifiedProviders: [
                        {
                          ...(activity.certifiedProviders?.[0] || {
                            contact: '',
                            certificationBadge: 'Habilitación Municipal',
                          }),
                          name: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Teléfono / WhatsApp</span>
                <input
                  value={activity.certifiedProviders?.[0]?.contact || ''}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      certifiedProviders: [
                        {
                          ...(activity.certifiedProviders?.[0] || {
                            name: '',
                            certificationBadge: 'Habilitación Municipal',
                          }),
                          contact: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
              <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
                <span>Matrícula / Certificación</span>
                <input
                  value={activity.certifiedProviders?.[0]?.certificationBadge || ''}
                  onChange={(e) =>
                    setActivity({
                      ...activity,
                      certifiedProviders: [
                        {
                          ...(activity.certifiedProviders?.[0] || { name: '', contact: '' }),
                          certificationBadge: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-sand-300)] text-sm font-normal"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <StringListEditor
                label="Equipamiento Sugerido"
                placeholder="Ej: Rompeviento y calzado acordonado"
                items={activity.suggestedGear}
                onChange={(suggestedGear) => setActivity({ ...activity, suggestedGear })}
              />
              <StringListEditor
                label="Requisitos de Seguridad"
                placeholder="Ej: Apto físico y guía matriculado"
                items={activity.safetyRequirements}
                onChange={(safetyRequirements) => setActivity({ ...activity, safetyRequirements })}
              />
            </div>
          </section>
        )}

        {/* 3. Geolocalización */}
        <section className="space-y-3 pt-4 border-t border-[var(--color-sand-200)]">
          <h2 className="text-sm font-black text-[var(--color-sand-900)]">Ubicación en Mapa</h2>
          <MapLocationPicker
            latitude={category === 'mistico' ? spot.coordinates.lat : activity.coordinates.lat}
            longitude={category === 'mistico' ? spot.coordinates.lng : activity.coordinates.lng}
            onLocationChange={(lat, lng) =>
              category === 'mistico'
                ? setSpot({ ...spot, coordinates: { lat, lng } })
                : setActivity({ ...activity, coordinates: { lat, lng } })
            }
          />
        </section>

        {errorMsg && <p className="text-xs font-bold text-rose-700">{errorMsg}</p>}

        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-sand-200)]">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-700)] cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Ficha Oficial'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
