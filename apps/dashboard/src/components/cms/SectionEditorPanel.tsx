import React, { useState, useRef } from 'react';
import {
  Calendar,
  Home,
  Layers,
  ArrowRight,
  Info,
  Upload,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CANONICAL_HOME_SECTIONS, type PortalCMSConfig } from '../../types/portalConfig.types';
import { mediaService } from '../../services/media.service';

export interface SectionEditorPanelProps {
  selectedSectionId: string | null;
  config: PortalCMSConfig;
  onChangeHeroTitle: (val: string) => void;
  onChangeHeroSubtitle: (val: string) => void;
  onChangeHeroImageUrl?: (val: string) => void;
  onChangeDuoWhatToDoImageUrl?: (val: string) => void;
  onChangeDuoWhatToDoSubtitle?: (val: string) => void;
  onChangeDuoWhereToSleepImageUrl?: (val: string) => void;
  onChangeDuoWhereToSleepSubtitle?: (val: string) => void;
  onChangeCtaTitle: (val: string) => void;
  onChangeCtaSubtitle: (val: string) => void;
  onChangeCtaButtonText: (val: string) => void;
  onChangeUritorcoTitle: (val: string) => void;
  onChangeUritorcoSubtitle: (val: string) => void;
  onNavigateToEvents?: () => void;
  onNavigateToAccommodations?: () => void;
}

export const SectionEditorPanel: React.FC<SectionEditorPanelProps> = ({
  selectedSectionId,
  config,
  onChangeHeroTitle,
  onChangeHeroSubtitle,
  onChangeHeroImageUrl,
  onChangeDuoWhatToDoImageUrl,
  onChangeDuoWhatToDoSubtitle,
  onChangeDuoWhereToSleepImageUrl,
  onChangeDuoWhereToSleepSubtitle,
  onChangeCtaTitle,
  onChangeCtaSubtitle,
  onChangeCtaButtonText,
  onChangeUritorcoTitle,
  onChangeUritorcoSubtitle,
  onNavigateToEvents,
  onNavigateToAccommodations,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Estados para subida de imágenes de DuoAccess
  const [isUploadingWhat, setIsUploadingWhat] = useState(false);
  const [whatUploadError, setWhatUploadError] = useState<string | null>(null);
  const [whatUploadSuccess, setWhatUploadSuccess] = useState(false);
  const whatFileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploadingSleep, setIsUploadingSleep] = useState(false);
  const [sleepUploadError, setSleepUploadError] = useState<string | null>(null);
  const [sleepUploadSuccess, setSleepUploadSuccess] = useState(false);
  const sleepFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!selectedSectionId) {
    return (
      <div className="p-8 text-center text-[var(--color-sand-500)] flex flex-col items-center justify-center h-64 space-y-2">
        <Layers className="w-8 h-8 text-[var(--color-sand-400)] mb-1" />
        <p className="text-xs font-bold text-[var(--color-sand-700)]">
          Ninguna sección seleccionada
        </p>
        <p className="text-[11px] max-w-xs">
          Hacé clic en cualquier bloque del listado o en el portal para editar sus textos o ver su origen.
        </p>
      </div>
    );
  }

  const sectionMeta = CANONICAL_HOME_SECTIONS.find((s) => s.id === selectedSectionId) || {
    id: selectedSectionId,
    name: selectedSectionId,
    description: '',
    category: 'content' as const,
  };

  const isVisible = config.sectionsVisibility[selectedSectionId] !== false;

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('La imagen no puede superar los 8 MB de tamaño.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(false);
      const res = await mediaService.uploadImage(file, 'portal/hero');
      if (res?.url && onChangeHeroImageUrl) {
        onChangeHeroImageUrl(res.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to upload hero image to Cloudinary:', err);
      setUploadError('Error al subir a Cloudinary. Verificá que el backend esté encendido.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleWhatImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setWhatUploadError('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setWhatUploadError('La imagen no puede superar los 8 MB de tamaño.');
      return;
    }

    try {
      setIsUploadingWhat(true);
      setWhatUploadError(null);
      setWhatUploadSuccess(false);
      const res = await mediaService.uploadImage(file, 'portal/duo-access');
      if (res?.url && onChangeDuoWhatToDoImageUrl) {
        onChangeDuoWhatToDoImageUrl(res.url);
        setWhatUploadSuccess(true);
        setTimeout(() => setWhatUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to upload what-to-do image to Cloudinary:', err);
      setWhatUploadError('Error al subir a Cloudinary. Verificá que el backend esté encendido.');
    } finally {
      setIsUploadingWhat(false);
      if (whatFileInputRef.current) {
        whatFileInputRef.current.value = '';
      }
    }
  };

  const handleSleepImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSleepUploadError('El archivo seleccionado debe ser una imagen válida (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setSleepUploadError('La imagen no puede superar los 8 MB de tamaño.');
      return;
    }

    try {
      setIsUploadingSleep(true);
      setSleepUploadError(null);
      setSleepUploadSuccess(false);
      const res = await mediaService.uploadImage(file, 'portal/duo-access');
      if (res?.url && onChangeDuoWhereToSleepImageUrl) {
        onChangeDuoWhereToSleepImageUrl(res.url);
        setSleepUploadSuccess(true);
        setTimeout(() => setSleepUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to upload where-to-sleep image to Cloudinary:', err);
      setSleepUploadError('Error al subir a Cloudinary. Verificá que el backend esté encendido.');
    } finally {
      setIsUploadingSleep(false);
      if (sleepFileInputRef.current) {
        sleepFileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabecera de la sección seleccionada con badges de alto contraste */}
      <div className="pb-3 border-b border-[var(--color-sand-200)] flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--color-sand-800)] text-white shadow-2xs">
            {sectionMeta.category}
          </span>
          <h3 className="font-display font-extrabold text-sm text-[var(--color-sand-900)] mt-1.5">
            {sectionMeta.name}
          </h3>
          <p className="text-[11px] text-[var(--color-sand-600)] leading-tight mt-0.5">
            {sectionMeta.description}
          </p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md shrink-0 shadow-2xs ${
            isVisible ? 'bg-[#1C8B68] text-white' : 'bg-stone-700 text-white'
          }`}
        >
          {isVisible ? 'Visible' : 'Oculto'}
        </span>
      </div>

      {/* Editor según el tipo de sección */}
      {selectedSectionId === 'hero' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Título Principal del Hero
            </label>
            <textarea
              rows={3}
              value={config.heroConfig.title}
              onChange={(e) => onChangeHeroTitle(e.target.value)}
              placeholder="Título principal..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Subtítulo / Bajada Descriptiva
            </label>
            <textarea
              rows={4}
              value={config.heroConfig.subtitle}
              onChange={(e) => onChangeHeroSubtitle(e.target.value)}
              placeholder="Bajada descriptiva..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>

          {/* Fotografía de Fondo con Cloudinary */}
          <div className="pt-3 border-t border-[var(--color-sand-200)] space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
                Fotografía Panorámica (Hero)
              </label>
              {config.heroConfig.imageUrl && config.heroConfig.imageUrl !== '/images/attractions/uritorco/uritorco-02.jpg' && (
                <button
                  type="button"
                  onClick={() => onChangeHeroImageUrl?.('/images/attractions/uritorco/uritorco-02.jpg')}
                  className="text-[11px] font-bold text-[var(--color-terracotta-600)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  title="Restaurar fotografía original del Cerro Uritorco"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restaurar original</span>
                </button>
              )}
            </div>

            {/* Previsualización de la Imagen */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--color-sand-300)] bg-stone-900 shadow-inner group">
              <img
                src={config.heroConfig.imageUrl || '/images/attractions/uritorco/uritorco-02.jpg'}
                alt="Vista previa del hero"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                <span className="text-[11px] text-white font-medium">
                  {config.heroConfig.imageUrl?.includes('cloudinary')
                    ? '☁️ Alojada en Cloudinary'
                    : '🌲 Fotografía Oficial (Local)'}
                </span>
              </div>
            </div>

            {/* Botón de Selección y Subida a Cloudinary */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleHeroImageUpload}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isUploading
                  ? 'bg-[var(--color-sand-200)] text-[var(--color-sand-500)] cursor-not-allowed'
                  : 'bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subiendo a Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Cambiar Imagen (Subir a Cloudinary)</span>
                </>
              )}
            </button>

            {/* Input para URL manual o pegado */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-sand-600)] mb-1">
                O ingresá/pegá una URL directa de imagen:
              </label>
              <input
                type="url"
                value={config.heroConfig.imageUrl ?? ''}
                onChange={(e) => onChangeHeroImageUrl?.(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
              />
            </div>

            {/* Alertas de Estado */}
            {uploadError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Imagen subida con éxito a Cloudinary y vinculada al Hero.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedSectionId === 'finalCta' && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Título de Cierre
            </label>
            <input
              type="text"
              value={config.finalCtaConfig?.title ?? ''}
              onChange={(e) => onChangeCtaTitle(e.target.value)}
              placeholder="¿Listo para descubrir Capilla del Monte?"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Bajada / Subtítulo
            </label>
            <textarea
              rows={3}
              value={config.finalCtaConfig?.subtitle ?? ''}
              onChange={(e) => onChangeCtaSubtitle(e.target.value)}
              placeholder="Encontrá tu próximo lugar favorito..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Texto del Botón Principal
            </label>
            <input
              type="text"
              value={config.finalCtaConfig?.buttonText ?? ''}
              onChange={(e) => onChangeCtaButtonText(e.target.value)}
              placeholder="Explorar ahora"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>
        </div>
      )}

      {selectedSectionId === 'uritorcoHighlight' && (
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Título del Bloque
            </label>
            <input
              type="text"
              value={config.uritorcoConfig?.title ?? ''}
              onChange={(e) => onChangeUritorcoTitle(e.target.value)}
              placeholder="Cerro Uritorco"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
              Descripción Informativa
            </label>
            <textarea
              rows={4}
              value={config.uritorcoConfig?.subtitle ?? ''}
              onChange={(e) => onChangeUritorcoSubtitle(e.target.value)}
              placeholder="El pico más alto de las Sierras Chicas..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
            />
          </div>
        </div>
      )}

      {selectedSectionId === 'culturalAgenda' && (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-200)] shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-[var(--color-emerald-portal-600)] font-bold text-xs">
              <Calendar className="w-4 h-4" />
              <span>Módulo Autónomo: Agenda Cultural</span>
            </div>
            <p className="text-[11px] text-[var(--color-sand-600)] leading-relaxed">
              Los eventos y festivales exhibidos en este bloque se gestionan de forma centralizada con imágenes, fechas y aranceles oficiales.
            </p>
            {onNavigateToEvents && (
              <button
                type="button"
                onClick={onNavigateToEvents}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] active:bg-[var(--color-emerald-portal-900)] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <span>Ir a Gestionar Eventos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-950 uppercase tracking-wide">
              <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Regla de Publicación Automática</span>
            </div>
            <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
              Si no hay eventos activos programados, esta sección se <strong>oculta automáticamente en el portal público</strong> para no exhibir un bloque vacío a los turistas. En la vista previa siempre permanecerá visible para que puedas reordenarla.
            </p>
          </div>
        </div>
      )}

      {selectedSectionId === 'featuredCabins' && (
        <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-200)] shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-[var(--color-terracotta-600)] font-bold text-xs">
            <Home className="w-4 h-4" />
            <span>Módulo Autónomo: Alojamientos</span>
          </div>
          <p className="text-[11px] text-[var(--color-sand-600)] leading-relaxed">
            Exhibe los establecimientos formalmente habilitados por el municipio con disponibilidad inmediata y tarifas verificadas.
          </p>
          {onNavigateToAccommodations && (
            <button
              type="button"
              onClick={onNavigateToAccommodations}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] active:bg-[var(--color-terracotta-700)] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <span>Ir a Prestadores Adheridos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {selectedSectionId === 'duoAccess' && (
        <div className="space-y-5">
          {/* Tarjeta 1: Qué Hacer */}
          <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-sand-200)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-emerald-portal-700)] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Tarjeta A
                </span>
                <h4 className="font-display font-black text-xs text-[var(--color-sand-900)] mt-1">
                  Qué Hacer (Paseos & Senderos)
                </h4>
              </div>
              {config.duoAccessConfig?.whatToDoImageUrl &&
                config.duoAccessConfig.whatToDoImageUrl !==
                  '/images/attractions/los-terrones/los-terrones-01.jpg' && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeDuoWhatToDoImageUrl?.(
                        '/images/attractions/los-terrones/los-terrones-01.jpg'
                      )
                    }
                    className="text-[11px] font-bold text-[var(--color-terracotta-600)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    title="Restaurar fotografía predeterminada de Los Terrones"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar foto</span>
                  </button>
                )}
            </div>

            {/* Vista previa de imagen Qué Hacer */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--color-sand-300)] bg-stone-900 shadow-inner group">
              <img
                src={
                  config.duoAccessConfig?.whatToDoImageUrl ||
                  '/images/attractions/los-terrones/los-terrones-01.jpg'
                }
                alt="Vista previa de Qué Hacer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[10px] text-white font-medium">
                  {config.duoAccessConfig?.whatToDoImageUrl?.includes('cloudinary')
                    ? '☁️ Alojada en Cloudinary'
                    : '🏔️ Fotografía Predeterminada (Los Terrones)'}
                </span>
              </div>
            </div>

            {/* Subida a Cloudinary para Qué Hacer */}
            <input
              ref={whatFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleWhatImageUpload}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploadingWhat}
              onClick={() => whatFileInputRef.current?.click()}
              className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isUploadingWhat
                  ? 'bg-[var(--color-sand-200)] text-[var(--color-sand-500)] cursor-not-allowed'
                  : 'bg-[var(--color-emerald-portal-600)] hover:bg-[var(--color-emerald-portal-700)] text-white'
              }`}
            >
              {isUploadingWhat ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo a Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagen a Cloudinary</span>
                </>
              )}
            </button>

            {/* URL manual Qué Hacer */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-sand-600)] mb-1">
                O ingresá/pegá una URL directa:
              </label>
              <input
                type="url"
                value={config.duoAccessConfig?.whatToDoImageUrl ?? ''}
                onChange={(e) => onChangeDuoWhatToDoImageUrl?.(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
              />
            </div>

            {whatUploadError && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{whatUploadError}</span>
              </div>
            )}

            {whatUploadSuccess && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Imagen subida con éxito y aplicada a 'Qué Hacer'.</span>
              </div>
            )}

            {/* Bajada Qué Hacer */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                Bajada Descriptiva / Subtítulo
              </label>
              <textarea
                rows={3}
                value={config.duoAccessConfig?.whatToDoSubtitle ?? ''}
                onChange={(e) => onChangeDuoWhatToDoSubtitle?.(e.target.value)}
                placeholder="12 senderos catalogados: ascensos al Cerro Uritorco, cañadones rojizos en Los Terrones..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-emerald-portal-600)]"
              />
            </div>
          </div>

          {/* Tarjeta 2: Dónde Dormir */}
          <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-sand-200)]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[var(--color-terracotta-700)] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Tarjeta B
                </span>
                <h4 className="font-display font-black text-xs text-[var(--color-sand-900)] mt-1">
                  Dónde Dormir (Cabañas & Posadas)
                </h4>
              </div>
              {config.duoAccessConfig?.whereToSleepImageUrl &&
                config.duoAccessConfig.whereToSleepImageUrl !==
                  '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg' && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeDuoWhereToSleepImageUrl?.(
                        '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg'
                      )
                    }
                    className="text-[11px] font-bold text-[var(--color-terracotta-600)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    title="Restaurar fotografía predeterminada de Cabañas"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar foto</span>
                  </button>
                )}
            </div>

            {/* Vista previa de imagen Dónde Dormir */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--color-sand-300)] bg-stone-900 shadow-inner group">
              <img
                src={
                  config.duoAccessConfig?.whereToSleepImageUrl ||
                  '/images/accommodations/el-aguaribay/el-aguaribay-01.jpg'
                }
                alt="Vista previa de Dónde Dormir"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                <span className="text-[10px] text-white font-medium">
                  {config.duoAccessConfig?.whereToSleepImageUrl?.includes('cloudinary')
                    ? '☁️ Alojada en Cloudinary'
                    : '🏡 Fotografía Predeterminada (Cabañas Serranas)'}
                </span>
              </div>
            </div>

            {/* Subida a Cloudinary para Dónde Dormir */}
            <input
              ref={sleepFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              onChange={handleSleepImageUpload}
              className="hidden"
            />

            <button
              type="button"
              disabled={isUploadingSleep}
              onClick={() => sleepFileInputRef.current?.click()}
              className={`w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                isUploadingSleep
                  ? 'bg-[var(--color-sand-200)] text-[var(--color-sand-500)] cursor-not-allowed'
                  : 'bg-[var(--color-terracotta-500)] hover:bg-[var(--color-terracotta-600)] text-white'
              }`}
            >
              {isUploadingSleep ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo a Cloudinary...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Imagen a Cloudinary</span>
                </>
              )}
            </button>

            {/* URL manual Dónde Dormir */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--color-sand-600)] mb-1">
                O ingresá/pegá una URL directa:
              </label>
              <input
                type="url"
                value={config.duoAccessConfig?.whereToSleepImageUrl ?? ''}
                onChange={(e) => onChangeDuoWhereToSleepImageUrl?.(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
              />
            </div>

            {sleepUploadError && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{sleepUploadError}</span>
              </div>
            )}

            {sleepUploadSuccess && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Imagen subida con éxito y aplicada a 'Dónde Dormir'.</span>
              </div>
            )}

            {/* Bajada Dónde Dormir */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-sand-800)] mb-1">
                Bajada Descriptiva / Subtítulo
              </label>
              <textarea
                rows={3}
                value={config.duoAccessConfig?.whereToSleepSubtitle ?? ''}
                onChange={(e) => onChangeDuoWhereToSleepSubtitle?.(e.target.value)}
                placeholder="Cabañas de piedra y algarrobo, posadas de montaña y hosterías de época..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-[var(--color-sand-200)] bg-[var(--color-sand-50)] text-[var(--color-sand-900)] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[var(--color-terracotta-500)]"
              />
            </div>
          </div>
        </div>
      )}

      {['featuredAttractions', 'astrotourismTeaser', 'valleyMap'].includes(selectedSectionId) && (
        <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-200)] shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-[var(--color-sand-700)] font-bold text-xs">
            <Info className="w-4 h-4" />
            <span>Bloque Estructural del Portal</span>
          </div>
          <p className="text-[11px] text-[var(--color-sand-600)] leading-relaxed">
            Esta sección opera con contenido geográfico y de catálogo turístico oficial. Podés alternar su visibilidad u ordenarla en la portada desde la pestaña de Estructura.
          </p>
        </div>
      )}
    </div>
  );
};
