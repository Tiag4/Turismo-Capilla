import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { Modal } from '../ui/Modal.tsx';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { Select } from '../ui/Select.tsx';
import type { TourismSeason, CreateSeasonDto, SeasonType } from '../../types/season.types.ts';

export interface SeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  season: TourismSeason | null;
  onSubmit: (dto: CreateSeasonDto) => Promise<void>;
  isLoading: boolean;
}

export const SeasonModal: React.FC<SeasonModalProps> = ({
  isOpen,
  onClose,
  season,
  onSubmit,
  isLoading,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<SeasonType>('HIGH');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [multiplier, setMultiplier] = useState('1.3');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(season?.name || '');
    setType(season?.type || 'HIGH');
    setStartDate(season?.startDate || '');
    setEndDate(season?.endDate || '');
    setMultiplier(season?.suggestedMultiplier?.toString() || '1.3');
    setDescription(season?.description || '');
    setError(null);
  }, [season, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) {
      setError('Por favor completá los campos obligatorios (nombre y fechas).');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }

    setError(null);
    await onSubmit({
      name: name.trim(), type, startDate, endDate,
      suggestedMultiplier: parseFloat(multiplier) || 1.0,
      description: description.trim(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={season ? 'Editar Período Turístico' : 'Definir Nuevo Período Turístico'}
      subtitle="Parámetros oficiales para los calendarios y tarifas del pueblo"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <Input
          label="Nombre del Período o Evento Oficial"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Semana Santa Serrana, Fiesta Patronal de San Antonio..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Tipo de Temporada"
            value={type}
            onChange={(e) => setType(e.target.value as SeasonType)}
            options={[
              { value: 'HIGH', label: 'Temporada Alta (Pico)' },
              { value: 'MEDIUM', label: 'Temporada Media' },
              { value: 'LOW', label: 'Temporada Baja' },
              { value: 'SPECIAL_EVENT', label: 'Evento Especial / Fiesta' },
            ]}
          />

          <Input
            label="Multiplicador Tarifario Sugerido"
            type="number"
            step="0.1"
            min="0.5"
            max="3.0"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            helperText="Ej: 1.4 equivale a un +40% de tarifa base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Fecha de Fin"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sand-800)]">
            Descripción y Contexto Turístico
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles sobre atracciones activas, desfiles o motivos de alta afluencia..."
            className="w-full rounded-xl border border-[var(--color-sand-300)] bg-white px-3 py-2 text-xs text-[var(--color-sand-900)] focus:outline-none focus:border-[var(--color-emerald-portal-600)]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-sand-200)]">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="emerald" isLoading={isLoading}>
            <Save className="w-3.5 h-3.5" />
            <span>{season ? 'Guardar Cambios' : 'Crear Período'}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
