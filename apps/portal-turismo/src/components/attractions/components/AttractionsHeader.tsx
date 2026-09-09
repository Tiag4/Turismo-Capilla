import React from 'react';

interface AttractionsHeaderProps {
  search: string;
  onSearchChange: (val: string) => void;
  totalCount: number;
}

export const AttractionsHeader: React.FC<AttractionsHeaderProps> = ({
  search,
  onSearchChange,
  totalCount,
}) => {
  return (
    <div className="border-b border-sand-200/80 pb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-uritorco-100 text-uritorco-800 text-xs font-semibold">
            <span>Circuitos Oficiales del Valle de Punilla</span>
            <span>•</span>
            <span>{totalCount} destinos verificados</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-sand-950 tracking-tight leading-[1.1]">
            Senderos, Cumbres y Balnearios Naturales
          </h1>
          <p className="text-sand-600 text-base sm:text-lg leading-relaxed">
            Explorá el Cerro Uritorco, quebradas agrestes, ollas de agua pura y cañones geológicos con fichas técnicas de altimetría, seguridad y recomendaciones de guardaparques.
          </p>
        </div>

        {/* Buscador Rápido con Input Disciplinado */}
        <div className="w-full md:w-80 lg:w-96">
          <label htmlFor="attractions-search" className="sr-only">
            Buscar senderos o atractivos
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="attractions-search"
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por cerro, cascada o paseo..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-sand-300 text-sand-900 text-sm placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sand-400 hover:text-sand-600 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
