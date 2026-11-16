import { useState, useEffect } from 'react';
import type { PharmacyDutyRecord, CreateOrUpdatePharmacyDto } from '../../types/pharmacyDuty.types';

export function usePharmacyForm(
  pharmacy: PharmacyDutyRecord | null,
  isOpen: boolean,
  onSave: (dto: CreateOrUpdatePharmacyDto) => Promise<void>
) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [dutyHours, setDutyHours] = useState('Guardia 24 Horas');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [isOnDutyToday, setIsOnDutyToday] = useState(false);
  const [notes, setNotes] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');

  useEffect(() => {
    if (pharmacy) {
      setName(pharmacy.name);
      setAddress(pharmacy.address);
      setPhone(pharmacy.phone);
      setWhatsapp(pharmacy.whatsapp ?? '');
      setDutyHours(pharmacy.dutyHours);
      setValidFrom(pharmacy.validFrom ?? '');
      setValidTo(pharmacy.validTo ?? '');
      setIsOnDutyToday(pharmacy.isOnDutyToday);
      setNotes(pharmacy.notes ?? '');
      setGoogleMapsUrl(pharmacy.googleMapsUrl ?? '');
    } else {
      setName('');
      setAddress('');
      setPhone('');
      setWhatsapp('');
      setDutyHours('Guardia 24 Horas');
      setValidFrom(new Date().toISOString().split('T')[0]);
      setValidTo(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setIsOnDutyToday(false);
      setNotes('');
      setGoogleMapsUrl('');
    }
  }, [pharmacy, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...(pharmacy?.id ? { id: pharmacy.id } : {}),
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || undefined,
      dutyHours: dutyHours.trim(),
      validFrom: validFrom || undefined,
      validTo: validTo || undefined,
      isOnDutyToday,
      notes: notes.trim() || undefined,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
    });
  };

  return {
    name,
    setName,
    address,
    setAddress,
    phone,
    setPhone,
    whatsapp,
    setWhatsapp,
    dutyHours,
    setDutyHours,
    validFrom,
    setValidFrom,
    validTo,
    setValidTo,
    isOnDutyToday,
    setIsOnDutyToday,
    notes,
    setNotes,
    googleMapsUrl,
    setGoogleMapsUrl,
    handleSubmit,
  };
}
