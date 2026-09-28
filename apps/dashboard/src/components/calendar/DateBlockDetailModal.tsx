import React from 'react';
import { Lock, Trash2, Calendar, AlertCircle } from 'lucide-react';
import type { DateBlock } from '../../types/date-block.types.ts';
import { DATE_BLOCK_REASON_LABELS } from '../../types/date-block.types.ts';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';

export interface DateBlockDetailModalProps {
  block: DateBlock | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteBlock: (id: string) => void;
}

export const DateBlockDetailModal: React.FC<DateBlockDetailModalProps> = ({
  block,
  isOpen,
  onClose,
  onDeleteBlock,
}) => {
  if (!block) return null;

  const handleDelete = () => {
    onDeleteBlock(block.id);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Bloqueo Administrativo"
      subtitle={`Cabaña: ${block.accommodationName}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Banner with reason */}
        <div className="p-4 rounded-2xl bg-zinc-800 text-white flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block">
              Motivo del Bloqueo
            </span>
            <span className="text-sm font-bold block">
              {DATE_BLOCK_REASON_LABELS[block.reason]}
            </span>
          </div>
        </div>

        {/* Date Info */}
        <div className="p-4 rounded-xl bg-white border border-[var(--color-sand-200)] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-[var(--color-sand-800)]">
            <Calendar className="w-4 h-4 text-[var(--color-terracotta-500)] shrink-0" />
            <span className="font-semibold">Rango Inhabilitado:</span>
            <span>
              {block.startDate} al {block.endDate}
            </span>
          </div>

          {block.notes && (
            <div className="pt-2 border-t border-[var(--color-sand-200)] text-[var(--color-sand-800)]">
              <span className="font-bold block text-[var(--color-sand-400)] text-[10px] uppercase mb-0.5">
                Observaciones del Prestador:
              </span>
              <p className="italic bg-[var(--color-sand-50)] p-2 rounded-lg border border-[var(--color-sand-200)]">
                "{block.notes}"
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            Durante este rango de fechas, los turistas verán el establecimiento como no disponible.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-sand-200)]">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Eliminar Bloqueo</span>
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
