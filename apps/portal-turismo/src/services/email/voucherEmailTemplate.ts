export interface BookingVoucherEmailParams {
  code: string;
  accommodationTitle: string;
  accommodationZone?: string;
  accommodationAddress: string;
  accommodationLatitude?: number | null;
  accommodationLongitude?: number | null;
  accommodationImage?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nightsCount: number;
  adults: number;
  children: number;
  rooms?: number;
  finalPrice: number;
  downPaymentPercentage?: number;
  downPaymentAmount?: number;
  remainingBalance?: number;
  bankAccountHolder?: string;
  bankCbu?: string;
  bankAlias?: string;
  bankName?: string;
  status: 'PENDING' | 'PENDING_CONFIRMATION' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  hostName?: string;
  hostPhone?: string;
  hostEmail?: string;
  portalBaseUrl?: string;
  forHost?: boolean;
}

function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

export function generateBookingVoucherEmailHtml(params: BookingVoucherEmailParams): string {
  const portalUrl = (params.portalBaseUrl || 'https://turismo.capilladelmonte.gov.ar').replace(/\/+$/, '');
  const voucherUrl = `${portalUrl}/reservas/consulta?code=${encodeURIComponent(params.code)}&email=${encodeURIComponent(params.email)}`;

  const downPaymentPercent = params.downPaymentPercentage ?? 50;
  const downPayment = params.downPaymentAmount ?? Math.round(params.finalPrice * (downPaymentPercent / 100));
  const remaining = params.remainingBalance ?? Math.max(0, params.finalPrice - downPayment);

  const statusLabel =
    params.status === 'CONFIRMED'
      ? 'Confirmada'
      : params.status === 'COMPLETED'
        ? 'Completada'
        : params.status === 'CANCELLED'
          ? 'Cancelada'
          : 'Pendiente';

  const statusBadgeBg =
    params.status === 'CONFIRMED'
      ? '#E8F5E9'
      : params.status === 'CANCELLED'
        ? '#FFEBEE'
        : '#FFF3E0';

  const statusTextColor =
    params.status === 'CONFIRMED'
      ? '#2E7D32'
      : params.status === 'CANCELLED'
        ? '#C62828'
        : '#C95627';

  const totalGuests = (params.adults || 1) + (params.children || 0);
  const guestsDescription = `${totalGuests} ${totalGuests === 1 ? 'huésped' : 'huéspedes'}${
    params.children > 0 ? ` (${params.adults} adultos, ${params.children} menores)` : ''
  }`;

  const safeAccTitle = escapeHtml(params.accommodationTitle);
  const safeFullName = escapeHtml(`${params.firstName} ${params.lastName}`.trim());
  const safeAddress = escapeHtml(params.accommodationAddress);
  const safeZone = escapeHtml(params.accommodationZone || 'Capilla del Monte');
  const safeHostPhone = escapeHtml(params.hostPhone || '+54 9 3548 40-1122');
  const safeHostName = escapeHtml(params.hostName || 'Administración');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprobante Oficial ${escapeHtml(params.code)}</title>
  <style>
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    body { margin: 0; padding: 0; width: 100% !important; background-color: #F8F6F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #22201E; }
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .content-padding { padding: 24px 20px !important; }
      .mobile-stack { display: block !important; width: 100% !important; }
      .mobile-pt { padding-top: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F8F6F2;">
  <div style="display:none;font-size:1px;color:#F8F6F2;line-height:1px;max-height:0;overflow:hidden;">
    Comprobante oficial de reserva ${params.code} — ${safeAccTitle}.
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8F6F2;">
    <tr>
      <td align="center" style="padding: 32px 12px;">
        <table role="presentation" class="container" width="580" cellspacing="0" cellpadding="0" border="0" style="width:580px;max-width:580px;background-color:#FFFFFF;border:1px solid #E5DFD5;border-radius:12px;overflow:hidden;">
          
          <!-- Header Institucional Sobrio -->
          <tr>
            <td style="padding: 24px 28px 20px 28px; border-bottom: 1px solid #ECE8DF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="font-size: 11px; font-weight: 700; letter-spacing: 1px; color: #749B3F; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      Cámara de Turismo de Capilla del Monte
                    </span>
                    <h1 style="margin: 0; font-size: 19px; font-weight: 800; color: #22201E; line-height: 1.2;">
                      Comprobante de Reserva Oficial
                    </h1>
                  </td>
                  <td valign="middle" align="right">
                    <div style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background-color: ${statusBadgeBg}; color: ${statusTextColor};">
                      ${statusLabel}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Cuerpo Principal -->
          <tr>
            <td class="content-padding" style="padding: 28px 28px 20px 28px;">

              <!-- Localizador Oficial -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #ECE8DF;">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 600; color: #8C877A; text-transform: uppercase; letter-spacing: 1px; display: block;">
                      Localizador de Trámite
                    </span>
                    <span style="font-family: Courier, monospace, sans-serif; font-size: 22px; font-weight: 800; color: #C95627; letter-spacing: 1px; display: block; margin-top: 3px;">
                      ${escapeHtml(params.code)}
                    </span>
                  </td>
                  <td align="right" valign="bottom">
                    <span style="font-size: 12px; color: #6B665C;">
                      Titular: <strong style="color: #22201E;">${safeFullName}</strong>
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Detalle de Estadía y Alojamiento -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <span style="font-size: 11px; font-weight: 700; color: #8C877A; text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 4px;">
                      Establecimiento
                    </span>
                    <span style="font-size: 16px; font-weight: 800; color: #22201E; display: block;">
                      ${safeAccTitle}
                    </span>
                    <span style="font-size: 13px; color: #6B665C; display: block; margin-top: 2px;">
                      ${safeAddress} · ${safeZone}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Tabla de Fechas y Capacidad -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; border: 1px solid #ECE8DF; border-radius: 8px; overflow: hidden;">
                <tr style="background-color: #FAF8F5;">
                  <td class="mobile-stack" width="50%" style="padding: 12px 16px; border-right: 1px solid #ECE8DF;">
                    <span style="font-size: 10px; font-weight: 700; color: #8C877A; text-transform: uppercase; letter-spacing: 0.5px; display: block;">
                      Ingreso (Check-in)
                    </span>
                    <span style="font-size: 14px; font-weight: 700; color: #22201E; display: block; margin-top: 2px;">
                      ${formatShortDate(params.checkIn)}
                    </span>
                    <span style="font-size: 11px; color: #6B665C; display: block;">
                      A partir de las 14:00 hs
                    </span>
                  </td>
                  <td class="mobile-stack mobile-pt" width="50%" style="padding: 12px 16px;">
                    <span style="font-size: 10px; font-weight: 700; color: #8C877A; text-transform: uppercase; letter-spacing: 0.5px; display: block;">
                      Egreso (Check-out)
                    </span>
                    <span style="font-size: 14px; font-weight: 700; color: #22201E; display: block; margin-top: 2px;">
                      ${formatShortDate(params.checkOut)}
                    </span>
                    <span style="font-size: 11px; color: #6B665C; display: block;">
                      Hasta las 10:00 hs
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 10px 16px; border-top: 1px solid #ECE8DF; font-size: 12px; color: #6B665C;">
                    Duración: <strong style="color: #22201E;">${params.nightsCount} ${params.nightsCount === 1 ? 'noche' : 'noches'}</strong> · Pasajeros: <strong style="color: #22201E;">${guestsDescription}</strong>
                  </td>
                </tr>
              </table>

              <!-- Liquidación de Tarifas -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 24px; font-size: 13px;">
                <tr>
                  <td style="padding: 6px 0; color: #6B665C;">
                    Total de la estadía pactada:
                  </td>
                  <td align="right" style="padding: 6px 0; font-weight: 800; color: #22201E; font-size: 15px;">
                    ${formatCurrency(params.finalPrice)} ARS
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #C95627; font-weight: 600;">
                    Seña bancaria requerida (${downPaymentPercent}%):
                  </td>
                  <td align="right" style="padding: 6px 0; font-weight: 800; color: #C95627; font-size: 15px;">
                    ${formatCurrency(downPayment)} ARS
                  </td>
                </tr>
                <tr>
                  <td style="padding: 6px 0 10px 0; color: #6B665C; border-bottom: 1px solid #ECE8DF;">
                    Saldo a abonar en el check-in:
                  </td>
                  <td align="right" style="padding: 6px 0 10px 0; font-weight: 700; color: #22201E; border-bottom: 1px solid #ECE8DF;">
                    ${formatCurrency(remaining)} ARS
                  </td>
                </tr>
              </table>

              <!-- Datos Bancarios -->
              ${
                params.bankCbu || params.bankAlias
                  ? `<div style="margin-bottom: 24px; font-size: 12px; line-height: 1.6; color: #4F4B43;">
                <span style="font-size: 11px; font-weight: 700; color: #8C877A; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">
                  Datos de Transferencia Bancaria
                </span>
                ${params.bankAccountHolder ? `<div>Titular: <strong>${escapeHtml(params.bankAccountHolder)}</strong></div>` : ''}
                ${params.bankName ? `<div>Entidad: <strong>${escapeHtml(params.bankName)}</strong></div>` : ''}
                ${params.bankCbu ? `<div>CBU/CVU: <code style="font-family: monospace; font-size: 12px; color: #22201E; font-weight: 700;">${escapeHtml(params.bankCbu)}</code></div>` : ''}
                ${params.bankAlias ? `<div>Alias: <code style="font-family: monospace; font-size: 12px; color: #C95627; font-weight: 700;">${escapeHtml(params.bankAlias)}</code></div>` : ''}
              </div>`
                  : ''
              }

              <!-- Contacto Directo -->
              <div style="margin-bottom: 28px; font-size: 12px; color: #6B665C; line-height: 1.5; border-top: 1px solid #ECE8DF; pt-3; padding-top: 16px;">
                <span style="font-size: 11px; font-weight: 700; color: #8C877A; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">
                  Contacto con el Prestador
                </span>
                <div>${safeHostName} · Teléfono: <a href="tel:${safeHostPhone}" style="color: #22201E; font-weight: 600; text-decoration: none;">${safeHostPhone}</a></div>
                ${params.hostEmail ? `<div>Correo: <a href="mailto:${escapeHtml(params.hostEmail)}" style="color: #6B665C;">${escapeHtml(params.hostEmail)}</a></div>` : ''}
              </div>

              <!-- CTA Sobrio y Directo -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a href="${voucherUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #22201E; color: #FFFFFF; font-size: 13px; font-weight: 700; padding: 12px 24px; border-radius: 6px; text-decoration: none; letter-spacing: 0.3px;">
                      Ver comprobante oficial en línea &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Institucional Limpio -->
          <tr>
            <td style="background-color: #FAF8F5; padding: 20px 28px; border-top: 1px solid #ECE8DF; font-size: 11px; color: #8C877A; line-height: 1.5;">
              <strong style="color: #4F4B43; display: block;">Cámara de Turismo de Capilla del Monte</strong>
              <span>Secretaría de Turismo y Cultura · Municipalidad de Capilla del Monte, Córdoba.</span><br>
              <span style="font-size: 10px; color: #A8A296; display: block; margin-top: 4px;">
                Desarrollado en articulación con la Universidad Provincial de Córdoba (Sede Capilla del Monte).
              </span>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
