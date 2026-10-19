import React, { useEffect, useState } from 'react';
import {
  Mail,
  Phone,
  Calendar,
  Home,
  MessageCircle,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { providersService } from '../../services/providers.service.ts';
import type { ProviderUser } from '../../types/provider.types.ts';
import type { Accommodation } from '../../types/accommodation.types.ts';

interface ProviderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ProviderUser | null;
  onToggleStatus: (provider: ProviderUser) => void;
}

export const ProviderDetailModal: React.FC<ProviderDetailModalProps> = ({
  isOpen,
  onClose,
  provider,
  onToggleStatus,
}) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoadingAcc, setIsLoadingAcc] = useState(false);

  useEffect(() => {
    if (provider && isOpen) {
      setIsLoadingAcc(true);
      providersService
        .getAccommodationsByHost(provider)
        .then((data) => setAccommodations(data))
        .catch(() => setAccommodations([]))
        .finally(() => setIsLoadingAcc(false));
    } else {
      setAccommodations([]);
    }
  }, [provider, isOpen]);

  if (!provider) return null;

  const cleanPhone = (provider.phone || '').replace(/[^0-9]/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        `Hola ${provider.name}, te contactamos desde la Secretaría de Turismo de Capilla del Monte respecto a tus establecimientos en la plataforma.`
      )}`
    : null;

  const mailUrl = `mailto:${provider.email}?subject=${encodeURIComponent(
    'Comunicación Oficial — Secretaría de Turismo Capilla del Monte'
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha del Prestador Turístico"
      subtitle="Auditoría de datos de contacto y establecimientos declarados ante el municipio."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Cabecera del Prestador */}
        <div className="p-5 rounded-2xl bg-sand-50/90 border border-sand-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-terracotta-500 text-white font-black text-xl flex items-center justify-center font-['Outfit'] shadow-xs shrink-0">
              {provider.name.charAt(0)}
              {provider.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-sand-900 leading-tight">
                  {provider.name} {provider.lastName}
                </h3>
                {provider.isActive ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                    <XCircle className="w-3.5 h-3.5" />
                    Suspendido
                  </span>
                )}
              </div>
              <p className="text-xs text-sand-500 mt-0.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Registrado el{' '}
                {new Date(provider.createdAt).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Botones de Contacto Rápido */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
            <a
              href={mailUrl}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sand-900 text-white hover:bg-terracotta-600 transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Datos de Contacto y Estado Administrativo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-sand-200 bg-white space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sand-400 block">
              Correo Electrónico
            </span>
            <div className="flex items-center gap-2 font-medium text-sand-800">
              <Mail className="w-4 h-4 text-sand-400 shrink-0" />
              <span className="truncate">{provider.email}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-sand-200 bg-white space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sand-400 block">
              Teléfono de Contacto
            </span>
            <div className="flex items-center gap-2 font-medium text-sand-800">
              <Phone className="w-4 h-4 text-sand-400 shrink-0" />
              <span>{provider.phone || 'No registrado'}</span>
            </div>
          </div>
        </div>

        {/* Sección de Establecimientos / Cabañas */}
        <div className="space-y-3 pt-2 border-t border-sand-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-sand-600" />
              <h4 className="text-sm font-bold text-sand-900">
                Alojamientos Declarados ({accommodations.length})
              </h4>
            </div>
            <span className="text-xs text-sand-400 font-medium">
              Vinculados a este usuario
            </span>
          </div>

          {isLoadingAcc ? (
            <div className="p-6 text-center bg-sand-50 rounded-xl border border-sand-200">
              <div className="w-6 h-6 border-2 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-sand-600 font-medium">Cargando establecimientos...</p>
            </div>
          ) : accommodations.length === 0 ? (
            <div className="p-6 text-center bg-sand-50 rounded-xl border border-sand-200 text-xs text-sand-500">
              Este prestador todavía no tiene cabañas u hospedajes dados de alta.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto pr-1">
              {accommodations.map((acc) => {
                const cover = acc.images && acc.images.length > 0 ? acc.images[0].url : null;
                return (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-xl border border-sand-200 bg-white flex items-center justify-between gap-3 hover:border-sand-300 transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {cover ? (
                        <img
                          src={cover}
                          alt={acc.name}
                          className="w-14 h-14 rounded-lg object-cover shrink-0 border border-sand-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-sand-100 flex items-center justify-center text-sand-400 shrink-0">
                          <Home className="w-6 h-6" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs font-bold text-sand-900 truncate">
                            {acc.name}
                          </h5>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              acc.isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-sand-100 text-sand-600'
                            }`}
                          >
                            {acc.isActive ? 'Publicado' : 'Pausado'}
                          </span>
                        </div>
                        <p className="text-[11px] text-sand-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span>{acc.address || 'Capilla del Monte'}</span>
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-sand-600 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="w-3 h-3 text-sand-400" />
                            Hasta {acc.maxGuests} personas
                          </span>
                          <span>·</span>
                          <span className="font-bold text-sand-900">
                            ${acc.pricePerNight?.toLocaleString('es-AR')}/noche
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Acciones de Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-sand-200">
          <Button
            type="button"
            variant={provider.isActive ? 'danger' : 'emerald'}
            size="sm"
            onClick={() => {
              onToggleStatus(provider);
              onClose();
            }}
            className="gap-1.5"
          >
            {provider.isActive ? (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Suspender Cuenta del Prestador</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Reactivar Cuenta del Prestador</span>
              </>
            )}
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
