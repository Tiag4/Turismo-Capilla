import React from 'react';
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Section: Clean typography, zero eyebrows, zero redundant badges */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-sand-900)] font-['Outfit'] tracking-tight">
          Mi Perfil
        </h1>
        <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-1 font-['Plus_Jakarta_Sans']">
          Administrá tus datos de contacto y credenciales de acceso.
        </p>
      </div>

      {/* Identity Summary Card */}
      <AccountSummaryCard user={user} />

      {/* Action Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <ProfileInfoForm user={user} onSubmit={onUpdateProfile} />
        <ChangePasswordForm onSubmit={onChangePassword} />
      </div>
    </div>
  );
};
