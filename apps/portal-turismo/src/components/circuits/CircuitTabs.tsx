import React from 'react';
import { Compass, Utensils, Mountain } from 'lucide-react';
import type { CircuitId } from './types/circuits.types';

interface CircuitTabsProps {
  activeCircuit: CircuitId;
  onSelectCircuit: (id: CircuitId) => void;
}

export const CircuitTabs: React.FC<CircuitTabsProps> = ({ activeCircuit, onSelectCircuit }) => {
  const tabs: { id: CircuitId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'mistico',
      label: 'Circuito Místico & Energético',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'sabores',
      label: 'Sabores Serranos & Gastronomía',
      icon: <Utensils className="w-4 h-4" />,
    },
    {
      id: 'aventura',
      label: 'Turismo Alternativo & Aventura',
      icon: <Mountain className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-sand-200/70 rounded-2xl border border-sand-300/70 max-w-fit">
      {tabs.map((tab) => {
        const isActive = activeCircuit === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCircuit(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-white text-sand-900 shadow-xs border border-sand-300/60'
                : 'text-sand-700 hover:text-sand-950 hover:bg-white/40'
            }`}
          >
            <span className={isActive ? 'text-terracotta-600' : 'text-sand-500'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
