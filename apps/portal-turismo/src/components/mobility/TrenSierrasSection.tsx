import React from 'react';
import { Train, ExternalLink, Calendar, MapPin, Ticket, Sparkles, AlertCircle } from 'lucide-react';
import { TRAIN_STATIONS_LIST, TRAIN_SCHEDULES } from './data/mobilityData';

export const TrenSierrasSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-900 to-sand-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
      {/* Detalle decorativo de fondo */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Encabezado del Tren */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patrimonio Ferroviario & Paisajístico</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl tracking-tight">
            El Tren de las Sierras
          </h2>
          <p className="text-sm sm:text-base text-sand-300 leading-relaxed font-light">
            El servicio ferroviario regional más pintoresco de la provincia. Conecta la Ciudad de Córdoba con Capilla del Monte atravesando túneles, puentes y las sierras de Punilla a un valor oficial hiper-accesible.
          </p>
        </div>

        {/* Tarifa y Botón Oficial */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 shrink-0 space-y-3">
          <div className="flex items-center gap-2 text-xs text-sand-300">
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>Tarifa Oficial por Tramo</span>
          </div>
          <div className="text-2xl font-extrabold font-display text-white">
            $250 - $400 <span className="text-xs font-normal text-sand-300">ARS</span>
          </div>
          <a
            href="https://www.argentina.gob.ar/transporte/trenes-argentinos/horarios-tarifas-y-recorridos/servicios-regionales/cordoba"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <span>Reservar Pasajes Oficiales</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Ubicación de la Estación */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">Estación Capilla del Monte (Destino Final)</h4>
            <p className="text-xs text-sand-300">Predio del Ferrocarril / Centro Cívico (Av. Pueyrredón e Hipólito Yrigoyen)</p>
          </div>
        </div>
        <a
          href="https://maps.google.com/?q=Estacion+Capilla+del+Monte+Cordoba"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 underline underline-offset-4"
        >
          <span>Ver ubicación en Google Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Recorrido Completo de Estaciones */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-sand-400 uppercase tracking-wider block">
          Recorrido de Estaciones (Corredor Punilla):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {TRAIN_STATIONS_LIST.map((st, i) => (
            <div
              key={i}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                st.main
                  ? 'bg-emerald-500/25 border border-emerald-400/40 text-emerald-100'
                  : 'bg-white/5 border border-white/10 text-sand-300'
              }`}
            >
              <Train className="w-3 h-3 opacity-70" />
              <span>{st.name}</span>
              <span className="text-[10px] text-white/50">({st.km})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Frecuencias y Horarios */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sand-400 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Horarios y Frecuencias Principales
          </span>
          <span className="text-xs text-sand-400">Duración estimada: 3h 30m</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-sand-400 uppercase text-[11px] font-bold">
              <tr>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4">Salida</th>
                <th className="py-3 px-4">Llegada</th>
                <th className="py-3 px-4">Días</th>
                <th className="py-3 px-4">Modalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-sand-200">
              {TRAIN_SCHEDULES.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-emerald-300">{row.serviceId}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{row.departureTime}</span>
                    <span className="block text-[11px] text-sand-400">{row.departureStation}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{row.arrivalTime}</span>
                    <span className="block text-[11px] text-sand-400">{row.arrivalStation}</span>
                  </td>
                  <td className="py-3 px-4 text-sand-300">{row.days}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300">
                      {row.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota de Recomendación */}
      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-200">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold text-white">Consejo del Viajero: </strong>
          Se recomienda adquirir los pasajes con <strong className="text-white">3 a 5 días de anticipación</strong> a través de la web oficial de Trenes Argentinos, especialmente para los viajes de fin de semana debido a la alta concurrencia turística. El coche motor cuenta con butacas reclinables y aire acondicionado.
        </p>
      </div>
    </section>
  );
};
