import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Home,
  MessageCircle,
  Mail,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { StatCard } from '../ui/StatCard.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { ProviderDetailModal } from './ProviderDetailModal.tsx';
import { AccommodationList } from '../accommodations/AccommodationList.tsx';
import { providersService } from '../../services/providers.service.ts';
import type { ProviderUser } from '../../types/provider.types.ts';

type ViewSubTab = 'hosts' | 'accommodations';
type StatusFilter = 'ALL' | 'ACTIVE' | 'SUSPENDED';

export interface ProvidersDirectoryViewProps {
  onNavigateCreate?: () => void;
  onNavigateEdit?: (id: string) => void;
}

export const ProvidersDirectoryView: React.FC<ProvidersDirectoryViewProps> = ({
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const [subTab, setSubTab] = useState<ViewSubTab>('hosts');
  const [providers, setProviders] = useState<ProviderUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // Detail Modal State
  const [selectedProvider, setSelectedProvider] = useState<ProviderUser | null>(null);

  // Status Toggle Confirmation State
  const [targetProvider, setTargetProvider] = useState<ProviderUser | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const loadProviders = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await providersService.getAll();
      setProviders(data);
    } catch (err) {
      console.error('Error al cargar prestadores:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProviders();
  }, [loadProviders]);

  const handleConfirmToggleStatus = async () => {
    if (!targetProvider) return;
    try {
      setIsTogglingStatus(true);
      await providersService.toggleStatus(targetProvider.id, targetProvider.isActive);
      setTargetProvider(null);
      await loadProviders();
    } catch (err) {
      console.error('Error al cambiar estado del prestador:', err);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // KPIs
  const stats = useMemo(() => {
    const total = providers.length;
    const active = providers.filter((p) => p.isActive).length;
    const suspended = providers.filter((p) => !p.isActive).length;
    const totalAccommodations = providers.reduce((acc, curr) => acc + (curr.accommodationsCount || 1), 0);
    return { total, active, suspended, totalAccommodations };
  }, [providers]);

  // Filtered list
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      if (statusFilter === 'ACTIVE' && !p.isActive) return false;
      if (statusFilter === 'SUSPENDED' && p.isActive) return false;

      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q) || p.lastName.toLowerCase().includes(q);
        const matchesEmail = p.email.toLowerCase().includes(q);
        const matchesPhone = Boolean(p.phone && p.phone.includes(q));
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      return true;
    });
  }, [providers, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-terracotta-50 text-terracotta-600 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-sand-900 tracking-tight">
              Directorio y Auditoría de Prestadores
            </h1>
            <p className="text-sm text-sand-500">
              Control oficial de cabañeros adheridos, auditoría de establecimientos y estado de habilitación municipal.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation: Directorio vs Catálogo de Alojamientos */}
        <div className="flex bg-sand-100 p-1 rounded-xl self-start sm:self-auto border border-sand-200">
          <button
            onClick={() => setSubTab('hosts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'hosts'
                ? 'bg-white text-sand-900 shadow-xs'
                : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            Directorio de Prestadores
          </button>
          <button
            onClick={() => setSubTab('accommodations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'accommodations'
                ? 'bg-white text-sand-900 shadow-xs'
                : 'text-sand-600 hover:text-sand-900'
            }`}
          >
            Catálogo de Alojamientos
          </button>
        </div>
      </div>

      {subTab === 'accommodations' ? (
        <AccommodationList
          onNavigateCreate={onNavigateCreate}
          onNavigateEdit={onNavigateEdit}
        />
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              label="Prestadores Totales"
              value={stats.total}
              helperText="Cabañeros registrados"
              icon={Users}
              iconColor="text-sand-600"
            />
            <StatCard
              label="Habilitados"
              value={stats.active}
              helperText="Cuentas activas"
              icon={CheckCircle2}
              iconColor="text-emerald-600"
            />
            <StatCard
              label="Suspendidos"
              value={stats.suspended}
              helperText="Infracción / Baja"
              icon={XCircle}
              iconColor="text-rose-500"
            />
            <StatCard
              label="Cabañas Declaradas"
              value={stats.totalAccommodations}
              helperText="Establecimientos en red"
              icon={Building}
              iconColor="text-uritorco-600"
            />
          </div>

          {/* Buscador y Filtros */}
          <div className="p-4 rounded-2xl bg-white border border-sand-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sand-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, apellido, correo electrónico o teléfono..."
                className="w-full pl-10 pr-4 py-2.5 bg-sand-50/80 border border-sand-200 rounded-xl text-sm text-sand-900 placeholder-sand-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-sand-400 mr-1 shrink-0">
                Estado:
              </span>
              {(
                [
                  { id: 'ALL', label: 'Todos' },
                  { id: 'ACTIVE', label: 'Habilitados' },
                  { id: 'SUSPENDED', label: 'Suspendidos' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    statusFilter === f.id
                      ? 'bg-sand-900 text-white'
                      : 'bg-sand-100 text-sand-700 hover:bg-sand-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Prestadores */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-sand-200">
              <div className="w-8 h-8 border-3 border-terracotta-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-sand-600">Cargando directorio de prestadores...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-sand-200 space-y-3">
              <Users className="w-12 h-12 text-sand-300 mx-auto" />
              <h3 className="font-bold text-lg text-sand-900">No se encontraron prestadores</h3>
              <p className="text-sm text-sand-500 max-w-md mx-auto">
                No hay cabañeros que coincidan con los criterios de búsqueda o filtros seleccionados.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setStatusFilter('ALL');
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sand-50/80 border-b border-sand-200 text-xs font-bold uppercase tracking-wider text-sand-600">
                    <tr>
                      <th className="py-3.5 px-4">Prestador / Titular</th>
                      <th className="py-3.5 px-4">Contacto</th>
                      <th className="py-3.5 px-4 text-center">Cabañas</th>
                      <th className="py-3.5 px-4">Alta en Red</th>
                      <th className="py-3.5 px-4 text-center">Estado</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {filteredProviders.map((item) => {
                      const cleanPhone = (item.phone || '').replace(/[^0-9]/g, '');
                      const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : null;
                      const mailLink = `mailto:${item.email}`;

                      return (
                        <tr key={item.id} className="hover:bg-sand-50/50 transition-colors">
                          {/* Titular */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-800 font-bold flex items-center justify-center shrink-0 font-['Outfit']">
                                {item.name.charAt(0)}
                                {item.lastName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-sand-950 block">
                                  {item.name} {item.lastName}
                                </span>
                                <span className="text-xs text-sand-500">
                                  ID: {item.id.slice(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Contacto */}
                          <td className="py-4 px-4 text-xs text-sand-700">
                            <div className="space-y-0.5">
                              <span className="block font-medium truncate max-w-xs">{item.email}</span>
                              <span className="block text-sand-500">{item.phone || 'Sin teléfono'}</span>
                            </div>
                          </td>

                          {/* Cabañas */}
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-sand-100 text-sand-800">
                              <Home className="w-3.5 h-3.5 text-sand-500" />
                              {item.accommodationsCount ?? 1}
                            </span>
                          </td>

                          {/* Fecha */}
                          <td className="py-4 px-4 text-xs text-sand-600 whitespace-nowrap">
                            {new Date(item.createdAt).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
                          </td>

                          {/* Estado */}
                          <td className="py-4 px-4 text-center">
                            {item.isActive ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                Habilitado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                Suspendido
                              </span>
                            )}
                          </td>

                          {/* Acciones */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Ver Ficha y Alojamientos */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProvider(item)}
                                className="gap-1 px-2.5 py-1 text-xs font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ver Cabañas</span>
                              </Button>

                              {/* WhatsApp Directo */}
                              {waLink && (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="WhatsApp directo"
                                  className="p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </a>
                              )}

                              {/* Email Directo */}
                              <a
                                href={mailLink}
                                title="Enviar email oficial"
                                className="p-2 rounded-lg text-sand-600 hover:bg-sand-100 transition-colors"
                              >
                                <Mail className="w-4 h-4" />
                              </a>

                              {/* Suspender / Reactivar */}
                              <button
                                type="button"
                                onClick={() => setTargetProvider(item)}
                                title={item.isActive ? 'Suspender cuenta' : 'Reactivar cuenta'}
                                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                  item.isActive
                                    ? 'text-sand-400 hover:text-rose-600 hover:bg-rose-50'
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
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Ficha y Alojamientos */}
          <ProviderDetailModal
            isOpen={Boolean(selectedProvider)}
            onClose={() => setSelectedProvider(null)}
            provider={selectedProvider}
            onToggleStatus={(p) => setTargetProvider(p)}
          />

          {/* Diálogo de Confirmación para Suspender / Reactivar */}
          <ConfirmDialog
            isOpen={Boolean(targetProvider)}
            onClose={() => setTargetProvider(null)}
            onConfirm={handleConfirmToggleStatus}
            isLoading={isTogglingStatus}
            variant={targetProvider?.isActive ? 'danger' : 'emerald'}
            title={
              targetProvider?.isActive
                ? `¿Suspender la cuenta de "${targetProvider?.name} ${targetProvider?.lastName}"?`
                : `¿Reactivar la cuenta de "${targetProvider?.name} ${targetProvider?.lastName}"?`
            }
            description={
              targetProvider?.isActive
                ? 'Al suspender la cuenta del prestador, sus cabañas dejarán de estar visibles en el portal turístico y no podrá recibir nuevas reservas hasta que regularice su situación municipal.'
                : 'La cuenta del prestador volverá a estar habilitada y sus alojamientos declarados se reactivarán para los turistas en el portal oficial.'
            }
            confirmLabel={targetProvider?.isActive ? 'Suspender Prestador' : 'Habilitar Prestador'}
            cancelLabel="Volver sin cambios"
          />
        </>
      )}
    </div>
  );
};
