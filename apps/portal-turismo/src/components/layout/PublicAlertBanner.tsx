import React, { useEffect, useState } from 'react';
import { Flame, AlertTriangle, Info, X, ExternalLink } from 'lucide-react';
import { api, type PublicAlert, type AlertSeverity } from '../../services/api';

export const PublicAlertBanner: React.FC = () => {
  const [alert, setAlert] = useState<PublicAlert | null>(null);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAlert = async () => {
      try {
        const activeAlert = await api.getActiveAlert();
        if (!isMounted || !activeAlert) return;

        // Check if user already dismissed this specific alert during current session
        const sessionKey = `capilla_dismissed_alert_${activeAlert.id}`;
        const alreadyDismissed = sessionStorage.getItem(sessionKey) === 'true';

        if (!alreadyDismissed) {
          setAlert(activeAlert);
          setIsDismissed(false);
        }
      } catch {
        // Silently fail to protect LCP and user experience
      }
    };

    fetchAlert();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDismiss = () => {
    if (!alert) return;
    try {
      sessionStorage.setItem(`capilla_dismissed_alert_${alert.id}`, 'true');
    } catch {
      // Storage unavailable fallback
    }
    setIsDismissed(true);
  };

  if (isDismissed || !alert) {
    return null;
  }

  const severityConfigs: Record<
    AlertSeverity,
    {
      bgClass: string;
      borderClass: string;
      badgeClass: string;
      badgeText: string;
      Icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    DANGER: {
      bgClass: 'bg-rose-700 text-white',
      borderClass: 'border-b border-rose-800',
      badgeClass: 'bg-rose-900/60 text-rose-100 border-rose-500/40',
      badgeText: 'ALERTA MÁXIMA',
      Icon: Flame,
    },
    WARNING: {
      bgClass: 'bg-amber-600 text-white',
      borderClass: 'border-b border-amber-700',
      badgeClass: 'bg-amber-800/60 text-amber-100 border-amber-400/40',
      badgeText: 'PRECAUCIÓN',
      Icon: AlertTriangle,
    },
    INFO: {
      bgClass: 'bg-sky-700 text-white',
      borderClass: 'border-b border-sky-800',
      badgeClass: 'bg-sky-900/60 text-sky-100 border-sky-400/40',
      badgeText: 'AVISO OFICIAL',
      Icon: Info,
    },
  };

  const config = severityConfigs[alert.severity] || severityConfigs.WARNING;
  const SeverityIcon = config.Icon;

  return (
    <aside
      aria-label="Aviso oficial de seguridad y meteorología"
      className={`relative z-50 transition-all duration-300 ${config.bgClass} ${config.borderClass} shadow-md`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Main Content */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0 pr-6 sm:pr-0">
          <div className="p-1.5 rounded-lg bg-black/15 shrink-0 mt-0.5 sm:mt-0">
            <SeverityIcon className="w-5 h-5 text-white animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5 text-xs sm:text-sm leading-snug">
            <span
              className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase border self-start ${config.badgeClass}`}
            >
              {config.badgeText}
            </span>

            <span className="font-bold tracking-tight text-white/95">{alert.title}:</span>

            <span className="text-white/85 line-clamp-2 sm:line-clamp-1">{alert.message}</span>

            {alert.linkUrl && (
              <a
                href={alert.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-white transition-opacity text-white/95 hover:opacity-100 shrink-0 mt-1 sm:mt-0"
              >
                <span>{alert.linkText || 'Ver recomendaciones'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute sm:relative top-2 sm:top-auto right-2 sm:right-auto p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer shrink-0"
          title="Minimizar aviso"
          aria-label="Descartar aviso de alerta meteorológica"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
