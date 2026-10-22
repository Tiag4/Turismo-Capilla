import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Building,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { ProviderDetailModal } from './ProviderDetailModal.tsx';
import { ProviderRow } from './ProviderRow.tsx';
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

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Prestadores Totales',
      value: stats.total,
      helperText: 'Cabañeros registrados',
      icon: Users,
      iconColor: 'text-[var(--color-sand-600)]',
    },
    {
      label: 'Habilitados',
      value: stats.active,
      helperText: 'Cuentas activas',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Suspendidos',
      value: stats.suspended,
      helperText: 'Infracción / Baja',
      icon: XCircle,
      iconColor: 'text-rose-500',
    },
    {
      label: 'Cabañas Declaradas',
      value: stats.totalAccommodations,
      helperText: 'Establecimientos en red',
      icon: Building,
      iconColor: 'text-[var(--color-uritorco-600)]',
    },
  ], [stats]);

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
      {/* Header — Clean title without embedded icon */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-sand-900)] tracking-tight font-['Outfit']">
            Directorio y Auditoría de Prestadores
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Control oficial de cabañeros adheridos, auditoría de establecimientos y estado de habilitación municipal.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex bg-[var(--color-sand-100)] p-1 rounded-xl self-start sm:self-auto border border-[var(--color-sand-200)]">
          <button
            onClick={() => setSubTab('hosts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'hosts'
                ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
            }`}
          >
            Directorio de Prestadores
          </button>
          <button
            onClick={() => setSubTab('accommodations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              subTab === 'accommodations'
                ? 'bg-white text-[var(--color-sand-900)] shadow-xs'
                : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)]'
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
          {/* KPI Stat Strip */}
          <InlineStatStrip stats={statItems} />

          {/* Buscador y Filtros */}
          <div className="p-4 rounded-2xl bg-white border border-[var(--color-sand-200)] shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-sand-400)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, apellido, correo electrónico o teléfono..."
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-sand-50)] border border-[var(--color-sand-200)] rounded-xl text-xs sm:text-sm text-[var(--color-sand-900)] placeholder-[var(--color-sand-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-500)]/20 focus:border-[var(--color-terracotta-500)] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-sand-500)] mr-1 shrink-0">
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
                      ? 'bg-[var(--color-sand-900)] text-white'
                      : 'bg-[var(--color-sand-100)] text-[var(--color-sand-700)] hover:bg-[var(--color-sand-200)]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabla de Prestadores */}
          {isLoading ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)]">
              <div className="w-8 h-8 border-3 border-[var(--color-terracotta-500)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-[var(--color-sand-600)]">Cargando directorio de prestadores...</p>
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[var(--color-sand-200)] space-y-3">
              <Users className="w-12 h-12 text-[var(--color-sand-300)] mx-auto" />
              <h3 className="font-bold text-lg text-[var(--color-sand-900)]">No se encontraron prestadores</h3>
              <p className="text-sm text-[var(--color-sand-500)] max-w-md mx-auto">
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
            <div className="bg-white rounded-2xl border border-[var(--color-sand-200)] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[var(--color-sand-50)] border-b border-[var(--color-sand-200)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-sand-600)]">
                    <tr>
                      <th className="py-3 px-4">Prestador / Titular</th>
                      <th className="py-3 px-4">Contacto</th>
                      <th className="py-3 px-4 text-center">Cabañas</th>
                      <th className="py-3 px-4">Alta en Red</th>
                      <th className="py-3 px-4 text-center">Estado</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-sand-200)]">
                    {filteredProviders.map((item) => (
                      <ProviderRow
                        key={item.id}
                        item={item}
                        onSelect={(p) => setSelectedProvider(p)}
                        onToggleStatus={(p) => setTargetProvider(p)}
                      />
                    ))}
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
