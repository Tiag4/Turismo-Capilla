export interface BedroomConfigItem {
  id: string;
  roomName: string;
  doubleBeds: number;
  singleBeds: number;
  bunkBeds: number;
  sofaBeds: number;
}

export const ROOM_NAME_PRESETS = [
  'Dormitorio 1',
  'Dormitorio 2',
  'Dormitorio 3',
  'Dormitorio 4',
  'Dormitorio Principal',
  'Suite Principal',
  'Living / Estar',
  'Entrepiso / Altillo',
  'Monoambiente',
];

export const BED_FIELDS: {
  key: keyof Omit<BedroomConfigItem, 'id' | 'roomName'>;
  label: string;
}[] = [
  { key: 'doubleBeds', label: 'Matrimonial' },
  { key: 'singleBeds', label: 'Individual' },
  { key: 'bunkBeds', label: 'Cucheta' },
  { key: 'sofaBeds', label: 'Sofá cama' },
];

function extractCount(text: string, regex: RegExp): number {
  const match = text.match(regex);
  return match ? Math.min(10, Math.max(0, Number(match[1]) || 0)) : 0;
}

function defaultRoom(): BedroomConfigItem {
  return {
    id: 'room-1',
    roomName: 'Dormitorio 1',
    doubleBeds: 1,
    singleBeds: 0,
    bunkBeds: 0,
    sofaBeds: 0,
  };
}

export function parseSummaryToRooms(summary: string): BedroomConfigItem[] {
  if (!summary.trim()) return [defaultRoom()];

  const sep = summary.includes('|') ? '|' : ';';
  const parts = summary
    .split(sep)
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length === 0) return [defaultRoom()];

  return parts.map((part, idx) => {
    const colonIdx = part.indexOf(':');
    const roomName = colonIdx > 0 ? part.slice(0, colonIdx).trim() : `Dormitorio ${idx + 1}`;
    const rawBeds = (colonIdx > 0 ? part.slice(colonIdx + 1) : part).toLowerCase();

    const sofaBeds = extractCount(rawBeds, /(\d+)\s*(?:sof[aá]\s*cama|div[aá]n(?:\s*cama)?)s?/i);
    const bunkBeds = extractCount(rawBeds, /(\d+)\s*(?:cama\s*)?(?:cucheta|marinera|litera)s?/i);
    const singleBeds = extractCount(
      rawBeds,
      /(\d+)\s*(?:cama|sommier)s?\s*(?:individual(?:es)?|simple|single|1 plaza)/i
    );
    const cleanedForDouble = rawBeds.replace(/(?:sof[aá]|div[aá]n)[^+]*/gi, '');
    let doubleBeds = extractCount(
      cleanedForDouble,
      /(\d+)\s*(?:cama|sommier)s?\s*(?:matrimonial(?:es)?|doble|queen|king)/i
    );

    if (doubleBeds === 0 && /(?:matrimonial|king|queen)/i.test(cleanedForDouble)) {
      doubleBeds = 1;
    }
    if (doubleBeds + singleBeds + bunkBeds + sofaBeds === 0) {
      doubleBeds = 1;
    }

    return {
      id: `room-${idx + 1}`,
      roomName,
      doubleBeds,
      singleBeds,
      bunkBeds,
      sofaBeds,
    };
  });
}

export function formatRoomBedsText(room: BedroomConfigItem): string {
  const parts: string[] = [];
  if (room.doubleBeds > 0) {
    parts.push(`${room.doubleBeds} ${room.doubleBeds === 1 ? 'cama matrimonial sommier' : 'camas matrimoniales sommier'}`);
  }
  if (room.singleBeds > 0) {
    parts.push(`${room.singleBeds} ${room.singleBeds === 1 ? 'cama individual' : 'camas individuales'}`);
  }
  if (room.bunkBeds > 0) {
    parts.push(`${room.bunkBeds} ${room.bunkBeds === 1 ? 'cama cucheta doble' : 'camas cuchetas dobles'}`);
  }
  if (room.sofaBeds > 0) {
    parts.push(`${room.sofaBeds} ${room.sofaBeds === 1 ? 'sofá cama' : 'sofás cama'}`);
  }
  return parts.length > 0 ? parts.join(' + ') : '1 cama matrimonial sommier';
}

export function serializeRoomsToSummary(rooms: BedroomConfigItem[]): string {
  return rooms.map((r) => `${r.roomName}: ${formatRoomBedsText(r)}`).join(' | ');
}
