import React, { useEffect, useState } from 'react';
import { Compass, Mountain, Utensils, Plus, Pencil, Trash2, Upload, Check, Save } from 'lucide-react';
import { circuitsConfigService, DEFAULT_CIRCUITS_CONFIG } from '../../services/circuitsConfig.service';
import { mediaService } from '../../services/media.service';
import type { AdventureActivity, CircuitSpot, CircuitsConfig } from '../../types/circuits.types';

type ActiveCircuitTab = 'mistico' | 'aventura';

export const CircuitsManagerView: React.FC = () => {
  const [config, setConfig] = useState<CircuitsConfig>(DEFAULT_CIRCUITS_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveCircuitTab>('mistico');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const [editingSpot, setEditingSpot] = useState<CircuitSpot | null>(null);
  const [editingActivity, setEditingActivity] = useState<AdventureActivity | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    let active = true;
    circuitsConfigService
      .fetchConfig()
      .then((loaded) => {
        if (active) setConfig(loaded);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = async (next: CircuitsConfig) => {
    setConfig(next);
    setIsSaving(true);
    try {
      await circuitsConfigService.saveConfig(next);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImage = async (file: File, onUrl: (url: string) => void) => {
    setIsUploading(true);
    try {
      const res = await mediaService.uploadImage(file, 'portal/circuits');
      if (res?.url) onUrl(res.url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSpot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpot) return;
    const exists = config.mysticSpots.some((s) => s.id === editingSpot.id);
    const updatedSpots = exists
      ? config.mysticSpots.map((s) => (s.id === editingSpot.id ? editingSpot : s))
      : [...config.mysticSpots, editingSpot];
    setEditingSpot(null);
    await persist({ ...config, mysticSpots: updatedSpots });
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    const exists = config.adventureActivities.some((a) => a.id === editingActivity.id);
    const updatedActs = exists
      ? config.adventureActivities.map((a) => (a.id === editingActivity.id ? editingActivity : a))
      : [...config.adventureActivities, editingActivity];
    setEditingActivity(null);
    await persist({ ...config, adventureActivities: updatedActs });
  };

  const handleDeleteSpot = async (id: string) => {
    await persist({ ...config, mysticSpots: config.mysticSpots.filter((s) => s.id !== id) });
  };

  const handleDeleteActivity = async (id: string) => {
    await persist({
      ...config,
      adventureActivities: config.adventureActivities.filter((a) => a.id !== id),
    });
  };

  const createEmptySpot = (): CircuitSpot => ({
    id: `spot-${Date.now()}`,
    title: '',
    subtitle: '',
    description: '',
    highlights: ['Experiencia guiada habilitada'],
    energyAttribute: '',
    recommendations: ['Llevar agua y calzado de montaña'],
    coordinates: { lat: -30.857, lng: -64.515 },
    image: '/images/attractions/uritorco/uritorco-01.jpg',
    badge: 'Punto Oficial',
    bestTime: 'Mañana temprana',
  });

  const createEmptyActivity = (): AdventureActivity => ({
    id: `act-${Date.now()}`,
    title: '',
    modality: 'parapente',
    modalityLabel: 'Turismo Activo',
    location: 'Capilla del Monte',
    difficulty: 'Media',
    duration: '1 a 2 horas',
    description: '',
    suggestedGear: ['Calzado deportivo', 'Protector solar'],
    safetyRequirements: ['Guía habilitado por la Cámara de Turismo'],
    certifiedProviders: [{ name: '', contact: '', certificationBadge: 'Habilitación Municipal' }],
    coordinates: { lat: -30.857, lng: -64.515 },
    image: '/images/attractions/los-terrones/los-terrones-01.jpg',
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] tracking-tight font-['Outfit']">
            Circuitos Temáticos Oficiales
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Administrá las paradas y prestadores publicados en /atractivos?modo=circuitos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedNotice && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white">
              <Check className="w-3.5 h-3.5" />
              Guardado en servidor
            </span>
          )}
          <button
            type="button"
            onClick={() =>
              activeTab === 'mistico'
                ? setEditingSpot(createEmptySpot())
                : setEditingActivity(createEmptyActivity())
            }
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'mistico' ? 'Agregar Parada Mística' : 'Agregar Actividad'}</span>
          </button>
        </div>
      </div>

      {/* Tabs editoriales sin bandejas ni tarjetitis */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-sand-200)] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('mistico')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            activeTab === 'mistico'
              ? 'bg-[var(--color-sand-900)] text-white border-[var(--color-sand-900)]'
              : 'bg-transparent text-[var(--color-sand-700)] border-[var(--color-sand-300)] hover:border-[var(--color-sand-500)]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Circuito Místico & Energético ({config.mysticSpots.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('aventura')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            activeTab === 'aventura'
              ? 'bg-[var(--color-sand-900)] text-white border-[var(--color-sand-900)]'
              : 'bg-transparent text-[var(--color-sand-700)] border-[var(--color-sand-300)] hover:border-[var(--color-sand-500)]'
          }`}
        >
          <Mountain className="w-4 h-4" />
          <span>Turismo Alternativo & Aventura ({config.adventureActivities.length})</span>
        </button>

        <button
          type="button"
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-[var(--color-sand-200)] text-[var(--color-sand-400)] cursor-not-allowed"
        >
          <Utensils className="w-4 h-4" />
          <span>Sabores Serranos & Gastronomía</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-sand-700)] text-white">
            Próximamente
          </span>
        </button>
      </div>

      {/* Lista plana unificada (sin tarjetitis) */}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-[var(--color-sand-500)]">Cargando circuitos...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] divide-y divide-[var(--color-sand-200)] overflow-hidden">
          {activeTab === 'mistico'
            ? config.mysticSpots.map((spot) => (
                <div key={spot.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={spot.image}
                      alt={spot.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0 bg-sand-100"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[var(--color-sand-900)] truncate">{spot.title}</h3>
                      <p className="text-xs text-[var(--color-sand-500)] truncate">{spot.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingSpot({ ...spot })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDeleteSpot(spot.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            : config.adventureActivities.map((act) => (
                <div key={act.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={act.image || '/images/attractions/los-terrones/los-terrones-01.jpg'}
                      alt={act.title}
                      className="w-16 h-12 rounded-lg object-cover shrink-0 bg-sand-100"
                    />
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-[var(--color-sand-900)] truncate">{act.title}</h3>
                      <p className="text-xs text-[var(--color-sand-500)] truncate">
                        {act.modalityLabel} · {act.location} · {act.certifiedProviders?.[0]?.name || 'Sin prestador'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingActivity({ ...act })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleDeleteActivity(act.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Editor inline de Parada Mística */}
      {editingSpot && (
        <form
          onSubmit={handleSaveSpot}
          className="bg-white rounded-2xl border border-[var(--color-sand-300)] p-6 space-y-4"
        >
          <h2 className="font-display font-black text-lg text-[var(--color-sand-900)]">
            Editar Parada — Circuito Místico & Energético
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Título</span>
              <input
                required
                value={editingSpot.title}
                onChange={(e) => setEditingSpot({ ...editingSpot, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Subtítulo</span>
              <input
                required
                value={editingSpot.subtitle}
                onChange={(e) => setEditingSpot({ ...editingSpot, subtitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Horario sugerido</span>
              <input
                value={editingSpot.bestTime || ''}
                onChange={(e) => setEditingSpot({ ...editingSpot, bestTime: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Fotografía (Cloudinary o URL)</span>
              <div className="flex gap-2">
                <input
                  value={editingSpot.image}
                  onChange={(e) => setEditingSpot({ ...editingSpot, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
                />
                <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-sand-900)] text-white text-xs font-bold cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Subiendo...' : 'Subir'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadImage(file, (url) => setEditingSpot({ ...editingSpot, image: url }));
                    }}
                  />
                </label>
              </div>
            </label>
          </div>
          <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
            <span>Descripción</span>
            <textarea
              required
              rows={3}
              value={editingSpot.description}
              onChange={(e) => setEditingSpot({ ...editingSpot, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingSpot(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-700)] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-terracotta-600)] text-white cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Parada
            </button>
          </div>
        </form>
      )}

      {/* Editor inline de Actividad de Aventura */}
      {editingActivity && (
        <form
          onSubmit={handleSaveActivity}
          className="bg-white rounded-2xl border border-[var(--color-sand-300)] p-6 space-y-4"
        >
          <h2 className="font-display font-black text-lg text-[var(--color-sand-900)]">
            Editar Actividad — Turismo Alternativo & Aventura
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Título</span>
              <input
                required
                value={editingActivity.title}
                onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Ubicación</span>
              <input
                required
                value={editingActivity.location}
                onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Prestador habilitado</span>
              <input
                value={editingActivity.certifiedProviders?.[0]?.name || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    certifiedProviders: [
                      {
                        ...(editingActivity.certifiedProviders?.[0] || {
                          contact: '',
                          certificationBadge: 'Habilitación Municipal',
                        }),
                        name: e.target.value,
                      },
                    ],
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
            <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
              <span>Teléfono / WhatsApp del prestador</span>
              <input
                value={editingActivity.certifiedProviders?.[0]?.contact || ''}
                onChange={(e) =>
                  setEditingActivity({
                    ...editingActivity,
                    certifiedProviders: [
                      {
                        ...(editingActivity.certifiedProviders?.[0] || {
                          name: '',
                          certificationBadge: 'Habilitación Municipal',
                        }),
                        contact: e.target.value,
                      },
                    ],
                  })
                }
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
              />
            </label>
          </div>
          <label className="block space-y-1 text-xs font-bold text-[var(--color-sand-700)]">
            <span>Descripción</span>
            <textarea
              required
              rows={3}
              value={editingActivity.description}
              onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-[var(--color-sand-300)] text-sm font-normal"
            />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditingActivity(null)}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-700)] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-terracotta-600)] text-white cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Actividad
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
