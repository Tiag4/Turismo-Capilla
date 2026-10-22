import React from 'react';
import { ExternalLink, Power, Edit2, Trash2 } from 'lucide-react';
import type { Alert, AlertSeverity } from '../../types/alert.types.ts';

export interface AlertRowProps {
  item: Alert;
  severityBadges: Record<
    AlertSeverity,
    { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  >;
  onToggle: (alert: Alert) => void;
  onEdit: (alert: Alert) => void;
  onDelete: (alert: Alert) => void;
}

export const AlertRow: React.FC<AlertRowProps> = ({
  item,
  severityBadges,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const badge = severityBadges[item.severity];
  const Icon = badge.icon;

  return (
    <tr
      className={`hover:bg-sand-100/60 transition-colors ${
        item.isActive ? 'bg-amber-50/40' : ''
      }`}
    >
      <td className="py-3 px-4 align-top whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
        >
          <Icon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </span>
      </td>

      <td className="py-3 px-4 align-top max-w-md">
        <div className="font-bold text-sand-900 mb-0.5">{item.title}</div>
        <div className="text-xs text-sand-600 line-clamp-2 leading-relaxed">
          {item.message}
        </div>
        {item.linkUrl && (
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 mt-1"
          >
            <span>{item.linkText || item.linkUrl}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </td>

      <td className="py-3 px-4 align-top whitespace-nowrap text-xs text-sand-500">
        <div>Emitido: {new Date(item.createdAt).toLocaleDateString('es-AR')}</div>
        {item.expiresAt ? (
          <div className="text-[11px] text-sand-400 mt-0.5">
            Hasta: {new Date(item.expiresAt).toLocaleString('es-AR')}
          </div>
        ) : (
          <div className="text-[11px] text-sand-400 mt-0.5">Sin vencimiento</div>
        )}
      </td>

      <td className="py-3 px-4 align-top text-center whitespace-nowrap">
        {item.isActive ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-emerald-800 bg-emerald-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Activa
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-sand-500 bg-sand-200/60">
            Inactiva
          </span>
        )}
      </td>

      <td className="py-3 px-4 align-top text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => onToggle(item)}
            title={item.isActive ? 'Desactivar Alerta' : 'Publicar y Activar Alerta'}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              item.isActive
                ? 'border-amber-300 text-amber-700 hover:bg-amber-100/60'
                : 'border-sand-300 text-sand-600 hover:bg-sand-200/60'
            }`}
          >
            <Power className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onEdit(item)}
            title="Editar Alerta"
            className="p-1.5 rounded-lg border border-sand-300 text-sand-600 hover:bg-sand-200/60 transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            title="Eliminar Alerta"
            className="p-1.5 rounded-lg border border-sand-300 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
