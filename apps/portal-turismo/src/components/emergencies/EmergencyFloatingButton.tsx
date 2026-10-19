import React from 'react';
import { PhoneCall } from 'lucide-react';

interface EmergencyFloatingButtonProps {
  onOpen: () => void;
}

export const EmergencyFloatingButton: React.FC<EmergencyFloatingButtonProps> = ({ onOpen }) => {
  return (
    <aside aria-label="Acceso rápido a emergencias" className="fixed bottom-6 right-6 z-[100]">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Abrir emergencias y rescate"
        className="group flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer border-2 border-white ring-4 ring-red-600/20"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
        <PhoneCall className="w-4 h-4 text-white" />
        <span className="text-xs font-black uppercase tracking-wider font-display">
          SOS Emergencias
        </span>
      </button>
    </aside>
  );
};
