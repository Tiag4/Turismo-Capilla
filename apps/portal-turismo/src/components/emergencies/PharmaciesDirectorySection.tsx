import React from 'react';
import { Building2, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import type { PharmacyDutyRecord } from '../../types/pharmacyDuty.types';

interface PharmaciesDirectorySectionProps {
  pharmacies: PharmacyDutyRecord[];
}

export const PharmaciesDirectorySection: React.FC<PharmaciesDirectorySectionProps> = ({ pharmacies }) => {
  if (!pharmacies || pharmacies.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-sand-900 font-display flex items-center gap-2">
          <Building2 className="w-5 h-5 text-terracotta-600" />
          <span>Otras Farmacias en el Ejido Urbano</span>
        </h2>
        <span className="text-xs text-sand-500 font-medium">Horarios comerciales habituales</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className="bg-white p-5 rounded-2xl border border-sand-200 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-base text-sand-900 leading-tight">
                {pharmacy.name}
              </h3>
              <p className="text-xs text-sand-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>{pharmacy.address}</span>
              </p>
              <p className="text-xs text-sand-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sand-400 shrink-0" />
                <span>{pharmacy.dutyHours}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-sand-100 flex items-center justify-between gap-2">
              <a
                href={`tel:${pharmacy.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-terracotta-600 hover:text-terracotta-700 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{pharmacy.phone}</span>
              </a>

              {pharmacy.whatsapp && (
                <a
                  href={`https://wa.me/${pharmacy.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                  aria-label={`WhatsApp ${pharmacy.name}`}
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
