import React, { useState, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  RotateCcw,
  Check,
  Save,
  Layers,
  Sliders,
  Calendar,
  LayoutGrid,
  Info,
} from 'lucide-react';
import { PORTAL_URL } from '../../config/navigation';
import { portalConfigService } from '../../services/portalConfig.service';
import { culturalEventsService } from '../../services/culturalEvents.service';
import {
  CANONICAL_HOME_SECTIONS,
  type PortalCMSConfig,
} from '../../types/portalConfig.types';
import type { CulturalEvent } from '../../types/culturalEvent.types';
import { SortableSectionItem } from './SortableSectionItem';
import { SectionEditorPanel } from './SectionEditorPanel';
import { PreviewCanvas } from './PreviewCanvas';
import { usePreviewCommunication } from '../../hooks/usePreviewCommunication';

type CustomizerTab = 'sections' | 'properties' | 'events';

export interface PortalCustomizerPageProps {
  onNavigateToEvents?: () => void;
  onNavigateToAccommodations?: () => void;
}

export const PortalCustomizerPage: React.FC<PortalCustomizerPageProps> = ({
  onNavigateToEvents,
  onNavigateToAccommodations,
}) => {
  const [config, setConfig] = useState<PortalCMSConfig>(() => portalConfigService.getConfig());
  const [activeTab, setActiveTab] = useState<CustomizerTab>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('hero');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const events = culturalEventsService.getActiveEvents();

  // Canal de sincronización en tiempo real
  const { handleIframeLoad } = usePreviewCommunication({
    iframeRef,
    config,
    events,
    onSelectSection: (sectionId) => {
      setSelectedSectionId(sectionId);
      setActiveTab('properties');
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setConfig((prev) => {
        const oldIndex = prev.sectionsOrder.indexOf(String(active.id));
        const newIndex = prev.sectionsOrder.indexOf(String(over.id));
        return {
          ...prev,
          sectionsOrder: arrayMove(prev.sectionsOrder, oldIndex, newIndex),
        };
      });
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [sectionId]: prev.sectionsVisibility[sectionId] === false ? true : false,
      },
    }));
  };

  const handleSelectSection = (sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveTab('properties');
  };

  const handleSave = () => {
    portalConfigService.saveConfig(config);
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 2500);
  };

  const handleReset = () => {
    const reset = portalConfigService.resetConfig();
    setConfig(reset);
  };

  const handleReloadIframe = () => {
    setIsIframeLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = `${PORTAL_URL}/?preview=true&t=${Date.now()}`;
    }
  };

  const portalPreviewUrl = `${PORTAL_URL}/?preview=true`;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[var(--color-sand-100)]">
      {/* 1. Barra de Herramientas Superior del Studio CMS */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[var(--color-sand-200)] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white font-bold text-xs">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm text-[var(--color-sand-900)] leading-tight">
              Personalizador de Portada
            </h1>
            <p className="text-[11px] text-[var(--color-sand-600)]">
              Reordená secciones en vivo y personalizá los textos de la página principal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#005530] text-white text-[11px] font-bold shadow-xs">
            <span>Sincronización en vivo</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Restaurar valores de fábrica"
            className="p-2 text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-[var(--color-sand-100)] rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide shadow-xs transition-all cursor-pointer ${
              isSavedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] text-white'
            }`}
          >
            {isSavedRecently ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Publicado con Éxito!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Publicar Cambios</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Cuerpo Workbench Dividido (Split Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Columna Izquierda: Inspector y Controles (380px) */}
        <aside className="w-[380px] bg-white border-r border-[var(--color-sand-200)] flex flex-col shrink-0 overflow-hidden">
          {/* Pestañas de Control */}
          <div className="flex border-b border-[var(--color-sand-200)] p-1.5 bg-[var(--color-sand-50)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
              <span>Estructura</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('properties')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'properties'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[var(--color-emerald-portal-600)]" />
              <span>Propiedades</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Agenda</span>
            </button>
          </div>

          {/* Contenido scrolleable del Inspector */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'sections' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-600)]">
                    Orden de la Portada
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-500)]">
                    Arrastrá para reordenar
                  </span>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={config.sectionsOrder}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {config.sectionsOrder.map((sectionId, idx) => {
                        const sectionMeta = CANONICAL_HOME_SECTIONS.find((s) => s.id === sectionId) || {
                          id: sectionId,
                          name: sectionId,
                          description: 'Sección del portal',
                          category: 'content' as const,
                        };
                        const isVisible = config.sectionsVisibility[sectionId] !== false;
                        const isSelected = selectedSectionId === sectionId;

                        return (
                          <SortableSectionItem
                            key={sectionId}
                            section={sectionMeta}
                            index={idx}
                            isVisible={isVisible}
                            isSelected={isSelected}
                            onToggleVisibility={handleToggleVisibility}
                            onSelect={handleSelectSection}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {activeTab === 'properties' && (
              <SectionEditorPanel
                selectedSectionId={selectedSectionId}
                config={config}
                onChangeHeroTitle={(title) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroConfig: { ...prev.heroConfig, title },
                  }))
                }
                onChangeHeroSubtitle={(subtitle) =>
                  setConfig((prev) => ({
                    ...prev,
                    heroConfig: { ...prev.heroConfig, subtitle },
                  }))
                }
                onChangeCtaTitle={(title) =>
                  setConfig((prev) => ({
                    ...prev,
                    finalCtaConfig: {
                      title,
                      subtitle: prev.finalCtaConfig?.subtitle ?? '',
                      buttonText: prev.finalCtaConfig?.buttonText ?? 'Explorar ahora',
                    },
                  }))
                }
                onChangeCtaSubtitle={(subtitle) =>
                  setConfig((prev) => ({
                    ...prev,
                    finalCtaConfig: {
                      title: prev.finalCtaConfig?.title ?? '',
                      subtitle,
                      buttonText: prev.finalCtaConfig?.buttonText ?? 'Explorar ahora',
                    },
                  }))
                }
                onChangeCtaButtonText={(buttonText) =>
                  setConfig((prev) => ({
                    ...prev,
                    finalCtaConfig: {
                      title: prev.finalCtaConfig?.title ?? '',
                      subtitle: prev.finalCtaConfig?.subtitle ?? '',
                      buttonText,
                    },
                  }))
                }
                onChangeUritorcoTitle={(title) =>
                  setConfig((prev) => ({
                    ...prev,
                    uritorcoConfig: {
                      title,
                      subtitle: prev.uritorcoConfig?.subtitle ?? '',
                    },
                  }))
                }
                onChangeUritorcoSubtitle={(subtitle) =>
                  setConfig((prev) => ({
                    ...prev,
                    uritorcoConfig: {
                      title: prev.uritorcoConfig?.title ?? '',
                      subtitle,
                    },
                  }))
                }
                onNavigateToEvents={onNavigateToEvents}
                onNavigateToAccommodations={onNavigateToAccommodations}
              />
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-200)] text-[var(--color-sand-900)] space-y-3 shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-terracotta-600)]" />
                    <span className="text-xs font-bold text-[var(--color-sand-900)]">
                      Eventos Activos en Portada
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-sand-600)] leading-relaxed">
                    Eventos sincronizados en tiempo real con la Agenda Cultural Municipal.
                  </p>
                  {onNavigateToEvents && (
                    <button
                      type="button"
                      onClick={onNavigateToEvents}
                      className="w-full mt-1 py-2.5 px-3 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] active:bg-[var(--color-emerald-portal-900)] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                    >
                      Abrir Administrador de Eventos →
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-950 uppercase tracking-wide">
                    <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Regla de Ocultamiento Automático</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                    Si no hay eventos activos programados (0 eventos), este bloque se <strong>ocultará automáticamente en el portal público</strong> para los turistas.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-600)]">
                    Próximos en Cartelera ({events.length})
                  </span>
                  {events.length === 0 ? (
                    <p className="text-xs text-[var(--color-sand-500)] italic p-3 text-center bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)]">
                      No hay eventos publicados actualmente.
                    </p>
                  ) : (
                    events.map((evt: CulturalEvent) => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] flex items-center justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[var(--color-sand-900)] truncate">
                            {evt.title}
                          </p>
                          <p className="text-[10px] text-[var(--color-sand-500)] truncate">
                            {evt.startDate} • {evt.location}
                          </p>
                        </div>
                        <span className="ml-2 text-[10px] font-black uppercase text-[var(--color-terracotta-600)] shrink-0">
                          {evt.isFree ? 'Gratis' : `$${(evt.price ?? 0).toLocaleString('es-AR')}`}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Columna Derecha: Canvas de Vista Previa */}
        <PreviewCanvas
          iframeRef={iframeRef}
          portalPreviewUrl={portalPreviewUrl}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          isIframeLoading={isIframeLoading}
          onReload={handleReloadIframe}
          onIframeLoad={() => {
            setIsIframeLoading(false);
            handleIframeLoad();
          }}
        />
      </div>
    </div>
  );
};
