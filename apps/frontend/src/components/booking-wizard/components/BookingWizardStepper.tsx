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
    <div className="w-full bg-white border-b border-stone-200 py-3 sm:py-4 px-4 sm:px-8 shadow-xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-600 select-none">
        {/* Paso 1: Tu selección (Siempre completado) */}
        <div className="flex items-center gap-2 text-blue-700">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
            <Check className="w-3.5 h-3.5" strokeWidth={3} />
          </div>
          <span className="hidden sm:inline">Tu selección</span>
        </div>

        <div className="flex-1 h-0.5 bg-blue-600 mx-2 sm:mx-4" />

        {/* Paso 2: Tus datos */}
        <div
          className={`flex items-center gap-2 ${
            isStep2Active ? 'text-blue-700 font-bold' : isStep2Completed ? 'text-blue-700' : 'text-stone-400'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              isStep2Completed
                ? 'bg-blue-600 text-white'
                : isStep2Active
                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {isStep2Completed ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '2'}
          </div>
          <span>Tus datos</span>
        </div>

        <div className={`flex-1 h-0.5 mx-2 sm:mx-4 ${isStep2Completed ? 'bg-blue-600' : 'bg-stone-200'}`} />

        {/* Paso 3: Terminar reserva */}
        <div
          className={`flex items-center gap-2 ${
            isStep3Active ? 'text-blue-700 font-bold' : isStep3Completed ? 'text-blue-700' : 'text-stone-400'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              isStep3Completed
                ? 'bg-blue-600 text-white'
                : isStep3Active
                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            {isStep3Completed ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : '3'}
          </div>
          <span>Terminar reserva</span>
        </div>
      </div>
    </div>
  );
};
