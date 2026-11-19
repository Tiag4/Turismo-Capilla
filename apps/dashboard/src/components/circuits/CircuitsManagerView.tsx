import React, { useEffect, useState } from 'react';
import { Compass, Mountain, Utensils, Plus, Pencil, Trash2 } from 'lucide-react';
import { circuitsConfigService, DEFAULT_CIRCUITS_CONFIG } from '../../services/circuitsConfig.service';
import type { CircuitsConfig } from '../../types/circuits.types';
import { ConfirmDialog } from '../ui/ConfirmDialog';

type ActiveCircuitTab = 'mistico' | 'aventura';

export interface CircuitsManagerViewProps {
  initialCategory?: ActiveCircuitTab;
  onNavigateCreate: (category: ActiveCircuitTab) => void;
  onNavigateEdit: (category: ActiveCircuitTab, id: string) => void;
}

export const CircuitsManagerView: React.FC<CircuitsManagerViewProps> = ({
  initialCategory = 'mistico',
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const [config, setConfig] = useState<CircuitsConfig>(DEFAULT_CIRCUITS_CONFIG);
  const [activeTab, setActiveTab] = useState<ActiveCircuitTab>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    category: ActiveCircuitTab;
    id: string;
    title: string;
  } | null>(null);

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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const next: CircuitsConfig =
        deleteTarget.category === 'mistico'
          ? {
              ...config,
              mysticSpots: config.mysticSpots.filter((s) => s.id !== deleteTarget.id),
            }
          : {
              ...config,
              adventureActivities: config.adventureActivities.filter((a) => a.id !== deleteTarget.id),
            };
      await circuitsConfigService.saveConfig(next);
      setConfig(next);
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] tracking-tight font-['Outfit']">
            Circuitos Temáticos Oficiales
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Administrá las paradas, fichas técnicas y prestadores publicados en /atractivos?modo=circuitos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateCreate(activeTab)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-700)] text-white transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'mistico' ? 'Agregar Parada Mística' : 'Agregar Actividad'}</span>
        </button>
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
                      <p className="text-xs text-[var(--color-sand-500)] truncate">
                        {spot.subtitle} {spot.bestTime ? `· ${spot.bestTime}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onNavigateEdit('mistico', spot.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ category: 'mistico', id: spot.id, title: spot.title })
                      }
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
                        {act.modalityLabel} · Dif. {act.difficulty} · {act.location} ·{' '}
                        {act.certifiedProviders?.[0]?.name || 'Sin prestador'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onNavigateEdit('aventura', act.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--color-sand-300)] text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ category: 'aventura', id: act.id, title: act.title })
                      }
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

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        variant="danger"
        title="¿Eliminar elemento del circuito?"
        description={`Estás por eliminar "${deleteTarget?.title ?? ''}" del catálogo oficial de circuitos temáticos. Esta acción se reflejará inmediatamente en el portal turístico.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
      />
    </div>
  );
};
