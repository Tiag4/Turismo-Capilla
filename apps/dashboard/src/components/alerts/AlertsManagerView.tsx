import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Info,
  Plus,
  ShieldCheck,
  Power,
  Edit2,
  Trash2,
  ExternalLink,
  Clock,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '../ui/Button.tsx';
import { StatCard } from '../ui/StatCard.tsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.tsx';
import { AlertModal } from './AlertModal.tsx';
import { alertsService } from '../../services/alerts.service.ts';
import type { Alert, CreateOrUpdateAlertDto, AlertSeverity } from '../../types/alert.types.ts';

export const AlertsManagerView: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal create / edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

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
    setEditingAlert(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (alert: Alert) => {
    setEditingAlert(alert);
    setIsModalOpen(true);
  };

  const handleSave = async (dto: CreateOrUpdateAlertDto) => {
    if (editingAlert) {
      await alertsService.update(editingAlert.id, dto);
    } else {
      await alertsService.create(dto);
    }
    await loadAlerts();
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
    DANGER: {
      label: 'Crítico / Peligro',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: Flame,
    },
    WARNING: {
      label: 'Precaución',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertTriangle,
    },
    INFO: {
      label: 'Informativo',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: Info,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-sand-900 tracking-tight">
              Alertas Meteorológicas y de Seguridad
            </h1>
            <p className="text-sm text-sand-500">
              Control oficial y publicación de avisos preventivos en tiempo real para la portada del portal público.
            </p>
          </div>
        </div>

        <Button variant="terracotta" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Emitir Nueva Alerta
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Estado en Portal Público"
          value={activeAlert ? 'Alerta Transmitiéndose' : 'Operación Normal'}
          helperText={activeAlert ? `Vigente: "${activeAlert.title}"` : 'Sin avisos preventivos de riesgo'}
          icon={activeAlert ? Radio : ShieldCheck}
          iconColor={activeAlert ? 'text-rose-600 animate-pulse' : 'text-emerald-portal-600'}
        />
        <StatCard
          label="Nivel de Severidad Activo"
          value={activeAlert ? severityBadges[activeAlert.severity].label : 'Condiciones Seguras'}
          helperText={activeAlert ? 'Visibilidad destacada en top banner' : 'Índice meteorológico sin novedades'}
          icon={
            activeAlert
              ? (activeAlert.severity === 'DANGER' ? Flame : activeAlert.severity === 'WARNING' ? AlertTriangle : Info)
              : CheckCircle2
          }
          iconColor={activeAlert ? severityBadges[activeAlert.severity].text : 'text-emerald-portal-600'}
        />
        <StatCard
          label="Historial de Alertas"
          value={alerts.length}
          helperText="Avisos emitidos en el sistema"
          icon={Clock}
          iconColor="text-sand-600"
        />
      </div>

      {/* Banner Preview / Active Alert Card */}
      <div className="bg-white rounded-2xl border border-sand-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-sand-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-portal-500 animate-ping" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-sand-700">
              Previsualización en Vivo de la Portada
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
                    <Flame className="w-5 h-5 text-white animate-bounce" />
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
                  {activeAlert.linkUrl && (
                    <a
                      href={activeAlert.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold underline underline-offset-2 hover:opacity-100 text-white/95 mt-1.5"
                    >
                      <span>{activeAlert.linkText || 'Ver recomendaciones oficiales'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {activeAlert.expiresAt && (
                <div className="text-[11px] bg-black/20 px-3 py-1.5 rounded-lg border border-white/10 shrink-0 self-end sm:self-center">
                  Vigente hasta: {new Date(activeAlert.expiresAt).toLocaleString('es-AR')}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-sand-300 bg-sand-50/50">
            <ShieldCheck className="w-10 h-10 text-emerald-portal-500 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-bold text-sand-800">No hay alertas activas en el portal público</p>
            <p className="text-xs text-sand-500 max-w-md mx-auto mt-1 mb-4">
              La portada del portal no muestra ningún aviso preventivo. Si se declara una crecida de río o riesgo de incendio, puedes emitir una alerta inmediata.
            </p>
            <Button variant="outline" size="sm" onClick={handleOpenCreate}>
              <Plus className="w-4 h-4 mr-1.5" />
              Emitir Alerta Ahora
            </Button>
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-sand-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-sand-900">Historial y Registro de Alertas</h2>
            <p className="text-xs text-sand-500">
              Listado completo de avisos preventivos históricos y vigentes.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-sm text-sand-500">Cargando registro de alertas...</div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-sm text-sand-500">
            No hay alertas registradas todavía.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-sand-800">
              <thead className="bg-sand-50/80 text-[11px] font-bold uppercase tracking-wider text-sand-500 border-b border-sand-200">
                <tr>
                  <th className="py-3 px-4">Severidad</th>
                  <th className="py-3 px-4">Título y Mensaje</th>
                  <th className="py-3 px-4">Vigencia / Emisión</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {alerts.map((item) => {
                  const badge = severityBadges[item.severity];
                  const Icon = badge.icon;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-sand-50/50 transition-colors ${
                        item.isActive ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{badge.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-md">
                        <div className="font-bold text-sand-900 mb-0.5">{item.title}</div>
                        <div className="text-xs text-sand-600 line-clamp-2 leading-relaxed">
                          {item.message}
                        </div>
                        {item.linkUrl && (
                          <a
                            href={item.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-terracotta-600 hover:text-terracotta-700 mt-1"
                          >
                            <span>{item.linkText || item.linkUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap text-xs text-sand-500">
                        <div>Emitido: {new Date(item.createdAt).toLocaleDateString('es-AR')}</div>
                        {item.expiresAt ? (
                          <div className="text-[11px] text-sand-400 mt-0.5">
                            Hasta: {new Date(item.expiresAt).toLocaleString('es-AR')}
                          </div>
                        ) : (
                          <div className="text-[11px] text-sand-400 mt-0.5">Sin vencimiento</div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top text-center whitespace-nowrap">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-portal-50 text-emerald-portal-700 border border-emerald-portal-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-portal-500 animate-pulse" />
                            Activa
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sand-100 text-sand-500">
                            Inactiva
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setTargetToggleAlert(item)}
                            title={item.isActive ? 'Desactivar Alerta' : 'Publicar y Activar Alerta'}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              item.isActive
                                ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                                : 'border-sand-300 text-sand-600 hover:bg-sand-100'
                            }`}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            title="Editar Alerta"
                            className="p-1.5 rounded-lg border border-sand-300 text-sand-600 hover:bg-sand-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setTargetDeleteAlert(item)}
                            title="Eliminar Alerta"
                            className="p-1.5 rounded-lg border border-sand-300 text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar */}
      <AlertModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        alertToEdit={editingAlert}
      />

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
