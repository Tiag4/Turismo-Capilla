import React from 'react';
import { ShieldCheck, Clock, Ban, XCircle } from 'lucide-react';

export interface InvitationStatusBadgeProps {
  isUsed?: boolean;
  isRevoked?: boolean;
  isExpired?: boolean;
}

export const InvitationStatusBadge: React.FC<InvitationStatusBadgeProps> = ({
  isUsed,
  isRevoked,
  isExpired,
}) => {
  // Anti-vibecoded Rule 27: 100% solid, opaque backgrounds and high-contrast text.
  if (isUsed) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#005530] text-white">
        <ShieldCheck className="w-3 h-3 shrink-0" />
        <span>Adherido</span>
      </span>
    );
  }

  if (isRevoked) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-700 text-white">
        <XCircle className="w-3 h-3 shrink-0" />
        <span>Revocado</span>
      </span>
    );
  }

  if (isExpired) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-700 text-white">
        <Ban className="w-3 h-3 shrink-0" />
        <span>Expirado</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-600 text-white">
      <Clock className="w-3 h-3 shrink-0" />
      <span>Disponible</span>
    </span>
  );
};
