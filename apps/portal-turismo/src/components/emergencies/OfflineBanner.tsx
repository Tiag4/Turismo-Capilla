import React from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';
import { useNetworkStatus } from './hooks/useNetworkStatus';

interface OfflineBannerProps {
  onOpenEmergencies?: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ onOpenEmergencies }) => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-900 text-amber-50 px-4 py-2.5 shadow-md border-b border-amber-700/80 sticky top-0 z-[120] transition-all animate-in fade-in slide-in-from-top duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 text-center sm:text-left">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="font-medium text-amber-100">
            Estás en modo sin conexión. La información de emergencias sigue disponible.
          </span>
        </div>

        {onOpenEmergencies && (
          <button
            type="button"
            onClick={onOpenEmergencies}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-sand-950 font-bold text-xs transition-colors cursor-pointer shrink-0"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Ver Ficha de Emergencias</span>
          </button>
        )}
      </div>
    </div>
  );
};
