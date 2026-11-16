import React from 'react';
import { Phone, MapPin, Clock, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import type { PharmacyDutyRecord } from '../../types/pharmacyDuty.types';

interface ActivePharmacyHeroCardProps {
  pharmacy: PharmacyDutyRecord;
}

export const ActivePharmacyHeroCard: React.FC<ActivePharmacyHeroCardProps> = ({ pharmacy }) => {
  if (!pharmacy) return null;

  return (
    <section
      aria-label="Farmacia de Turno en Capilla del Monte"
      className="bg-white rounded-3xl border-2 border-emerald-700 p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-white font-extrabold uppercase px-3 py-1 rounded-full text-xs tracking-wider shadow-xs inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DE TURNO HOY</span>
            </span>
            <span className="text-xs text-sand-500 font-semibold">
              {pharmacy.validFrom && pharmacy.validTo
                ? `Vigente: ${pharmacy.validFrom} al ${pharmacy.validTo}`
                : 'Turno Sanitario Oficial'}
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-3xl text-sand-900 tracking-tight">
            {pharmacy.name}
          </h2>

          <p className="text-xs sm:text-sm text-sand-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sand-400 shrink-0" />
            <span>{pharmacy.address}</span>
          </p>
        </div>

        <div className="bg-sand-50 border border-sand-200 px-4 py-2.5 rounded-2xl shrink-0 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-sand-500 tracking-wider block">
            Modalidad de Guardia
          </span>
          <span className="text-sm font-black text-emerald-800 font-display flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>{pharmacy.dutyHours}</span>
          </span>
        </div>
      </div>

      {pharmacy.notes && (
        <div className="p-3.5 rounded-2xl bg-sand-50 border border-sand-200 text-xs text-sand-700 leading-relaxed">
          <span className="font-bold text-sand-900">Aviso para guardia nocturna: </span>
          <span>{pharmacy.notes}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
        <a
          href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
          className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-xs cursor-pointer flex-1 text-center"
        >
          <Phone className="w-4 h-4" />
          <span>Llamar a Farmacia ({pharmacy.phone})</span>
        </a>

        {pharmacy.whatsapp && (
          <a
            href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}?text=Hola,%20consulta%20por%20guardia%20farmacia%20de%20turno`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-sand-100 hover:bg-sand-200 text-sand-800 font-bold text-sm transition-colors border border-sand-300 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-700" />
            <span>WhatsApp</span>
          </a>
        )}

        {pharmacy.googleMapsUrl && (
          <a
            href={pharmacy.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-xl text-xs font-bold text-sand-600 hover:text-sand-900 hover:bg-sand-100 transition-colors cursor-pointer"
          >
            <span>Cómo llegar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </section>
  );
};
