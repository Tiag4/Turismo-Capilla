import React, { useState, useEffect } from 'react';
import { Flame, AlertTriangle, Info, BellRing, Link2, Calendar } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import type { Alert, AlertSeverity, CreateOrUpdateAlertDto } from '../../types/alert.types.ts';

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dto: CreateOrUpdateAlertDto) => Promise<void>;
  alertToEdit?: Alert | null;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onSave,
  alertToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertSeverity>('WARNING');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (alertToEdit) {
      setTitle(alertToEdit.title);
      setMessage(alertToEdit.message);
      setSeverity(alertToEdit.severity);
      setLinkUrl(alertToEdit.linkUrl || '');
      setLinkText(alertToEdit.linkText || '');
      setIsActive(alertToEdit.isActive);
      if (alertToEdit.expiresAt) {
        // Format ISO string to datetime-local value (YYYY-MM-DDTHH:mm)
        const date = new Date(alertToEdit.expiresAt);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const localIso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        setExpiresAt(localIso);
      } else {
        setExpiresAt('');
      }
    } else {
      setTitle('');
      setMessage('');
      setSeverity('WARNING');
      setLinkUrl('');
      setLinkText('');
      setExpiresAt('');
      setIsActive(true);
    }
    setError(null);
  }, [alertToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título de la alerta es obligatorio');
      return;
    }
    if (!message.trim()) {
      setError('El mensaje explicativo es obligatorio');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const dto: CreateOrUpdateAlertDto = {
        title: title.trim(),
        message: message.trim(),
        severity,
        linkUrl: linkUrl.trim() || undefined,
        linkText: linkText.trim() || undefined,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
      };

      await onSave(dto);
      onClose();
    } catch (err: unknown) {
      console.error('Error al guardar alerta:', err);
      setError(err instanceof Error ? err.message : 'Error inesperado al guardar la alerta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const severityOptions: {
    value: AlertSeverity;
    label: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    colorClass: string;
    borderClass: string;
    bgClass: string;
  }[] = [
    {
      value: 'INFO',
      label: 'Informativo (Azul)',
      sublabel: 'Avisos turísticos, recomendaciones generales y tránsito normal.',
      icon: Info,
      colorClass: 'text-sky-700',
      borderClass: 'border-sky-400 bg-sky-50',
      bgClass: 'hover:bg-sky-50/50',
    },
    {
      value: 'WARNING',
      label: 'Precaución (Naranja)',
      sublabel: 'Riesgo moderado de tormentas, senderos con baja adherencia o vientos.',
      icon: AlertTriangle,
      colorClass: 'text-amber-700',
      borderClass: 'border-amber-400 bg-amber-50',
      bgClass: 'hover:bg-amber-50/50',
    },
    {
      value: 'DANGER',
      label: 'Crítico / Peligro (Rojo)',
      sublabel: 'Riesgo extremo de incendios forestales, crecidas de ríos o clausura de cerros.',
      icon: Flame,
      colorClass: 'text-rose-700',
      borderClass: 'border-rose-400 bg-rose-50',
      bgClass: 'hover:bg-rose-50/50',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={alertToEdit ? 'Editar Alerta Oficial' : 'Emitir Nueva Alerta Oficial'}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Nivel de Severidad */}
        <div>
          <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
            Nivel de Severidad
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {severityOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = severity === opt.value;
              return (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setSeverity(opt.value)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected ? `${opt.borderClass} ring-2 ring-offset-1 ring-current shadow-xs` : `border-sand-200 bg-white ${opt.bgClass}`
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${opt.colorClass}`} />
                    <span className={`text-xs font-bold ${isSelected ? opt.colorClass : 'text-sand-900'}`}>
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-sand-500 leading-tight">
                    {opt.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Título de la Alerta */}
        <div>
          <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
            Título del Aviso <span className="text-terracotta-600">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Alerta por Crecida del Río Dolores / Riesgo de Incendios"
              maxLength={180}
              className="w-full px-3.5 py-2.5 bg-sand-50/60 border border-sand-300 rounded-xl text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-medium"
              required
            />
            <span className="absolute right-3 top-3 text-[10px] text-sand-400">
              {title.length}/180
            </span>
          </div>
        </div>

        {/* Mensaje Descriptivo */}
        <div>
          <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
            Mensaje Descriptivo e Instrucciones Preventivas <span className="text-terracotta-600">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Detalle las indicaciones preventivas para vecinos y turistas (ej. mantenerse alejado de las costas de los ríos, prohibición estricta de fuego en zonas agrestes)."
            className="w-full px-3.5 py-2.5 bg-sand-50/60 border border-sand-300 rounded-xl text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 resize-none font-medium"
            required
          />
        </div>

        {/* Enlace opcional a recomendaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
              Enlace de Información Oficial (Opcional)
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-sand-400 absolute left-3 top-3" />
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://capilladelmonte.gov.ar/defensa-civil"
                className="w-full pl-9 pr-3.5 py-2.5 bg-sand-50/60 border border-sand-300 rounded-xl text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
              Texto del Enlace
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Ej: Protocolo de Prevención"
              className="w-full px-3.5 py-2.5 bg-sand-50/60 border border-sand-300 rounded-xl text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-medium"
            />
          </div>
        </div>

        {/* Vigencia y Estado Activo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-1.5">
              Vigencia Hasta (Opcional)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-sand-400 absolute left-3 top-3" />
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 bg-sand-50/60 border border-sand-300 rounded-xl text-sand-900 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 font-medium"
              />
            </div>
            <p className="text-[11px] text-sand-400 mt-1">
              Si se especifica, la alerta dejará de mostrarse automáticamente pasada esa fecha.
            </p>
          </div>

          <div className="flex flex-col justify-center sm:pl-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-sand-200 bg-sand-50/50 cursor-pointer hover:bg-sand-100/50 transition-colors">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-terracotta-600 rounded border-sand-300 focus:ring-terracotta-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="font-bold text-sand-900 block">Publicar y Activar Inmediatamente</span>
                <span className="text-sand-500">Se proyectará al tope de la portada del portal turístico.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-sand-200">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="terracotta"
            isLoading={isSubmitting}
          >
            <BellRing className="w-4 h-4 mr-1.5" />
            {alertToEdit ? 'Guardar Cambios' : 'Emitir Alerta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
