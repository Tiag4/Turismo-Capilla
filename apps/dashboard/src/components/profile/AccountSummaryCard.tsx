import React from 'react';
import { ShieldCheck, Mail, Calendar, Phone } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-sand-200)]">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold font-['Outfit'] shadow-sm shrink-0 ${
              isAdmin ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-terracotta-500)]'
            }`}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-extrabold text-[var(--color-sand-900)] font-['Outfit']">
                {user.name} {user.lastName}
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white ${
                  isAdmin ? 'bg-[var(--color-emerald-portal-600)]' : 'bg-[var(--color-terracotta-500)]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAdmin ? 'Comisión Municipal' : 'Cabañero / Prestador'}
              </span>
            </div>
            <p className="text-xs text-[var(--color-sand-500)] mt-1 font-['Plus_Jakarta_Sans']">
              {isAdmin
                ? 'Gestión centralizada del destino turístico y normativas municipales.'
                : 'Administración de alojamientos, tarifas y solicitudes de reserva.'}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-emerald-portal-50)] text-[var(--color-emerald-portal-700)] border border-[var(--color-emerald-portal-200)] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[var(--color-emerald-portal-600)] animate-pulse" />
          <span>Cuenta Activa & Verificada</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-sand-700)] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">Correo Electrónico</span>
            <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-sand-700)] flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">Teléfono de Contacto</span>
            <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate">{user.phone ? user.phone : 'No registrado'}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-sand-100)] text-[var(--color-sand-700)] flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-400)] block">Fecha de Registro</span>
            <span className="text-xs font-bold text-[var(--color-sand-900)] block truncate capitalize">{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
