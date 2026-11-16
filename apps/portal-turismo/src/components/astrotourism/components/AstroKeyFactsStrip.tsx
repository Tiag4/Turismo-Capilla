import React from 'react';
import type { AstroKeyFact } from '../types';

interface AstroKeyFactsStripProps {
  facts: AstroKeyFact[];
}

export const AstroKeyFactsStrip: React.FC<AstroKeyFactsStripProps> = ({ facts }) => {
  return (
    <section aria-label="Datos clave de observación astronómica">
      <dl className="border-y border-sand-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-sand-200">
        {facts.map((fact, idx) => (
          <div
            key={fact.id}
            className={`py-5 sm:px-6 space-y-1 ${
              idx === 0 ? 'sm:pl-0' : ''
            } ${idx === facts.length - 1 ? 'sm:pr-0' : ''}`}
          >
            <dt className="text-xs font-semibold text-sand-600">
              {fact.label}
            </dt>
            <dd className="font-display font-bold text-xl text-sand-900 tracking-tight">
              {fact.value}
            </dd>
            <dd className="text-xs text-sand-600 leading-relaxed pt-0.5">
              {fact.detail}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
