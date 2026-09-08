import React from 'react';
import { Check } from 'lucide-react';

interface BookingWizardStepperProps {
  step: 2 | 3 | 'success';
}

export const BookingWizardStepper: React.FC<BookingWizardStepperProps> = ({ step }) => {
  const isStep2Active = step === 2;
  const isStep3Active = step === 3;
  const isStep2Completed = step === 3 || step === 'success';
  const isStep3Completed = step === 'success';

  return (
    <div className="w-full bg-white border-y border-stone-200 py-3 sm:py-4 px-4 sm:px-8 shadow-2xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-600 select-none">
        {/* Paso 1: Tu selección (Completado) */}
        <div className="flex items-center gap-2 text-emerald-800">
          <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="hidden sm:inline font-bold">1. Tu selección</span>
        </div>

        <div className="flex-1 h-0.5 bg-emerald-700 mx-2 sm:mx-4" />

        {/* Paso 2: Tus datos */}
        <div
          className={`flex items-center gap-2 ${
            isStep2Active
              ? 'text-terracotta-700 font-bold'
              : isStep2Completed
              ? 'text-emerald-800 font-bold'
              : 'text-stone-400 font-medium'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              isStep2Completed
                ? 'bg-emerald-700 text-white'
                : isStep2Active
                ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {isStep2Completed ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '2'}
          </div>
          <span>2. Tus datos</span>
        </div>

        <div
          className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
            isStep2Completed ? 'bg-emerald-700' : 'bg-stone-200'
          }`}
        />

        {/* Paso 3: Terminar reserva */}
        <div
          className={`flex items-center gap-2 ${
            isStep3Active
              ? 'text-terracotta-700 font-bold'
              : isStep3Completed
              ? 'text-emerald-800 font-bold'
              : 'text-stone-400 font-medium'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              isStep3Completed
                ? 'bg-emerald-700 text-white'
                : isStep3Active
                ? 'bg-terracotta-500 text-white ring-4 ring-terracotta-100'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {isStep3Completed ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '3'}
          </div>
          <span>3. Terminar reserva</span>
        </div>
      </div>
    </div>
  );
};
