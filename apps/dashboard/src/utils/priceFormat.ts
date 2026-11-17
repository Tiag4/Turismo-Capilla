/**
 * Utilidades para formateo y manipulación de tarifas y precios en la Guía de Movilidad.
 */

/**
 * Extrae la parte numérica/textual del precio para edición en el input,
 * removiendo el '$' inicial y el sufijo 'ARS'.
 */
export function extractPriceRaw(val: string | undefined | null): string {
  if (!val) return '';
  return val
    .replace(/^\s*\$\s*/, '')
    .replace(/\s*ARS\b/gi, '')
    .trim();
}

/**
 * Compone el formato final con '$' fijo al inicio y opcionalmente 'ARS' al final.
 */
export function formatPriceWithCurrency(raw: string | undefined | null, showArs: boolean = true): string {
  if (!raw || !raw.trim()) return '';
  const clean = extractPriceRaw(raw);
  if (!clean) return '';

  // Si tiene sufijo especial como "c/u", ej: "1.100 - $1.400 c/u"
  const hasCu = /c\/u/i.test(clean);
  const coreClean = hasCu ? clean.replace(/\s*c\/u/i, '').trim() : clean;

  // Si tiene un rango de valores con guión, ej: "250 - 400" o "250 - $400"
  if (coreClean.includes('-')) {
    const parts = coreClean.split('-').map((p) => p.trim().replace(/^\$/, '').trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      const baseRange = `$${parts[0]} - $${parts[1]}`;
      const withCurrency = showArs ? `${baseRange} ARS` : baseRange;
      return hasCu ? `${withCurrency} c/u` : withCurrency;
    }
  }

  const base = `$${coreClean}`;
  const withCurrency = showArs ? `${base} ARS` : base;
  return hasCu ? `${withCurrency} c/u` : withCurrency;
}
