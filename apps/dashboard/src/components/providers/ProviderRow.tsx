import React from 'react';
import { Home, MessageCircle, Mail, Eye, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import type { ProviderUser } from '../../types/provider.types.ts';

export interface ProviderRowProps {
  item: ProviderUser;
  onSelect: (provider: ProviderUser) => void;
  onToggleStatus: (provider: ProviderUser) => void;
}

export const ProviderRow: React.FC<ProviderRowProps> = ({
  item,
  onSelect,
  onToggleStatus,
}) => {
  const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
  const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
  const mailLink = `mailto:${item.email}`;

  return (
    <tr className="hover:bg-[var(--color-sand-50)] transition-colors">
      {/* Titular */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-800)] font-bold flex items-center justify-center shrink-0 font-['Outfit'] text-xs">
            {item.name.charAt(0)}
            {item.lastName.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-[var(--color-sand-900)] block">
              {item.name} {item.lastName}
            </span>
            <span className="text-[11px] text-[var(--color-sand-500)]">
              ID: {item.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      </td>

      {/* Contacto */}
      <td className="py-3.5 px-4 text-xs text-[var(--color-sand-700)]">
        <div className="space-y-0.5">
          <span className="block font-medium truncate max-w-xs">{item.email}</span>
          <span className="block text-[var(--color-sand-500)]">{item.phone || 'Sin teléfono'}</span>
        </div>
      </td>

      {/* Cabañas */}
      <td className="py-3.5 px-4 text-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-[var(--color-sand-100)] text-[var(--color-sand-800)]">
          <Home className="w-3.5 h-3.5 text-[var(--color-sand-500)]" />
          {item.accommodationsCount ?? 1}
        </span>
      </td>

      {/* Fecha */}
      <td className="py-3.5 px-4 text-xs text-[var(--color-sand-600)] whitespace-nowrap">
        {new Date(item.createdAt).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </td>

      {/* Estado (Anti-Vibecoded solid badge without status dot soup) */}
      <td className="py-3.5 px-4 text-center">
        {item.isActive ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#005530] text-white">
            Habilitado
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-700 text-white">
            Suspendido
          </span>
        )}
      </td>

      {/* Acciones */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelect(item)}
            className="gap-1 px-2.5 py-1 text-xs font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ver Cabañas</span>
          </Button>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              title="WhatsApp directo"
              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}

          <a
            href={mailLink}
            title="Enviar email oficial"
            className="p-1.5 rounded-lg text-[var(--color-sand-600)] hover:bg-[var(--color-sand-100)] transition-colors"
          >
            <Mail className="w-4 h-4" />
          </a>

          <button
            type="button"
            onClick={() => onToggleStatus(item)}
            title={item.isActive ? 'Suspender cuenta' : 'Reactivar cuenta'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              item.isActive
                ? 'text-[var(--color-sand-400)] hover:text-rose-600 hover:bg-rose-50'
                : 'text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {item.isActive ? (
              <ShieldAlert className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
