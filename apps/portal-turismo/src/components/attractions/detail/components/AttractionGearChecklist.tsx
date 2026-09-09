import React, { useState } from 'react';

interface AttractionGearChecklistProps {
  recommendedGear: string[];
}

export const AttractionGearChecklist: React.FC<AttractionGearChecklistProps> = ({ recommendedGear }) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = recommendedGear.length;

  return (
    <div className="bg-white rounded-2xl border border-sand-200/90 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-sand-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-base text-sand-900">
            Checklist de Mochila & Equipamiento
          </h3>
          <p className="text-xs text-sand-500">
            Marcá los elementos mientras preparás tu salida
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-sand-100 text-sand-800">
          {checkedCount} de {totalCount} listos
        </span>
      </div>

      <div className="space-y-2">
        {recommendedGear.map((gear, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm select-none ${
                isChecked
                  ? 'bg-uritorco-50/60 border-uritorco-300 text-sand-900 font-medium'
                  : 'bg-sand-50/40 border-sand-200/80 text-sand-700 hover:bg-sand-100/50'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(idx)}
                className="w-4 h-4 rounded border-sand-300 text-uritorco-600 focus:ring-uritorco-500 cursor-pointer"
              />
              <span className={isChecked ? 'line-through text-sand-500' : ''}>
                {gear}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
