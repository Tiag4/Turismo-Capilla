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
  { id: 'todos', label: 'Cualquier Dificultad' },
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
      {/* Fila 1: Píldoras de Categoría con scroll horizontal en mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-sand-900 text-white border-sand-900 shadow-xs'
                  : 'bg-white text-sand-700 border-sand-200/90 hover:bg-sand-100 hover:text-sand-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Fila 2: Filtro por Dificultad + Selector de Orden */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold uppercase tracking-wider text-sand-500">
            Dificultad:
          </span>
          {DIFFICULTIES.map((dif) => {
            const isActive = difficulty === dif.id;
            return (
              <button
                key={dif.id}
                type="button"
                onClick={() => onSelectDifficulty(dif.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  isActive
                    ? dif.id === 'Alta'
                      ? 'bg-terracotta-600 text-white border-terracotta-600'
                      : dif.id === 'Media'
                        ? 'bg-amber-600 text-white border-amber-600'
                        : dif.id === 'Baja'
                          ? 'bg-uritorco-600 text-white border-uritorco-600'
                          : 'bg-sand-800 text-white border-sand-800'
                    : 'bg-white text-sand-600 border-sand-200 hover:bg-sand-50'
                }`}
              >
                {dif.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-sand-500 hidden sm:inline">
            Mostrando <strong>{totalCount}</strong> atractivos
          </span>
          <div className="flex items-center gap-2 text-xs font-medium text-sand-700">
            <span className="text-sand-500">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'popular' | 'cercania' | 'dificultad')}
              className="bg-white border border-sand-300 rounded-lg px-2.5 py-1.5 text-xs text-sand-800 font-semibold focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
            >
              <option value="popular">Más destacados</option>
              <option value="cercania">Menor distancia</option>
              <option value="dificultad">Dificultad (Baja a Alta)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
