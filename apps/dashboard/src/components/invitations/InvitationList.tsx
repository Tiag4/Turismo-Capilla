import React, { useState } from 'react';
import { Copy, Check, Ban, Link as LinkIcon } from 'lucide-react';
import type { InvitationToken } from '../../types/invitation.types.ts';
import { InvitationStatusBadge } from './InvitationStatusBadge.tsx';
import { Button } from '../ui/Button.tsx';

export interface InvitationListProps {
  invitations: InvitationToken[];
  isLoading: boolean;
  onOpenRevoke: (invitation: InvitationToken) => void;
}

export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isLoading,
  onOpenRevoke,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getSecureRegistrationLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://turismocapilla.gob.ar';
    return `${origin}/registro-prestador?token=${encodeURIComponent(token)}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-sand-200)] bg-[var(--color-sand-100)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
              <th className="py-3 px-4">Token</th>
              <th className="py-3 px-4">Prestador Asignado</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Vence el</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="py-8 text-center text-xs text-[var(--color-sand-400)]">Cargando tokens de invitación...</td></tr>
            ) : invitations.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-xs text-[var(--color-sand-400)]">No hay tokens de invitación generados aún.</td></tr>
            ) : (
              invitations.map((inv) => {
                const isExpired = new Date(inv.expiresAt) < new Date();
                const isUsed = Boolean(inv.usedAt);
                const isRevoked = Boolean(inv.isRevoked);
                const isActionDisabled = isUsed || isExpired || isRevoked;
                const secureLink = getSecureRegistrationLink(inv.token);

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-[var(--color-sand-200)] hover:bg-[var(--color-sand-50)] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[var(--color-sand-900)]">
                      {inv.token}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[var(--color-sand-900)]">
                      <div>{inv.email}</div>
                      {isRevoked && inv.revokedReason && (
                        <span className="text-[10px] text-rose-700 font-normal block mt-0.5">
                          Motivo: {inv.revokedReason}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <InvitationStatusBadge
                        isUsed={isUsed}
                        isRevoked={isRevoked}
                        isExpired={isExpired}
                      />
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--color-sand-800)]">
                      {new Date(inv.expiresAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isActionDisabled}
                          onClick={() => handleCopy(secureLink, `${inv.id}-link`)}
                          className="text-xs"
                          title="Copiar enlace directo de registro con token"
                        >
                          {copiedKey === `${inv.id}-link` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#005530]" />
                              <span>Link Copiado</span>
                            </>
                          ) : (
                            <>
                              <LinkIcon className="w-3.5 h-3.5" />
                              <span>Copiar Link</span>
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isActionDisabled}
                          onClick={() => handleCopy(inv.token, `${inv.id}-token`)}
                          className="text-xs"
                          title="Copiar solo el código de token"
                        >
                          {copiedKey === `${inv.id}-token` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#005530]" />
                              <span>Token</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isActionDisabled}
                          onClick={() => onOpenRevoke(inv)}
                          className="text-xs text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                          title="Revocar token formalmente"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Revocar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
