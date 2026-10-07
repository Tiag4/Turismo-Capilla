import React, { useState } from 'react';
import { Compass, ShieldAlert, CloudRain, ChevronDown, AlertTriangle } from 'lucide-react';
import { EMERGENCY_PROTOCOLS } from './data/emergenciesData';

export const EmergencyProtocolAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string>(EMERGENCY_PROTOCOLS[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'compass':
        return <Compass className="w-5 h-5 text-terracotta-600" />;
      case 'shield':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'cloud-rain':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-sand-600" />;
    }
  };

  return (
    <div className="space-y-3">
      {EMERGENCY_PROTOCOLS.map((protocol) => {
        const isOpen = openId === protocol.id;
        return (
          <div
            key={protocol.id}
            className="bg-white rounded-2xl border border-sand-200 overflow-hidden shadow-xs transition-all"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? '' : protocol.id)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-sand-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center shrink-0">
                  {getIcon(protocol.iconName)}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm sm:text-base text-sand-900">
                    {protocol.title}
                  </h4>
                  <span className="text-xs text-sand-500 font-normal line-clamp-1">
                    {protocol.summary}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-sand-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-terracotta-600' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 space-y-4 border-t border-sand-100 text-xs sm:text-sm text-sand-700">
                <p className="font-medium text-sand-800">{protocol.summary}</p>

                <div className="space-y-2 bg-sand-50 p-4 rounded-xl border border-sand-200/80">
                  <span className="font-bold text-sand-900 block text-xs uppercase tracking-wider">
                    Pasos a seguir:
                  </span>
                  {protocol.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-sand-800">
                      <span className="w-4 h-4 rounded-full bg-sand-200 text-sand-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-red-50 border border-red-200 text-red-900 p-3 rounded-xl flex items-start gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Advertencia Crítica: </strong> {protocol.warningNote}
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
