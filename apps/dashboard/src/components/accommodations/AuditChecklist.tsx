import React from 'react';
import { CheckSquare, Square } from 'lucide-react';
import type { ComplianceChecklist } from '../../types/accommodation.types.ts';

export const CHECKLIST_ITEMS: { key: keyof ComplianceChecklist; label: string; description: string }[] = [
  {
    key: 'fireExtinguisher',
    label: 'Matafuegos con carga y oblea vigente',
    description: 'Extintor ABC reglamentario accesible y con tarjeta técnica anual al día.',
  },
  {
    key: 'evacuationPlan',
    label: 'Plano de evacuación y salidas de emergencia',
    description: 'Cartelería fotoluminiscente y diagrama de escape visible en la unidad.',
  },
  {
    key: 'civilLiabilityInsurance',
    label: 'Seguro de responsabilidad civil para turistas',
    description: 'Póliza con cobertura activa contra accidentes dentro del predio.',
  },
  {
    key: 'commercialPermit',
    label: 'Habilitación comercial municipal y desinfección',
    description: 'Expediente aprobado por la Secretaría de Comercio de Capilla del Monte.',
  },
  {
    key: 'firstAidKit',
    label: 'Botiquín de primeros auxilios equipado',
    description: 'Insumos básicos de curación y teléfonos de emergencia (Hospital / Bomberos).',
  },
];

export interface AuditChecklistProps {
  checklist: ComplianceChecklist;
  onToggle: (key: keyof ComplianceChecklist) => void;
}

export const AuditChecklist: React.FC<AuditChecklistProps> = ({ checklist, onToggle }) => {
  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-[var(--color-sand-200)]">
      {CHECKLIST_ITEMS.map((item) => {
        const isChecked = checklist[item.key];
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => onToggle(item.key)}
            className="flex items-start gap-3 p-2 rounded-xl text-left hover:bg-[var(--color-sand-50)] transition-colors cursor-pointer"
          >
            {isChecked ? (
              <CheckSquare className="w-4 h-4 text-[var(--color-emerald-portal-600)] mt-0.5 shrink-0" />
            ) : (
              <Square className="w-4 h-4 text-[var(--color-sand-400)] mt-0.5 shrink-0" />
            )}
            <div>
              <span
                className={`text-xs font-bold block ${
                  isChecked ? 'text-[var(--color-sand-900)]' : 'text-[var(--color-sand-400)] line-through'
                }`}
              >
                {item.label}
              </span>
              <span className="text-[11px] text-[var(--color-sand-400)]">
                {item.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
