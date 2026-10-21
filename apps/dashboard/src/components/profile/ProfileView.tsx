import React from 'react';
import { UserCheck, Shield } from 'lucide-react';
import { AccountSummaryCard } from './AccountSummaryCard.tsx';
import { ProfileInfoForm } from './ProfileInfoForm.tsx';
import { ChangePasswordForm } from './ChangePasswordForm.tsx';
import type { User, UpdateProfilePayload, ChangePasswordPayload } from '../../types/auth.types.ts';

export interface ProfileViewProps {
  user: User;
  onUpdateProfile: (payload: UpdateProfilePayload) => Promise<unknown>;
  onChangePassword: (payload: ChangePasswordPayload) => Promise<unknown>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  onUpdateProfile,
  onChangePassword,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--color-terracotta-600)] mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Centro de Seguridad & Cuenta</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
            Mi Perfil Oficial
          </h1>
          <p className="text-sm text-[var(--color-sand-500)] mt-1 font-['Plus_Jakarta_Sans']">
            Administrá tus datos personales de contacto, revisá tu acreditación y actualizá tus credenciales de acceso.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-[var(--color-sand-200)] shadow-xs text-xs font-bold text-[var(--color-sand-800)]">
          <UserCheck className="w-4 h-4 text-[var(--color-emerald-portal-600)]" />
          <span>Acceso Autorizado por Token</span>
        </div>
      </div>

      {/* 2. Identity Summary Card */}
      <AccountSummaryCard user={user} />

      {/* 3. Action Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ProfileInfoForm user={user} onSubmit={onUpdateProfile} />
        <ChangePasswordForm onSubmit={onChangePassword} />
      </div>
    </div>
  );
};
