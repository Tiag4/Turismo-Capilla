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
    <section className="space-y-4 pt-8 border-t border-sand-200/80">
      <div className="flex items-center justify-between border-b border-sand-200/80 pb-3">
        <div>
          <h3 className="font-display font-black text-xl text-sand-950">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {recommendedGear.map((gear, idx) => {
          const isChecked = !!checkedItems[idx];
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer text-xs sm:text-sm select-none ${
                isChecked
                  ? 'bg-sand-200/50 border-sand-300 text-sand-400 font-normal line-through'
                  : 'bg-sand-100/50 border-sand-200/90 text-sand-900 font-semibold hover:bg-sand-100'
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
    </section>
  );
};
