import React, { useState, useEffect } from 'react';
import {
  Car,
  Train,
  Bus,
  AlertTriangle,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Ticket,
  Info,
  AlertOctagon,
} from 'lucide-react';
import { mobilityConfigService } from '../../services/mobilityConfig.service';
import type {
  MobilityConfig,
  TollDetail,
  TrainScheduleRow,
} from '../../types/mobility.types';
import { PORTAL_URL } from '../../config/navigation';

type ActiveTab = 'tolls' | 'train' | 'buses' | 'alert';

export const MobilityManagerView: React.FC = () => {
  const [config, setConfig] = useState<MobilityConfig>(() => mobilityConfigService.getConfig());
  const [activeTab, setActiveTab] = useState<ActiveTab>('tolls');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cargar del backend al montar si está disponible
  useEffect(() => {
    mobilityConfigService.fetchConfig().then((fresh) => {
      setConfig(fresh);
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      const saved = await mobilityConfigService.saveConfig(config);
      setConfig(saved);
      setFeedback({
        type: 'success',
        message: '¡Cambios guardados exitosamente! La página pública ya refleja las tarifas y frecuencias actualizadas.',
      });
      setTimeout(() => setFeedback(null), 5000);
    } catch {
      setFeedback({
        type: 'error',
        message: 'Ocurrió un error al persistir los cambios. Se mantendrán guardados localmente.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('¿Seguro que deseás restablecer todas las tarifas, frecuencias y avisos a los valores oficiales predeterminados?')) {
      const reset = await mobilityConfigService.resetConfig();
      setConfig(reset);
      setFeedback({
        type: 'success',
        message: 'Se han restablecido los valores oficiales de movilidad.',
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  // Helper para Tolls
  const handleUpdateToll = (index: number, updated: Partial<TollDetail>) => {
    setConfig((prev) => {
      const tolls = [...prev.tolls];
      tolls[index] = { ...tolls[index], ...updated };

      // Sincronizar en originsData las referencias de peajes con el mismo nombre
      const updatedTollName = tolls[index].name;
      const originsData = prev.originsData.map((cat) => ({
        ...cat,
        routes: cat.routes.map((rt) => ({
          ...rt,
          tolls: rt.tolls.map((t) => {
            if (t.name === updatedTollName || (t.id && t.id === tolls[index].id)) {
              return {
                ...t,
                estimatedFee: updated.estimatedFee !== undefined ? updated.estimatedFee : t.estimatedFee,
                paymentMethods: updated.paymentMethods !== undefined ? updated.paymentMethods : t.paymentMethods,
                operator: updated.operator !== undefined ? updated.operator : t.operator,
                notes: updated.notes !== undefined ? updated.notes : t.notes,
              };
            }
            return t;
          }),
        })),
      }));

      return { ...prev, tolls, originsData };
    });
  };

  const handleAddToll = () => {
    const newToll: TollDetail = {
      id: `toll-${Date.now()}`,
      name: 'Nueva Estación de Peaje',
      road: 'Ruta Nacional / Provincial',
      operator: 'Caminos de las Sierras',
      estimatedFee: '$1.000',
      paymentMethods: ['Efectivo', 'TelePASE'],
      notes: 'Información general del peaje.',
    };
    setConfig((prev) => ({
      ...prev,
      tolls: [...prev.tolls, newToll],
    }));
  };

  const handleDeleteToll = (index: number) => {
    if (window.confirm('¿Deseás eliminar esta estación de peaje?')) {
      setConfig((prev) => ({
        ...prev,
        tolls: prev.tolls.filter((_, i) => i !== index),
      }));
    }
  };

  // Helper para Train Schedules
  const handleUpdateSchedule = (index: number, field: keyof TrainScheduleRow, value: string) => {
    setConfig((prev) => {
      const schedules = [...prev.train.schedules];
      schedules[index] = {
        ...schedules[index],
        [field]: value,
      };
      return {
        ...prev,
        train: {
          ...prev.train,
          schedules,
        },
      };
    });
  };

  const handleAddSchedule = () => {
    const newRow: TrainScheduleRow = {
      serviceId: `TR-${config.train.schedules.length + 1}`,
      departureStation: 'Córdoba (Alta Córdoba)',
      departureTime: '08:00 hs',
      arrivalStation: 'Capilla del Monte',
      arrivalTime: '11:30 hs',
      duration: '3h 30m',
      days: 'Lunes a Domingos',
      type: 'Servicio Regular',
    };
    setConfig((prev) => ({
      ...prev,
      train: {
        ...prev.train,
        schedules: [...prev.train.schedules, newRow],
      },
    }));
  };

  const handleDeleteSchedule = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      train: {
        ...prev.train,
        schedules: prev.train.schedules.filter((_, i) => i !== index),
      },
    }));
  };

  // Helper para chips de empresas de colectivos
  const handleAddCompany = (category: 'interurban' | 'longDistance', company: string) => {
    const trimmed = company.trim();
    if (!trimmed) return;
    if (category === 'interurban') {
      if (config.busTerminal.interurbanCompanies.includes(trimmed)) return;
      setConfig((prev) => ({
        ...prev,
        busTerminal: {
          ...prev.busTerminal,
          interurbanCompanies: [...prev.busTerminal.interurbanCompanies, trimmed],
        },
      }));
    } else {
      if (config.busTerminal.longDistanceCompanies.includes(trimmed)) return;
      setConfig((prev) => ({
        ...prev,
        busTerminal: {
          ...prev.busTerminal,
          longDistanceCompanies: [...prev.busTerminal.longDistanceCompanies, trimmed],
        },
      }));
    }
  };

  const handleRemoveCompany = (category: 'interurban' | 'longDistance', company: string) => {
    if (category === 'interurban') {
      setConfig((prev) => ({
        ...prev,
        busTerminal: {
          ...prev.busTerminal,
          interurbanCompanies: prev.busTerminal.interurbanCompanies.filter((c) => c !== company),
        },
      }));
    } else {
      setConfig((prev) => ({
        ...prev,
        busTerminal: {
          ...prev.busTerminal,
          longDistanceCompanies: prev.busTerminal.longDistanceCompanies.filter((c) => c !== company),
        },
      }));
    }
  };

  const [newInterurbanInput, setNewInterurbanInput] = useState('');
  const [newLongDistanceInput, setNewLongDistanceInput] = useState('');

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[var(--color-sand-200)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-sand-900)] font-['Outfit']">
              Gestión de Movilidad & Accesos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Página Pública 'Cómo Llegar'
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-sand-500)] mt-0.5">
            Administrá tarifas vigentes de peajes, frecuencias del Tren de las Sierras, colectivos y alertas viales sin necesidad de desplegar código.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={`${PORTAL_URL}/como-llegar`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-sand-700)] bg-white border border-[var(--color-sand-300)] hover:bg-[var(--color-sand-100)] transition-colors shadow-2xs"
          >
            <span>Ver Guía Pública</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleReset}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Restablecer tarifas y frecuencias por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-emerald-portal-600)] hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-center justify-between animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold hover:underline opacity-80 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1.5 bg-[var(--color-sand-100)] rounded-2xl border border-[var(--color-sand-200)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('tolls')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'tolls'
              ? 'bg-white text-[var(--color-sand-900)] shadow-xs border border-[var(--color-sand-300)]'
              : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-white/60'
          }`}
        >
          <Car className="w-4 h-4 text-amber-600" />
          <span>Peajes & Rutas ({config.tolls.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('train')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'train'
              ? 'bg-white text-[var(--color-sand-900)] shadow-xs border border-[var(--color-sand-300)]'
              : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-white/60'
          }`}
        >
          <Train className="w-4 h-4 text-emerald-600" />
          <span>Tren de las Sierras ({config.train.fareRange})</span>
        </button>

        <button
          onClick={() => setActiveTab('buses')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'buses'
              ? 'bg-white text-[var(--color-sand-900)] shadow-xs border border-[var(--color-sand-300)]'
              : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-white/60'
          }`}
        >
          <Bus className="w-4 h-4 text-terracotta-600" />
          <span>Terminal & Colectivos</span>
        </button>

        <button
          onClick={() => setActiveTab('alert')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'alert'
              ? 'bg-white text-[var(--color-sand-900)] shadow-xs border border-[var(--color-sand-300)]'
              : 'text-[var(--color-sand-600)] hover:text-[var(--color-sand-900)] hover:bg-white/60'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${config.transitAlert.active ? 'text-rose-600' : 'text-[var(--color-sand-400)]'}`} />
          <span>
            Aviso de Tránsito Activo
            {config.transitAlert.active && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] bg-rose-100 text-rose-700 font-extrabold">
                ACTIVO
              </span>
            )}
          </span>
        </button>
      </div>

      {/* TAB 1: PEAJES Y TARIFAS */}
      {activeTab === 'tolls' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Estaciones de Peaje & Tarifas Categoría 2 (Autos y Camionetas)
              </h3>
              <p className="text-xs text-[var(--color-sand-500)]">
                Las tarifas modificadas aquí se actualizan inmediatamente en las tarjetas de peaje de todas las rutas de procedencia.
              </p>
            </div>
            <button
              onClick={handleAddToll}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Peaje</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.tolls.map((toll, idx) => (
              <div
                key={toll.id || idx}
                className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase">
                      Nombre de la Estación
                    </label>
                    <input
                      type="text"
                      value={toll.name}
                      onChange={(e) => handleUpdateToll(idx, { name: e.target.value })}
                      className="w-full text-sm font-bold text-[var(--color-sand-900)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    onClick={() => handleDeleteToll(idx)}
                    type="button"
                    className="p-1.5 rounded-lg text-[var(--color-sand-400)] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer mt-5"
                    title="Eliminar estación de peaje"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase">
                      Ruta / Corredor
                    </label>
                    <input
                      type="text"
                      value={toll.road}
                      onChange={(e) => handleUpdateToll(idx, { road: e.target.value })}
                      className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase">
                      Concesionaria
                    </label>
                    <input
                      type="text"
                      value={toll.operator}
                      onChange={(e) => handleUpdateToll(idx, { operator: e.target.value })}
                      className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-amber-900 uppercase">
                    Tarifa Estimada Vigente (Categoría 2)
                  </label>
                  <input
                    type="text"
                    value={toll.estimatedFee}
                    onChange={(e) => handleUpdateToll(idx, { estimatedFee: e.target.value })}
                    placeholder="$1.000"
                    className="w-full text-sm font-extrabold text-terracotta-700 bg-amber-50/50 border border-amber-300 rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase">
                    Medios de Pago Aceptados (separados por coma)
                  </label>
                  <input
                    type="text"
                    value={toll.paymentMethods.join(', ')}
                    onChange={(e) =>
                      handleUpdateToll(idx, {
                        paymentMethods: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Efectivo, TelePASE, Pase Alpa"
                    className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase">
                    Notas de Tránsito / Precauciones
                  </label>
                  <input
                    type="text"
                    value={toll.notes || ''}
                    onChange={(e) => handleUpdateToll(idx, { notes: e.target.value })}
                    placeholder="Ej: Cabinas bidireccionales con vías de telepeaje."
                    className="w-full text-xs text-[var(--color-sand-700)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Rutas y Precauciones */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
              Consejos de Tránsito por Procedencia (Precauciones al turista)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.originsData.map((cat, catIdx) => (
                <div key={cat.id} className="p-3.5 bg-[var(--color-sand-50)] rounded-xl border border-[var(--color-sand-200)] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-sand-900)]">{cat.label}</span>
                    <span className="text-[10px] text-[var(--color-sand-500)]">{cat.badge}</span>
                  </div>
                  {cat.routes.map((rt, rtIdx) => (
                    <div key={rt.id} className="space-y-1 pt-1">
                      <label className="block text-[10px] text-[var(--color-sand-500)] font-semibold truncate">
                        {rt.name}
                      </label>
                      <input
                        type="text"
                        value={rt.precautions || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfig((prev) => {
                            const originsData = [...prev.originsData];
                            originsData[catIdx].routes[rtIdx].precautions = val;
                            return { ...prev, originsData };
                          });
                        }}
                        placeholder="Ej: En temporada alta prever demoras..."
                        className="w-full text-xs text-[var(--color-sand-800)] bg-white border border-[var(--color-sand-300)] rounded-lg p-2 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TREN DE LAS SIERRAS */}
      {activeTab === 'train' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] flex items-center gap-2">
              <Ticket className="w-4 h-4 text-emerald-600" />
              <span>Tarifa y Enlace Oficial de Boletería (Tren de las Sierras)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Tarifa Oficial por Tramo (Visualización al turista)
                </label>
                <input
                  type="text"
                  value={config.train.fareRange}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      train: { ...prev.train, fareRange: e.target.value },
                    }))
                  }
                  placeholder="$250 - $400 ARS"
                  className="w-full text-sm font-extrabold text-emerald-800 bg-emerald-50/50 border border-emerald-300 rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Enlace Oficial de Venta SOFSE
                </label>
                <input
                  type="text"
                  value={config.train.bookingUrl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      train: { ...prev.train, bookingUrl: e.target.value },
                    }))
                  }
                  placeholder="https://webventas.sofse.gob.ar/"
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Nombre de la Estación Capilla del Monte
                </label>
                <input
                  type="text"
                  value={config.train.stationName}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      train: { ...prev.train, stationName: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Dirección de la Estación
                </label>
                <input
                  type="text"
                  value={config.train.stationAddress}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      train: { ...prev.train, stationAddress: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                Consejo del Viajero / Nota Informativa
              </label>
              <textarea
                rows={2}
                value={config.train.alertNote || ''}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    train: { ...prev.train, alertNote: e.target.value },
                  }))
                }
                placeholder="Se recomienda adquirir los pasajes con 3 a 5 días de anticipación..."
                className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Tabla de Frecuencias del Tren */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                  Tabla de Servicios y Frecuencias Oficiales
                </h4>
                <p className="text-xs text-[var(--color-sand-500)]">
                  Horarios de partida y llegada del recorrido Alta Córdoba &lt;-&gt; Capilla del Monte.
                </p>
              </div>

              <button
                onClick={handleAddSchedule}
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Servicio</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--color-sand-200)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--color-sand-100)] text-[var(--color-sand-700)] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Salida (Horario / Estación)</th>
                    <th className="py-2.5 px-3">Llegada (Horario / Estación)</th>
                    <th className="py-2.5 px-3">Días</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-sand-200)]">
                  {config.train.schedules.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[var(--color-sand-50)]">
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.serviceId}
                          onChange={(e) => handleUpdateSchedule(idx, 'serviceId', e.target.value)}
                          className="w-24 text-xs font-bold text-emerald-800 border border-[var(--color-sand-200)] rounded p-1"
                        />
                      </td>
                      <td className="py-2.5 px-3 space-y-1">
                        <input
                          type="text"
                          value={row.departureTime}
                          onChange={(e) => handleUpdateSchedule(idx, 'departureTime', e.target.value)}
                          className="w-24 text-xs font-semibold border border-[var(--color-sand-200)] rounded p-1 mr-2"
                        />
                        <input
                          type="text"
                          value={row.departureStation}
                          onChange={(e) => handleUpdateSchedule(idx, 'departureStation', e.target.value)}
                          className="w-40 text-xs text-[var(--color-sand-600)] border border-[var(--color-sand-200)] rounded p-1"
                        />
                      </td>
                      <td className="py-2.5 px-3 space-y-1">
                        <input
                          type="text"
                          value={row.arrivalTime}
                          onChange={(e) => handleUpdateSchedule(idx, 'arrivalTime', e.target.value)}
                          className="w-24 text-xs font-semibold border border-[var(--color-sand-200)] rounded p-1 mr-2"
                        />
                        <input
                          type="text"
                          value={row.arrivalStation}
                          onChange={(e) => handleUpdateSchedule(idx, 'arrivalStation', e.target.value)}
                          className="w-40 text-xs text-[var(--color-sand-600)] border border-[var(--color-sand-200)] rounded p-1"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.days}
                          onChange={(e) => handleUpdateSchedule(idx, 'days', e.target.value)}
                          className="w-36 text-xs text-[var(--color-sand-700)] border border-[var(--color-sand-200)] rounded p-1"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <select
                          value={row.type}
                          onChange={(e) => handleUpdateSchedule(idx, 'type', e.target.value as any)}
                          className="text-xs border border-[var(--color-sand-200)] rounded p-1 bg-white"
                        >
                          <option value="Servicio Regular">Servicio Regular</option>
                          <option value="Servicio Turístico Feriados">Servicio Turístico Feriados</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => handleDeleteSchedule(idx)}
                          type="button"
                          className="p-1 rounded text-[var(--color-sand-400)] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TERMINAL & COLECTIVOS */}
      {activeTab === 'buses' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] flex items-center gap-2">
              <Bus className="w-4 h-4 text-terracotta-600" />
              <span>Terminal de Ómnibus de Capilla del Monte</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Dirección de la Terminal
                </label>
                <input
                  type="text"
                  value={config.busTerminal.terminalAddress}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, terminalAddress: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Teléfono / Informes Boletería
                </label>
                <input
                  type="text"
                  value={config.busTerminal.terminalPhone}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, terminalPhone: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Frecuencia de Salidas Promedio
                </label>
                <input
                  type="text"
                  value={config.busTerminal.frequencyNote}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, frequencyNote: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Interurbanos */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Líneas Interurbanas (Córdoba - Punilla)
              </h4>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Descripción del Servicio
                </label>
                <textarea
                  rows={2}
                  value={config.busTerminal.interurbanDescription}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, interurbanDescription: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Medios de Pago / Abono
                </label>
                <input
                  type="text"
                  value={config.busTerminal.interurbanPaymentNote}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, interurbanPaymentNote: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Empresas Habilitadas
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.busTerminal.interurbanCompanies.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-sand-100)] text-[var(--color-sand-800)] border border-[var(--color-sand-200)]"
                    >
                      <span>{comp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany('interurban', comp)}
                        className="text-[var(--color-sand-400)] hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newInterurbanInput}
                    onChange={(e) => setNewInterurbanInput(e.target.value)}
                    placeholder="Nueva empresa..."
                    className="flex-1 text-xs border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-terracotta-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCompany('interurban', newInterurbanInput);
                        setNewInterurbanInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddCompany('interurban', newInterurbanInput);
                      setNewInterurbanInput('');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-terracotta-50 text-terracotta-800 border border-terracotta-300 hover:bg-terracotta-100 cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>

            {/* Larga Distancia */}
            <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-4">
              <h4 className="text-sm font-bold text-[var(--color-sand-900)] font-['Outfit']">
                Empresas de Larga Distancia (Directo a Capilla del Monte)
              </h4>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Título de Sección
                </label>
                <input
                  type="text"
                  value={config.busTerminal.longDistanceTitle}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      busTerminal: { ...prev.busTerminal, longDistanceTitle: e.target.value },
                    }))
                  }
                  className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Empresas Nacionales Directas
                </label>
                <div className="flex flex-wrap gap-2">
                  {config.busTerminal.longDistanceCompanies.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[var(--color-sand-100)] text-[var(--color-sand-800)] border border-[var(--color-sand-200)]"
                    >
                      <span>{comp}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany('longDistance', comp)}
                        className="text-[var(--color-sand-400)] hover:text-rose-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newLongDistanceInput}
                    onChange={(e) => setNewLongDistanceInput(e.target.value)}
                    placeholder="Nueva empresa (ej: Flecha Bus)..."
                    className="flex-1 text-xs border border-[var(--color-sand-200)] rounded-lg p-2 focus:ring-1 focus:ring-terracotta-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCompany('longDistance', newLongDistanceInput);
                        setNewLongDistanceInput('');
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddCompany('longDistance', newLongDistanceInput);
                      setNewLongDistanceInput('');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-terracotta-50 text-terracotta-800 border border-terracotta-300 hover:bg-terracotta-100 cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AVISO DE TRÁNSITO ACTIVO */}
      {activeTab === 'alert' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-[var(--color-sand-200)] shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-sand-200)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--color-sand-900)] font-['Outfit'] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Aviso de Tránsito Serrano en la Guía 'Cómo Llegar'</span>
                </h3>
                <p className="text-xs text-[var(--color-sand-500)]">
                  Activá este banner para comunicar a los turistas condiciones especiales (niebla en Camino del Cuadrado, hielo en Altas Cumbres, obras en RN 38, etc.).
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.transitAlert.active}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      transitAlert: {
                        ...prev.transitAlert,
                        active: e.target.checked,
                        updatedAt: new Date().toISOString(),
                      },
                    }))
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-emerald-portal-600)]" />
                <span className="ml-3 text-xs font-bold text-[var(--color-sand-800)]">
                  {config.transitAlert.active ? 'Aviso Activo' : 'Aviso Inactivo'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Nivel de Severidad
                </label>
                <select
                  value={config.transitAlert.severity}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      transitAlert: {
                        ...prev.transitAlert,
                        severity: e.target.value as any,
                      },
                    }))
                  }
                  className="w-full text-xs font-semibold border border-[var(--color-sand-200)] rounded-lg p-2.5 bg-white"
                >
                  <option value="info">Informativo (Azul) - Tránsito Normal o Aclaración Leve</option>
                  <option value="warning">Precaución (Ámbar) - Niebla, Lluvia o Demoras</option>
                  <option value="danger">Alerta / Restricción (Rojo) - Corte Temporal o Hielo</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                  Título del Aviso
                </label>
                <input
                  type="text"
                  value={config.transitAlert.title}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      transitAlert: { ...prev.transitAlert, title: e.target.value },
                    }))
                  }
                  placeholder="Ej: Camino del Cuadrado con visibilidad reducida por niebla"
                  className="w-full text-xs font-bold text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-[var(--color-sand-600)] uppercase">
                Mensaje Detallado para el Turista
              </label>
              <textarea
                rows={3}
                value={config.transitAlert.message}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    transitAlert: { ...prev.transitAlert, message: e.target.value },
                  }))
                }
                placeholder="Detalle el estado del corredor, recomendaciones de velocidad y pasos alternativos..."
                className="w-full text-xs text-[var(--color-sand-800)] border border-[var(--color-sand-200)] rounded-lg p-2.5 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Vista Previa en Vivo */}
            <div className="pt-2">
              <span className="block text-[11px] font-bold text-[var(--color-sand-500)] uppercase tracking-wider mb-2">
                Vista previa del banner en el Portal Público:
              </span>
              <div
                className={`rounded-2xl border p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4 transition-all ${
                  config.transitAlert.severity === 'danger'
                    ? 'bg-rose-50/90 border-rose-300 text-rose-950'
                    : config.transitAlert.severity === 'warning'
                    ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                    : 'bg-sky-50/90 border-sky-300 text-sky-950'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl bg-white/80 shrink-0 ${
                    config.transitAlert.severity === 'danger'
                      ? 'text-rose-600'
                      : config.transitAlert.severity === 'warning'
                      ? 'text-amber-600'
                      : 'text-sky-600'
                  }`}
                >
                  {config.transitAlert.severity === 'danger' ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : config.transitAlert.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                        config.transitAlert.severity === 'danger'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : config.transitAlert.severity === 'warning'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-sky-100 text-sky-800 border-sky-300'
                      }`}
                    >
                      {config.transitAlert.severity === 'danger'
                        ? 'Alerta / Restricción Vial'
                        : config.transitAlert.severity === 'warning'
                        ? 'Precaución en Rutas'
                        : 'Información de Tránsito'}
                    </span>
                    <h4 className="text-sm font-bold font-display">{config.transitAlert.title || 'Título del aviso'}</h4>
                  </div>
                  <p className="text-xs leading-relaxed opacity-90">
                    {config.transitAlert.message || 'Contenido descriptivo del aviso vial para los visitantes.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
