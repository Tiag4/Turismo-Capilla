import React from 'react';
import { Sparkles, Utensils, Mountain } from 'lucide-react';
import type { CircuitId } from './types/circuits.types';

interface CircuitTabsProps {
  activeCircuit: CircuitId;
  onSelectCircuit: (id: CircuitId) => void;
}

export const CircuitTabs: React.FC<CircuitTabsProps> = ({ activeCircuit, onSelectCircuit }) => {
  const tabs: { id: CircuitId; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'mistico',
      label: 'Circuito Místico & Energético',
      icon: <Sparkles className="w-4 h-4" />,
      badge: '5 Vórtices Sagrados'
    },
    {
      id: 'sabores',
      label: 'Sabores Turísticos',
      icon: <Utensils className="w-4 h-4" />,
      badge: '6 Locales Adheridos'
    },
    {
      id: 'aventura',
      label: 'Turismo Alternativo & Aventura',
      icon: <Mountain className="w-4 h-4" />,
      badge: '4 Modalidades Activas'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2.5 p-1.5 bg-sand-200/60 rounded-2xl border border-sand-300/60">
      {tabs.map((tab) => {
        const isActive = activeCircuit === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectCircuit(tab.id)}
            className={`flex-1 min-w-[200px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1 ${
              isActive
                ? 'bg-white text-sand-900 shadow-sm border border-sand-300'
                : 'text-sand-700 hover:text-sand-900 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={isActive ? 'text-terracotta-600' : 'text-sand-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </div>
            <span className="text-[11px] font-normal text-sand-500">
              {tab.badge}
            </span>
          </button>
        );
      })}
    </div>
  );
};
