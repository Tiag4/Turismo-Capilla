import React from 'react';
import { useLocation } from 'react-router-dom';
import { PhoneCall } from 'lucide-react';

interface EmergencyFloatingButtonProps {
  onOpen: () => void;
}

export const EmergencyFloatingButton: React.FC<EmergencyFloatingButtonProps> = ({ onOpen }) => {
  const location = useLocation();
  // Elevate button only when the accommodation detail mobile bottom dock is active
  const hasBottomDock =
    location.pathname.startsWith('/alojamientos/') &&
    !location.pathname.endsWith('/reservar');

  return (
    <aside
      aria-label="Acceso rápido a emergencias"
      className={`fixed right-4 sm:right-6 z-40 transition-all duration-300 print:hidden ${
        hasBottomDock ? 'bottom-24 sm:bottom-28' : 'bottom-4 sm:bottom-6'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-label="Abrir emergencias y rescate"
        className="group flex items-center gap-2 sm:gap-2.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer border-2 border-white ring-4 ring-red-600/20"
      >
        <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white" />
        </span>
        <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        <span className="text-xs font-black uppercase tracking-wider font-display">
          <span className="sm:hidden">SOS</span>
          <span className="hidden sm:inline">SOS Emergencias</span>
        </span>
      </button>
    </aside>
  );
};
