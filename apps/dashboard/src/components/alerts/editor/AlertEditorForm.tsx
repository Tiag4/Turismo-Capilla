import React, { useState } from 'react';
import { Flame, AlertTriangle, Info, ArrowLeft, Save } from 'lucide-react';
import { Button } from '../../ui/Button.tsx';
import { Input } from '../../ui/Input.tsx';
import type { Alert, AlertSeverity, CreateOrUpdateAlertDto } from '../../../types/alert.types.ts';

const SEVERITY_OPTIONS: {
  value: AlertSeverity;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  borderClass: string;
}[] = [
  {
    value: 'INFO',
    label: 'Informativa / Recomendación',
    sublabel: 'Avisos turísticos generales, eventos climáticos leves',
    icon: Info,
    colorClass: 'text-sky-600 bg-sky-50',
    borderClass: 'border-sky-300',
  },
  {
    value: 'WARNING',
    label: 'Precaución / Alerta Amarilla',
    sublabel: 'Riesgo moderado, vientos fuertes o senderos resbaladizos',
    icon: AlertTriangle,
    colorClass: 'text-amber-600 bg-amber-50',
    borderClass: 'border-amber-400',
  },
  {
    value: 'DANGER',
    label: 'Peligro / Alerta Naranja',
    sublabel: 'Riesgo extremo de incendios forestales o crecida de ríos',
    icon: Flame,
    colorClass: 'text-orange-600 bg-orange-50',
    borderClass: 'border-orange-500',
  },
];

export interface AlertEditorFormProps {
  initialData?: Alert | null;
  onSubmit: (dto: CreateOrUpdateAlertDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const AlertEditorForm: React.FC<AlertEditorFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [message, setMessage] = useState(initialData?.message ?? '');
  const [severity, setSeverity] = useState<AlertSeverity>(initialData?.severity ?? 'WARNING');
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl ?? '');
  const [linkText, setLinkText] = useState(initialData?.linkText ?? '');
  const [expiresAt, setExpiresAt] = useState(() => {
    if (initialData?.expiresAt) {
      const date = new Date(initialData.expiresAt);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    return '';
  });
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('El título de la alerta es obligatorio.');
      return;
    }
    if (!message.trim()) {
      setValidationError('El mensaje explicativo de la alerta es obligatorio.');
      return;
    }

    const dto: CreateOrUpdateAlertDto = {
      title: title.trim(),
      message: message.trim(),
      severity,
      linkUrl: linkUrl.trim() || undefined,
      linkText: linkText.trim() || undefined,
      isActive,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    };

    setValidationError(null);
    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-xl text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
            title="Volver al listado"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 mb-0.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Centro de Gestión de Alertas</span>
            </div>
            <h1 className="font-display font-black text-2xl text-sand-900">
              {initialData ? 'Editar Alerta Oficial' : 'Nueva Alerta Meteorológica o Territorial'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="terracotta" isLoading={isSubmitting} className="font-bold shadow-xs">
            <Save className="w-4 h-4 mr-1.5" />
            <span>{initialData ? 'Actualizar Alerta' : 'Publicar Alerta'}</span>
          </Button>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
          {validationError}
        </div>
      )}

      {/* Nivel de Gravedad */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">
          Nivel de Gravedad / Riesgo Operativo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SEVERITY_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = severity === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeverity(opt.value)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected ? `${opt.borderClass} ${opt.colorClass} shadow-xs` : 'border-sand-200 hover:border-sand-300 bg-sand-50/50'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-white shadow-xs' : 'bg-sand-100'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sand-900">{opt.label}</div>
                  <div className="text-[11px] text-sand-500 mt-0.5 leading-snug">{opt.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido de la Alerta */}
      <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-sand-900 uppercase tracking-wider">Detalles de la Publicación</h2>
        <Input
          label="Título de la Alerta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Alerta por Vientos Huracanados e Índice Extremo de Incendios"
          required
        />

        <div>
          <label className="block text-xs font-bold text-sand-700 mb-1.5">
            Mensaje Explicativo / Protocolo para Turistas y Prestadores
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Explicá las restricciones vigentes, precauciones en ríos o cerros, y teléfonos de emergencia..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 text-sand-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white resize-y"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Enlace a Protocolo o Defensa Civil (Opcional)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://capilladelmonte.gov.ar/protocolo-fuego"
          />
          <Input
            label="Texto del Botón de Enlace (Opcional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            placeholder="Ej: Ver protocolo de Defensa Civil"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Input
            label="Fecha y Hora de Expiración Automática"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            helperText="Al cumplirse el plazo la alerta se archivará automáticamente."
          />
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isActiveAlert"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded text-terracotta-600 focus:ring-terracotta-500 cursor-pointer"
            />
            <label htmlFor="isActiveAlert" className="text-xs font-bold text-sand-800 cursor-pointer">
              Activar de Inmediato en Portada y Banners Oficiales
            </label>
          </div>
        </div>
      </div>
    </form>
  );
};
