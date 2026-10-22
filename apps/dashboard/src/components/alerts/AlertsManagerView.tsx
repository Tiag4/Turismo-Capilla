import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Info,
  Plus,
  ShieldCheck,
  Edit2,
  Power,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { InlineStatStrip, type StatItem } from '../ui/InlineStatStrip.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { AlertRow } from './AlertRow.tsx';
import { alertsService } from '../../services/alerts.service.ts';
import type { Alert, AlertSeverity } from '../../types/alert.types.ts';

export interface AlertsManagerViewProps {
  onNavigateCreate?: () => void;
  onNavigateEdit?: (id: string) => void;
}

export const AlertsManagerView: React.FC<AlertsManagerViewProps> = ({
  onNavigateCreate,
  onNavigateEdit,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status toggle confirmation
  const [targetToggleAlert, setTargetToggleAlert] = useState<Alert | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Delete confirmation
  const [targetDeleteAlert, setTargetDeleteAlert] = useState<Alert | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await alertsService.getAll();
      setAlerts(data);
    } catch (err) {
      console.error('Error al cargar alertas:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Current active alert
  const activeAlert = useMemo(() => {
    return alerts.find((a) => a.isActive) || null;
  }, [alerts]);

  const handleOpenCreate = () => {
    onNavigateCreate?.();
  };

  const handleOpenEdit = (alert: Alert) => {
    onNavigateEdit?.(alert.id);
  };

  const handleConfirmToggle = async () => {
    if (!targetToggleAlert) return;
    try {
      setIsToggling(true);
      await alertsService.toggleStatus(targetToggleAlert.id, !targetToggleAlert.isActive);
      setTargetToggleAlert(null);
      await loadAlerts();
    } catch (err) {
      console.error('Error al cambiar estado de alerta:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!targetDeleteAlert) return;
    try {
      setIsDeleting(true);
      await alertsService.delete(targetDeleteAlert.id);
      setTargetDeleteAlert(null);
      await loadAlerts();
    } catch (err) {
      console.error('Error al eliminar alerta:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const severityBadges: Record<
    AlertSeverity,
    { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    INFO: {
      label: 'Informativa',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: Info,
    },
    WARNING: {
      label: 'Advertencia',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertTriangle,
    },
    DANGER: {
      label: 'Emergencia Crítica',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: Flame,
    },
  };

  const statItems: StatItem[] = useMemo(() => [
    {
      label: 'Estado en Portal',
      value: activeAlert ? 'Alerta Transmitiéndose' : 'Operación Normal',
      helperText: activeAlert ? `"${activeAlert.title}"` : 'Sin avisos preventivos',
      icon: activeAlert ? Radio : ShieldCheck,
      iconColor: activeAlert ? 'text-rose-600' : 'text-emerald-700',
    },
    {
      label: 'Severidad Activa',
      value: activeAlert ? severityBadges[activeAlert.severity].label : 'Condiciones Seguras',
      helperText: activeAlert ? 'Top banner activo' : 'Meteorología sin novedades',
      icon: activeAlert
        ? (activeAlert.severity === 'DANGER' ? Flame : activeAlert.severity === 'WARNING' ? AlertTriangle : Info)
        : CheckCircle2,
      iconColor: activeAlert ? severityBadges[activeAlert.severity].text : 'text-emerald-700',
    },
    {
      label: 'Historial',
      value: alerts.length,
      helperText: 'Avisos emitidos en sistema',
      icon: Clock,
      iconColor: 'text-sand-600',
    },
  ], [activeAlert, alerts.length, severityBadges]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sand-900 font-['Outfit']">
            Alertas Meteorológicas y Avisos Preventivos
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 mt-0.5">
            Emití alertas en tiempo real (crecidas de río, viento zonda, riesgo de incendio) visibles en la portada pública.
          </p>
        </div>

        <Button variant="terracotta" onClick={handleOpenCreate} className="shrink-0 font-bold">
          <Plus className="w-4 h-4 mr-1.5" />
          Emitir Nueva Alerta
        </Button>
      </div>

      {/* KPI Stats Strip */}
      <InlineStatStrip stats={statItems} />

      {/* Live Banner Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${activeAlert ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-sand-600">
              Previsualización en Vivo de Portada
            </h2>
          </div>
          {activeAlert && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(activeAlert)}
              >
                <Edit2 className="w-3.5 h-3.5 mr-1.5" />
                Editar
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTargetToggleAlert(activeAlert)}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <Power className="w-3.5 h-3.5 mr-1.5" />
                Desactivar Banner
              </Button>
            </div>
          )}
        </div>

        {activeAlert ? (
          <div
            className={`rounded-xl p-4 text-white shadow-xs transition-all ${
              activeAlert.severity === 'DANGER'
                ? 'bg-rose-700 border border-rose-800'
                : activeAlert.severity === 'WARNING'
                ? 'bg-amber-600 border border-amber-700'
                : 'bg-sky-700 border border-sky-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded-lg bg-black/15 shrink-0">
                  {activeAlert.severity === 'DANGER' ? (
                    <Flame className="w-5 h-5 text-white" />
                  ) : activeAlert.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5 text-white" />
                  ) : (
                    <Info className="w-5 h-5 text-white" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase bg-black/20 border border-white/20">
                      {severityBadges[activeAlert.severity].label}
                    </span>
                    <span className="font-bold text-sm tracking-tight">{activeAlert.title}</span>
                  </div>
                  <p className="text-xs text-white/90 leading-relaxed">{activeAlert.message}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 px-4 text-xs text-sand-700 border-l-2 border-emerald-600 bg-sand-100/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Sin avisos preventivos activos. Portada pública en operación normal.</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Emitir Alerta
            </Button>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-base font-bold text-sand-900 font-['Outfit']">Historial y Registro de Alertas</h2>
          <p className="text-xs text-sand-500">
            Listado completo de avisos preventivos históricos y vigentes.
          </p>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-sand-500">Cargando registro de alertas...</div>
        ) : alerts.length === 0 ? (
          <div className="py-8 text-center text-sm text-sand-500 border-y border-sand-200">
            No hay alertas registradas todavía.
          </div>
        ) : (
          <div className="overflow-x-auto border-y border-sand-300">
            <table className="w-full text-left text-sm text-sand-800">
              <thead className="text-[11px] font-bold uppercase tracking-wider text-sand-600 border-b border-sand-300 bg-sand-100/60">
                <tr>
                  <th className="py-2.5 px-4">Severidad</th>
                  <th className="py-2.5 px-4">Título y Mensaje</th>
                  <th className="py-2.5 px-4">Vigencia / Emisión</th>
                  <th className="py-2.5 px-4 text-center">Estado</th>
                  <th className="py-2.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {alerts.map((item) => (
                  <AlertRow
                    key={item.id}
                    item={item}
                    severityBadges={severityBadges}
                    onToggle={(alert) => setTargetToggleAlert(alert)}
                    onEdit={handleOpenEdit}
                    onDelete={(alert) => setTargetDeleteAlert(alert)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirm Toggle Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetToggleAlert)}
        onClose={() => setTargetToggleAlert(null)}
        onConfirm={handleConfirmToggle}
        title={targetToggleAlert?.isActive ? '¿Desactivar Alerta?' : '¿Activar y Publicar Alerta?'}
        description={
          targetToggleAlert?.isActive
            ? `Se removerá el banner de la portada del portal turístico ("${targetToggleAlert?.title}").`
            : `Se publicará inmediatamente en la portada del portal turístico como aviso prioritario ("${targetToggleAlert?.title}").`
        }
        confirmLabel={targetToggleAlert?.isActive ? 'Sí, Desactivar' : 'Sí, Activar Ahora'}
        variant={targetToggleAlert?.isActive ? 'warning' : 'primary'}
        isLoading={isToggling}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(targetDeleteAlert)}
        onClose={() => setTargetDeleteAlert(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Registro de Alerta?"
        description={`Esta acción removerá permanentemente la alerta "${targetDeleteAlert?.title}".`}
        confirmLabel="Eliminar Definitivamente"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
