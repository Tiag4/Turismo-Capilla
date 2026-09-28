import React from 'react';
import { Check, MessageSquare, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import type { ModerationItem } from '../../types/moderation.types.ts';
import { Button } from '../ui/Button.tsx';

export interface ModerationCardProps {
  item: ModerationItem;
  onApprove: (id: string) => void;
  onRequestObservation: (item: ModerationItem) => void;
}

export const ModerationCard: React.FC<ModerationCardProps> = ({
  item,
  onApprove,
  onRequestObservation,
}) => {
  const statusBadge = {
    PENDING: {
      label: 'Pendiente de Revisión',
      className: 'bg-amber-600 text-white',
      icon: Clock,
    },
    APPROVED: {
      label: 'Aprobada para Portal',
      className: 'bg-[#005530] text-white',
      icon: CheckCircle,
    },
    REJECTED: {
      label: 'Cambios Solicitados',
      className: 'bg-rose-700 text-white',
      icon: AlertCircle,
    },
  }[item.status];

  const StatusIcon = statusBadge.icon;

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between">
      <div>
        {/* Photo Container */}
        <div className="relative h-48 w-full bg-[var(--color-sand-200)] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.caption || 'Foto enviada'}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${statusBadge.className}`}
            >
              <StatusIcon className="w-3 h-3 shrink-0" />
              <span>{statusBadge.label}</span>
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-sand-900)] font-['Outfit'] truncate">
              {item.accommodationName}
            </span>
            <span className="text-[10px] text-[var(--color-sand-400)] shrink-0">
              {new Date(item.submittedAt).toLocaleDateString('es-AR')}
            </span>
          </div>

          <p className="text-xs text-[var(--color-sand-800)] font-medium line-clamp-2">
            "{item.caption || 'Sin epígrafe descriptivo'}"
          </p>

          <div className="text-[11px] text-[var(--color-sand-400)] truncate">
            Prestador: {item.hostName} ({item.hostEmail})
          </div>

          {item.feedbackNotes && (
            <div className="mt-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-950">
              <span className="font-bold block mb-0.5">Observación Notificada:</span>
              {item.feedbackNotes}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[var(--color-sand-50)] border-t border-[var(--color-sand-200)] flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRequestObservation(item)}
          className="text-xs"
          title="Enviar observación técnica al prestador"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[var(--color-terracotta-500)]" />
          <span>Observar</span>
        </Button>

        <Button
          variant="emerald"
          size="sm"
          disabled={item.status === 'APPROVED'}
          onClick={() => onApprove(item.id)}
          className="text-xs"
          title="Aprobar para publicación en el portal público"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{item.status === 'APPROVED' ? 'Aprobada' : 'Aprobar'}</span>
        </Button>
      </div>
    </div>
  );
};
