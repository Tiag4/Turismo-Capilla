import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, Clock, Ban } from 'lucide-react';
import type { InvitationToken } from '../../types/invitation.types.ts';
import { Button } from '../ui/Button.tsx';

export interface InvitationListProps {
  invitations: InvitationToken[];
  isLoading: boolean;
}

export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isLoading,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (token: string, id: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-sand-200)] bg-[var(--color-sand-100)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-800)]">
              <th className="py-3 px-4">Token de Seguridad</th>
              <th className="py-3 px-4">Prestador Asignado</th>
              <th className="py-3 px-4">Estado</th>
              <th className="py-3 px-4">Vence el</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[var(--color-sand-400)]">
                  Cargando tokens de invitación...
                </td>
              </tr>
            ) : invitations.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-xs text-[var(--color-sand-400)]">
                  No hay tokens de invitación generados aún.
                </td>
              </tr>
            ) : (
              invitations.map((inv) => {
                const isExpired = new Date(inv.expiresAt) < new Date();
                const isUsed = Boolean(inv.usedAt);

                return (
                  <tr
                    key={inv.id}
                    className="border-b border-[var(--color-sand-200)] hover:bg-[var(--color-sand-50)] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-[var(--color-sand-900)]">
                      {inv.token}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-[var(--color-sand-900)]">
                      {inv.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {/* Anti-vibecoded: 100% solid badges */}
                      {isUsed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#005530] text-white">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Adherido</span>
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-700 text-white">
                          <Ban className="w-3 h-3" />
                          <span>Expirado</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-600 text-white">
                          <Clock className="w-3 h-3" />
                          <span>Disponible</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--color-sand-800)]">
                      {new Date(inv.expiresAt).toLocaleDateString('es-AR')}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUsed || isExpired}
                        onClick={() => handleCopy(inv.token, inv.id)}
                        className="text-xs"
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#005530]" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Token</span>
                          </>
                        )}
                      </Button>
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
