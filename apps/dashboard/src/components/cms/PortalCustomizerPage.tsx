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
  Smartphone,
  Monitor,
  RotateCcw,
  ExternalLink,
  Check,
  Save,
  Layers,
  Type,
  Calendar,
  LayoutGrid,
  Loader,
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
import { usePreviewCommunication } from '../../hooks/usePreviewCommunication';

type CustomizerTab = 'sections' | 'hero' | 'events';

interface PortalCustomizerPageProps {
  onNavigateToEvents?: () => void;
}

export const PortalCustomizerPage: React.FC<PortalCustomizerPageProps> = ({
  onNavigateToEvents,
}) => {
  const [config, setConfig] = useState<PortalCMSConfig>(() => portalConfigService.getConfig());
  const [activeTab, setActiveTab] = useState<CustomizerTab>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
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
      if (sectionId === 'hero') {
        setActiveTab('hero');
      } else if (sectionId === 'culturalAgenda') {
        setActiveTab('events');
      } else {
        setActiveTab('sections');
      }
    },
  });

  // Sensores DnD Kit
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
        const newOrder = arrayMove(prev.sectionsOrder, oldIndex, newIndex);
        return {
          ...prev,
          sectionsOrder: newOrder,
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

  const handleHeroTitleChange = (val: string) => {
    setConfig((prev) => ({
      ...prev,
      heroConfig: {
        ...prev.heroConfig,
        title: val,
      },
    }));
  };

  const handleHeroSubtitleChange = (val: string) => {
    setConfig((prev) => ({
      ...prev,
      heroConfig: {
        ...prev.heroConfig,
        subtitle: val,
      },
    }));
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
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden bg-[var(--color-sand-100)] rounded-2xl border border-[var(--color-sand-200)] shadow-xs">
      {/* 1. Header Bar del Customizer */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-[var(--color-sand-200)] shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-emerald-portal-600)] flex items-center justify-center text-white font-bold text-xs">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm text-[var(--color-sand-900)] leading-tight">
              Personalizador de Portada (CMS en Tiempo Real)
            </h1>
            <p className="text-[11px] text-[var(--color-sand-500)]">
              Reordená secciones con drag & drop, ocultá bloques y actualizá contenidos en vivo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Indicador de Estado en Vivo (Badge Sólido) */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#005530] text-white text-[11px] font-bold shadow-xs">
            <span>Vista previa activa</span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            title="Restaurar orden y visibilidad por defecto"
            className="p-2 text-[var(--color-sand-500)] hover:text-[var(--color-sand-800)] hover:bg-[var(--color-sand-100)] rounded-xl transition-colors cursor-pointer"
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

      {/* 2. Cuerpo Principal Dividido (Split Layout) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Columna Izquierda: Panel de Controles (380px) */}
        <aside className="w-[380px] bg-white border-r border-[var(--color-sand-200)] flex flex-col shrink-0 overflow-hidden">
          {/* Pestañas de Edición */}
          <div className="flex border-b border-[var(--color-sand-200)] p-1.5 bg-[var(--color-sand-50)] shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sections'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
              <span>Secciones</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-[var(--color-emerald-portal-600)]" />
              <span>Hero Textos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                  : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Agenda #76</span>
            </button>
          </div>

          {/* Contenido de la Pestaña Activa con Scroll Independiente */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'sections' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-500)]">
                    Orden de la Portada
                  </span>
                  <span className="text-[11px] text-[var(--color-sand-400)]">
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
                            onSelect={(id) => setSelectedSectionId(id)}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Título Principal del Hero
                  </label>
                  <textarea
                    rows={3}
                    value={config.heroConfig.title}
                    onChange={(e) => handleHeroTitleChange(e.target.value)}
                    placeholder="Título principal..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                  />
                  <p className="text-[11px] text-[var(--color-sand-500)] mt-1">
                    Impacta instantáneamente en el titular con tipografía Outfit.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                    Subtítulo / Bajada Descriptiva
                  </label>
                  <textarea
                    rows={4}
                    value={config.heroConfig.subtitle}
                    onChange={(e) => handleHeroSubtitleChange(e.target.value)}
                    placeholder="Bajada descriptiva..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
                  />
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] text-[var(--color-sand-900)] space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--color-terracotta-600)]" />
                    <span className="text-xs font-bold text-[var(--color-sand-900)]">
                      Agenda Cultural Activa
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--color-sand-600)] leading-relaxed">
                    Eventos sincronizados en tiempo real con el catálogo municipal de Capilla del Monte.
                  </p>
                  {onNavigateToEvents && (
                    <button
                      type="button"
                      onClick={onNavigateToEvents}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Abrir Administrador de Eventos →
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-600)]">
                    Próximos Eventos en Portada ({events.length})
                  </span>
                  {events.map((evt: CulturalEvent) => (
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Columna Derecha: Canvas de Vista Previa (Iframe Responsive) */}
        <main className="flex-1 flex flex-col bg-stone-900 overflow-hidden relative">
          {/* Sub-header de controles del Canvas */}
          <div className="flex items-center justify-between px-4 py-2 bg-stone-950/90 border-b border-stone-800 text-stone-300 text-xs shrink-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-stone-400">
                Dispositivo de Previsualización:
              </span>
              <div className="inline-flex bg-stone-900 p-0.5 rounded-lg border border-stone-800">
                <button
                  type="button"
                  onClick={() => setViewMode('desktop')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'desktop'
                      ? 'bg-stone-700 text-white shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Vista Escritorio (Desktop)"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('mobile')}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === 'mobile'
                      ? 'bg-stone-700 text-white shadow-xs'
                      : 'text-stone-400 hover:text-white'
                  }`}
                  title="Vista Móvil (iPhone 14 - 390px)"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReloadIframe}
                title="Recargar vista previa"
                className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <a
                href={portalPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir portal en pestaña nueva"
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-[11px] cursor-pointer"
              >
                <span>Abrir portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Área del Canvas con Iframe */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative">
            {isIframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-950/70 backdrop-blur-xs z-30 pointer-events-none">
                <div className="flex flex-col items-center gap-3 text-white">
                  <Loader className="w-8 h-8 text-[var(--color-emerald-portal-600)] animate-spin" />
                  <span className="text-xs font-bold tracking-wider uppercase text-stone-300">
                    Cargando Portal en Tiempo Real...
                  </span>
                </div>
              </div>
            )}

            <div
              className={`relative bg-white transition-all duration-300 ease-in-out overflow-hidden shadow-2xl ${
                viewMode === 'mobile'
                  ? 'w-[390px] h-[844px] max-h-full rounded-3xl border-4 border-stone-800'
                  : 'w-full h-full rounded-xl border border-stone-800'
              }`}
            >
              <iframe
                ref={iframeRef}
                src={portalPreviewUrl}
                onLoad={() => {
                  setIsIframeLoading(false);
                  handleIframeLoad();
                }}
                className="block w-full h-full border-none bg-white"
                title="Vista previa interactiva del portal turístico"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
