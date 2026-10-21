import React from 'react';
import { Landmark, CreditCard, ShieldCheck, Percent } from 'lucide-react';
import { Input } from '../../../ui/Input';

export interface PaymentBankSectionProps {
  downPaymentPercentage: number;
  setDownPaymentPercentage: (val: number) => void;
  bankAccountHolder: string;
  setBankAccountHolder: (val: string) => void;
  bankCbu: string;
  setBankCbu: (val: string) => void;
  bankAlias: string;
  setBankAlias: (val: string) => void;
  bankName: string;
  setBankName: (val: string) => void;
}

export const PaymentBankSection: React.FC<PaymentBankSectionProps> = ({
  downPaymentPercentage,
  setDownPaymentPercentage,
  bankAccountHolder,
  setBankAccountHolder,
  bankCbu,
  setBankCbu,
  bankAlias,
  setBankAlias,
  bankName,
  setBankName,
}) => {
  const cleanCbu = bankCbu.replace(/\D/g, '');
  const isCbuValid = cleanCbu.length === 22;
  const cbuError =
    bankCbu.length > 0 && !isCbuValid
      ? `El CBU/CVU debe contener exactamente 22 dígitos numéricos (actualmente: ${cleanCbu.length})`
      : undefined;

  const handleCbuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 22);
    setBankCbu(raw);
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Alphanumeric with dots, uppercase
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9.]/g, '').slice(0, 30);
    setBankAlias(raw);
  };

  const percentagePresets = [30, 40, 50, 100];

  return (
    <div className="bg-white border border-[var(--color-sand-200)] rounded-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--color-sand-200)]">
        <Landmark className="w-5 h-5 text-[var(--color-terracotta-500)] shrink-0" />
        <div>
          <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
            Seña Requerida y Datos de Transferencia Bancaria
          </h3>
          <p className="text-xs text-[var(--color-sand-500)]">
            Configurá el anticipo que abona el huésped para confirmar su reserva y los datos bancarios donde transferirá
          </p>
        </div>
      </div>

      {/* Porcentaje de Seña */}
      <div>
        <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
          Porcentaje de Seña Requerido (%)
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {percentagePresets.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => setDownPaymentPercentage(pct)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                downPaymentPercentage === pct
                  ? 'border-[var(--color-terracotta-500)] bg-[var(--color-terracotta-50)] text-[var(--color-terracotta-700)] shadow-xs'
                  : 'border-sand-200 bg-white text-sand-700 hover:bg-sand-50'
              }`}
            >
              {pct}% {pct === 50 ? '(Estándar)' : pct === 100 ? '(Pago Total)' : ''}
            </button>
          ))}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-xs text-sand-500 font-medium">Personalizado:</span>
            <div className="relative w-24">
              <input
                type="number"
                min="0"
                max="100"
                value={downPaymentPercentage}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDownPaymentPercentage(Math.min(100, Math.max(0, Number(e.target.value) || 0)))
                }
                className="w-full px-3 py-1.5 pr-6 bg-sand-50/60 border border-sand-300 rounded-lg text-xs font-bold text-sand-900 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              />
              <Percent className="w-3 h-3 text-sand-400 absolute right-2 top-2.5" />
            </div>
          </div>
        </div>

        <div className="p-3 bg-sand-50/80 rounded-xl border border-sand-200 text-xs text-sand-600 flex items-start gap-2">
          <CreditCard className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
          <p>
            Al solicitar una reserva, el turista deberá transferir el <strong className="text-sand-900">{downPaymentPercentage}%</strong> del total para que puedas confirmarla. El <strong className="text-sand-900">{100 - downPaymentPercentage}%</strong> restante lo liquidará en efectivo o medios acordados al momento del ingreso.
          </p>
        </div>
      </div>

      {/* Datos Bancarios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start pt-1">
        <div>
          <Input
            label="Titular de la Cuenta"
            value={bankAccountHolder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankAccountHolder(e.target.value)}
            placeholder="Ej: Eduardo Soria"
            helperText="Nombre completo o razón social del titular"
          />
        </div>

        <div>
          <Input
            label="Banco / Billetera Virtual"
            value={bankName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBankName(e.target.value)}
            placeholder="Ej: Banco Santander / Mercado Pago"
            helperText="Entidad donde está radicada la cuenta"
          />
        </div>

        <div>
          <div className="relative">
            <Input
              label="CBU o CVU (22 dígitos)"
              value={bankCbu}
              onChange={handleCbuChange}
              placeholder="0110485530048500123456"
              maxLength={22}
              error={cbuError}
              helperText={
                isCbuValid
                  ? '✓ CBU Válido (22 dígitos)'
                  : '22 dígitos numéricos sin espacios ni guiones'
              }
            />
            {isCbuValid && (
              <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-3 top-9" />
            )}
          </div>
        </div>

        <div>
          <Input
            label="Alias Bancario"
            value={bankAlias}
            onChange={handleAliasChange}
            placeholder="Ej: PIRCAS.URITORCO.RIO"
            maxLength={30}
            helperText="Alias de transferencia para el huésped"
          />
        </div>
      </div>
    </div>
  );
};
