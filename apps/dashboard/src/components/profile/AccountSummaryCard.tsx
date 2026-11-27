import React from 'react';
import { Mail, Calendar, Phone } from 'lucide-react';
import type { User } from '../../types/auth.types.ts';

export interface AccountSummaryCardProps {
  user: User;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ user }) => {
  const isAdmin = user.role === 'ADMIN';
  const initials = `${user.name?.[0] ?? 'U'}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Registro Oficial';

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] shadow-xs p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold font-['Outfit'] shadow-xs shrink-0 ${
              isAdmin ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-terracotta-500)]'
            }`}
          >
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
              {user.name} {user.lastName}
            </h2>
            <p className="text-xs text-[var(--color-sand-500)] mt-0.5 font-['Plus_Jakarta_Sans']">
              {isAdmin
                ? 'Gestión centralizada del destino turístico y normativas municipales.'
                : 'Administración de alojamientos, tarifas y solicitudes de reserva.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata strip: Direct semantic icons without artificial pastel boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-5 text-xs">
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">
              Correo Electrónico
            </span>
            <span className="font-semibold text-[var(--color-sand-900)] block truncate">
              {user.email}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">
              Teléfono de Contacto
            </span>
            <span className="font-semibold text-[var(--color-sand-900)] block truncate">
              {user.phone ? user.phone : 'No registrado'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Calendar className="w-4 h-4 text-[var(--color-sand-400)] shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">
              Fecha de Registro
            </span>
            <span className="font-semibold text-[var(--color-sand-900)] block truncate capitalize">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
