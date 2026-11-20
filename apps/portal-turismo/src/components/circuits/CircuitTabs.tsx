import React from 'react';
import { Compass, Utensils, Mountain } from 'lucide-react';
import type { CircuitId } from './types/circuits.types';

interface CircuitTabsProps {
  activeCircuit: CircuitId;
  onSelectCircuit: (id: CircuitId) => void;
}

export const CircuitTabs: React.FC<CircuitTabsProps> = ({ activeCircuit, onSelectCircuit }) => {
  const tabs: { id: CircuitId; label: string; icon: React.ReactNode; comingSoon?: boolean }[] = [
    {
      id: 'mistico',
      label: 'Circuito Místico & Energético',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'aventura',
      label: 'Turismo Alternativo & Aventura',
      icon: <Mountain className="w-4 h-4" />,
    },
    {
      id: 'sabores',
      label: 'Sabores Serranos & Gastronomía',
      icon: <Utensils className="w-4 h-4" />,
      comingSoon: true,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {tabs.map((tab) => {
        const isActive = activeCircuit === tab.id && !tab.comingSoon;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.comingSoon}
            aria-disabled={tab.comingSoon}
            onClick={() => {
              if (!tab.comingSoon) onSelectCircuit(tab.id);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors border ${
              tab.comingSoon
                ? 'border-sand-200 bg-transparent text-sand-400 cursor-not-allowed'
                : isActive
                ? 'bg-sand-900 text-white border-sand-900 cursor-pointer'
                : 'bg-transparent text-sand-700 border-sand-300 hover:border-sand-500 hover:text-sand-950 cursor-pointer'
            }`}
          >
            <span className={tab.comingSoon ? 'text-sand-400' : isActive ? 'text-terracotta-400' : 'text-sand-500'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
            {tab.comingSoon && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sand-700 text-white">
                Próximamente
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
