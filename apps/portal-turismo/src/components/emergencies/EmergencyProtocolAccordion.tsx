import React, { useState } from 'react';
import { Compass, ShieldAlert, CloudRain, ChevronDown, AlertTriangle } from 'lucide-react';
import { EMERGENCY_PROTOCOLS } from './data/emergenciesData';

export const EmergencyProtocolAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string>(EMERGENCY_PROTOCOLS[0]?.id ?? '');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'compass':
        return <Compass className="w-5 h-5 text-terracotta-700 shrink-0" aria-hidden="true" />;
      case 'shield':
        return <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-sand-700 shrink-0" aria-hidden="true" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-sand-700 shrink-0" aria-hidden="true" />;
    }
  };

  return (
    <div className="rounded-2xl border border-sand-200 bg-white divide-y divide-sand-200 overflow-hidden">
      {EMERGENCY_PROTOCOLS.map((protocol) => {
        const isOpen = openId === protocol.id;
        const buttonId = `protocol-btn-${protocol.id}`;
        const panelId = `protocol-panel-${protocol.id}`;

        return (
          <div key={protocol.id}>
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? '' : protocol.id)}
              className="w-full px-4 py-3.5 sm:px-5 sm:py-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-sand-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sand-900"
            >
              <div className="flex items-center gap-3 min-w-0">
                {getIcon(protocol.iconName)}
                <div className="min-w-0">
                  <span className="font-display font-bold text-sm sm:text-base text-sand-900 block">
                    {protocol.title}
                  </span>
                  <span className="text-xs text-sand-700 font-normal line-clamp-1 block">
                    {protocol.summary}
                  </span>
                </div>
              </div>
              <ChevronDown
                aria-hidden="true"
                className={`w-5 h-5 text-sand-700 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-sand-900' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-4 pb-4 pt-2 sm:px-5 sm:pb-5 space-y-3 bg-sand-50/70 border-t border-sand-200 text-xs sm:text-sm text-sand-800"
              >
                <ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-sand-900 leading-relaxed">
                  {protocol.steps.map((step, idx) => (
                    <li key={idx} className="marker:font-bold marker:text-sand-700">
                      {step}
                    </li>
                  ))}
                </ol>

                <div className="pt-2.5 border-t border-sand-200 flex items-start gap-2 text-xs text-red-800 font-medium leading-relaxed">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <p>
                    <strong className="font-bold text-red-900">Importante: </strong>
                    {protocol.warningNote}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
