import React from 'react';
import { Smartphone, Monitor, RotateCcw, ExternalLink, Loader } from 'lucide-react';

export interface PreviewCanvasProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  portalPreviewUrl: string;
  viewMode: 'desktop' | 'mobile';
  onChangeViewMode: (mode: 'desktop' | 'mobile') => void;
  isIframeLoading: boolean;
  onReload: () => void;
  onIframeLoad: () => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  iframeRef,
  portalPreviewUrl,
  viewMode,
  onChangeViewMode,
  isIframeLoading,
  onReload,
  onIframeLoad,
}) => {
  return (
    <main className="flex-1 flex flex-col bg-stone-900 overflow-hidden relative">
      {/* Sub-header de controles del Canvas */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-stone-950 border-b border-stone-800 text-stone-300 text-xs shrink-0 z-20">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-stone-400">
            Vista Previa:
          </span>
          <div className="inline-flex bg-stone-900 p-0.5 rounded-lg border border-stone-800">
            <button
              type="button"
              onClick={() => onChangeViewMode('desktop')}
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
              onClick={() => onChangeViewMode('mobile')}
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
            onClick={onReload}
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
            <span>Abrir en ventana</span>
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
                Sincronizando Portal en Tiempo Real...
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
            onLoad={onIframeLoad}
            className="block w-full h-full border-none bg-white"
            title="Vista previa interactiva del portal turístico"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </main>
  );
};
