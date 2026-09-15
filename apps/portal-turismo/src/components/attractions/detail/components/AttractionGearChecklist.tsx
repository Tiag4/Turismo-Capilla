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
    <div className="bg-white rounded-2xl border border-sand-200/90 p-6 sm:p-8 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-sand-100 pb-3">
        <div>
          <h3 className="font-display font-black text-lg text-sand-950">
            Checklist de Mochila & Equipamiento
          </h3>
          <p className="text-xs text-sand-600">
            Marcá los elementos indispensables mientras preparás tu salida a la montaña
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sand-900 text-white">
          {checkedCount}/{totalCount} listos
        </span>
      </div>

      <div className="space-y-2">
        {recommendedGear.map((gear, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm select-none ${
                isChecked
                  ? 'bg-sand-100 border-sand-300 text-sand-500 font-normal line-through'
                  : 'bg-white border-sand-200 text-sand-900 font-semibold hover:bg-sand-50'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleItem(idx)}
                className="w-4 h-4 rounded border-sand-400 text-sand-900 focus:ring-terracotta-500 cursor-pointer"
              />
              <span>{gear}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
