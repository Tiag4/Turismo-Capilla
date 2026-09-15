import React from 'react';
import type { AttractionCategory, AttractionDifficulty } from '../types';

interface AttractionsFilterBarProps {
  category: AttractionCategory;
  onSelectCategory: (cat: AttractionCategory) => void;
  difficulty: 'todos' | AttractionDifficulty;
  onSelectDifficulty: (dif: 'todos' | AttractionDifficulty) => void;
  sortBy: 'popular' | 'cercania' | 'dificultad';
  onSortChange: (s: 'popular' | 'cercania' | 'dificultad') => void;
  totalCount: number;
}

const CATEGORIES: { id: AttractionCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'trekking', label: 'Trekking & Cumbres' },
  { id: 'balneario', label: 'Balnearios & Cascadas' },
  { id: 'rocas', label: 'Formaciones Rocosas' },
  { id: 'mirador', label: 'Miradores' },
  { id: 'cultura', label: 'Patrimonio Cultural' },
];

const DIFFICULTIES: { id: 'todos' | AttractionDifficulty; label: string }[] = [
  { id: 'todos', label: 'Todas' },
  { id: 'Baja', label: 'Baja' },
  { id: 'Media', label: 'Media' },
  { id: 'Alta', label: 'Alta' },
];

export const AttractionsFilterBar: React.FC<AttractionsFilterBarProps> = ({
  category,
  onSelectCategory,
  difficulty,
  onSelectDifficulty,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  return (
    <div className="space-y-4">
      {/* Selector de Categorías Plano Integrado (Anti-Vibecoded) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-sand-900 text-white shadow-xs'
                  : 'text-sand-700 hover:text-sand-950 hover:bg-sand-200/60'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Barra Secundaria: Filtro de Dificultad Plano y Orden */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-sand-200/60">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-sand-500 mr-1">
            Dificultad:
          </span>
          {DIFFICULTIES.map((dif) => {
            const isActive = difficulty === dif.id;
            return (
              <button
                key={dif.id}
                type="button"
                onClick={() => onSelectDifficulty(dif.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  isActive
                    ? dif.id === 'Alta'
                      ? 'bg-terracotta-600 text-white'
                      : dif.id === 'Media'
                        ? 'bg-amber-600 text-white'
                        : dif.id === 'Baja'
                          ? 'bg-uritorco-700 text-white'
                          : 'bg-sand-900 text-white'
                    : 'text-sand-700 hover:bg-sand-200/60 hover:text-sand-900'
                }`}
              >
                {dif.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-sand-600 font-medium">
            <strong>{totalCount}</strong> atractivos
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold text-sand-700">
            <label htmlFor="sort-attractions" className="text-sand-500 font-normal">
              Ordenar:
            </label>
            <select
              id="sort-attractions"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'popular' | 'cercania' | 'dificultad')}
              className="bg-sand-100 hover:bg-sand-200/80 border-none rounded-lg px-2.5 py-1.5 text-xs text-sand-900 font-bold focus:outline-none focus:ring-2 focus:ring-terracotta-500 cursor-pointer transition-colors"
            >
              <option value="popular">Más destacados</option>
              <option value="cercania">Menor distancia</option>
              <option value="dificultad">Dificultad</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
