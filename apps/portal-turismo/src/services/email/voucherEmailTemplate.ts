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

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(date.getTime())) {
      const monthNames = [
        'enero',
        'febrero',
        'marzo',
        'abril',
        'mayo',
        'junio',
        'julio',
        'agosto',
        'septiembre',
        'octubre',
        'noviembre',
        'diciembre',
      ];
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return `${dayNames[date.getDay()]} ${Number(day)} de ${monthNames[date.getMonth()]} de ${year}`;
    }
  }
  return dateStr;
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
  const isHost = Boolean(params.forHost);
  const portalUrl = (params.portalBaseUrl || 'https://turismo.capilladelmonte.gov.ar').replace(/\/+$/, '');
  const voucherUrl = `${portalUrl}/reservas/consulta?code=${encodeURIComponent(params.code)}&email=${encodeURIComponent(params.email)}`;

  const downPaymentPercent = params.downPaymentPercentage ?? 50;
  const downPayment = params.downPaymentAmount ?? Math.round(params.finalPrice * (downPaymentPercent / 100));
  const remaining = params.remainingBalance ?? Math.max(0, params.finalPrice - downPayment);

  const statusLabel =
    params.status === 'CONFIRMED'
      ? 'Reserva Confirmada'
      : params.status === 'COMPLETED'
        ? 'Estadía Completada'
        : params.status === 'CANCELLED'
          ? 'Reserva Cancelada'
          : 'Pendiente de Confirmación';

  const statusColor =
    params.status === 'CONFIRMED'
      ? '#1C8B68'
      : params.status === 'COMPLETED'
        ? '#0D2F22'
        : params.status === 'CANCELLED'
          ? '#B91C1C'
          : '#C95627';

  const totalGuests = (params.adults || 1) + (params.children || 0);
  const guestsDescription = `${totalGuests} ${totalGuests === 1 ? 'huésped' : 'huéspedes'}${
    params.children > 0 ? ` (${params.adults} adultos, ${params.children} menores)` : ''
  }`;

  const headerTitle = isHost
    ? params.status === 'CONFIRMED'
      ? 'Reserva Confirmada por el Huésped'
      : 'Nueva Solicitud de Reserva'
    : params.status === 'CONFIRMED'
      ? '¡Tu Reserva está Confirmada!'
      : 'Comprobante de Reserva Oficial';

  const headerSubtitle = isHost
    ? `Solicitud para ${escapeHtml(params.accommodationTitle)}`
    : `Portal Oficial de Turismo · Capilla del Monte, Córdoba`;

  const safeAccTitle = escapeHtml(params.accommodationTitle);
  const safeFullName = escapeHtml(`${params.firstName} ${params.lastName}`.trim());
  const safeAddress = escapeHtml(params.accommodationAddress);
  const safeZone = escapeHtml(params.accommodationZone || 'Capilla del Monte');
  const safeHostPhone = escapeHtml(params.hostPhone || '+54 9 3548 40-1122');
  const cleanPhone = safeHostPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hola! Me comunico respecto a mi reserva oficial ${params.code} en ${params.accommodationTitle}.`,
  )}`;

  const hasCoordinates =
    typeof params.accommodationLatitude === 'number' &&
    typeof params.accommodationLongitude === 'number';
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${params.accommodationLatitude},${params.accommodationLongitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${params.accommodationAddress}, Capilla del Monte, Córdoba`)}`;

  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>${escapeHtml(headerTitle)} — ${escapeHtml(params.code)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    body { margin: 0; padding: 0; width: 100% !important; min-width: 100%; background-color: #F4F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #22201E; }
    a { color: #E06D39; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-p-4 { padding: 20px 16px !important; }
      .stack-column { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .mobile-text-center { text-align: center !important; }
      .mobile-mb-3 { margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F4F0E8;">
  <!-- Preheader text (inbox preview) -->
  <div style="display:none;font-size:1px;color:#F4F0E8;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${isHost ? `Nueva reserva ${params.code} registrada para ${safeAccTitle}. Huésped: ${safeFullName}.` : `Tu voucher oficial de reserva ${params.code} en ${safeAccTitle} está disponible. Presentá este comprobante al ingresar.`}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F4F0E8;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <!-- Email Card (Max 600px) -->
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:18px;overflow:hidden;border:1px solid #DED8CB;box-shadow:0 4px 16px rgba(0,0,0,0.04);">
          
          <!-- Top Institutional Header -->
          <tr>
            <td style="background-color:#0D2F22;padding:22px 28px;border-bottom:3px solid #E06D39;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <span style="display:block;color:#749B3F;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:4px;">
                      CÁMARA DE TURISMO DE CAPILLA DEL MONTE
                    </span>
                    <span style="display:block;color:#FFFFFF;font-size:20px;font-weight:800;letter-spacing:-0.2px;line-height:1.2;">
                      ${headerTitle}
                    </span>
                    <span style="display:block;color:#D6E7C0;font-size:12px;margin-top:4px;">
                      ${headerSubtitle}
                    </span>
                  </td>
                  <td valign="middle" align="right" width="64" style="width:64px;">
                    <div style="background-color:#1C8B68;width:48px;height:48px;border-radius:12px;text-align:center;line-height:48px;color:#FFFFFF;font-size:22px;font-weight:800;">
                      🏔️
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="mobile-p-4" style="padding:32px 28px 24px 28px;">

              <!-- Voucher Locator Banner -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FAF8F5;border:1px solid #E6E2D8;border-radius:14px;margin-bottom:26px;">
                <tr>
                  <td style="padding:18px 20px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tr>
                        <td valign="middle">
                          <span style="display:block;color:#6B665C;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">
                            LOCALIZADOR OFICIAL
                          </span>
                          <span style="display:block;color:#E06D39;font-size:26px;font-weight:800;letter-spacing:1.5px;font-family:Courier, monospace;line-height:1.2;margin-top:4px;">
                            ${escapeHtml(params.code)}
                          </span>
                          <span style="display:block;color:#8C877A;font-size:11px;margin-top:4px;">
                            ${isHost ? `Huésped: <strong>${safeFullName}</strong>` : `Titular: <strong>${safeFullName}</strong>`}
                          </span>
                        </td>
                        <td valign="middle" align="right">
                          <div style="display:inline-block;background-color:${statusColor};color:#FFFFFF;font-size:11px;font-weight:700;letter-spacing:0.5px;padding:6px 14px;border-radius:8px;text-transform:uppercase;white-space:nowrap;">
                            ${statusLabel}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Greeting & Context -->
              <p style="margin:0 0 20px 0;font-size:15px;line-height:1.6;color:#22201E;">
                ${isHost
                  ? `Hola, anfitrión de <strong>${safeAccTitle}</strong>. Se ha registrado una solicitud de reserva formal a través del portal turístico oficial. A continuación tenés el desglose del huésped y los montos a liquidar.`
                  : `Hola, <strong>${safeFullName}</strong>. Tu reserva en <strong>${safeAccTitle}</strong> al pie del Cerro Uritorco está registrada en el padrón de alojamientos oficiales de Capilla del Monte.`}
              </p>

              <!-- Accommodation Info Strip -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #E6E2D8;border-radius:12px;margin-bottom:24px;overflow:hidden;">
                <tr>
                  <td style="background-color:#FAF8F5;padding:12px 18px;border-bottom:1px solid #E6E2D8;">
                    <span style="color:#6B665C;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      ESTABLECIMIENTO SELECCIONADO
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <strong style="display:block;font-size:16px;color:#22201E;margin-bottom:4px;">
                      ${safeAccTitle}
                    </strong>
                    <span style="display:block;font-size:13px;color:#6B665C;line-height:1.5;">
                      📍 ${safeAddress} · ${safeZone}
                    </span>
                    <div style="margin-top:10px;">
                      <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;color:#E06D39;font-size:12px;font-weight:700;text-decoration:underline;">
                        Ver ubicación en Google Maps &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Dates & Stay Details -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td class="stack-column" width="50%" valign="top" style="padding-right:8px;padding-bottom:12px;">
                    <div style="background-color:#FAF8F5;border:1px solid #E6E2D8;border-radius:12px;padding:14px 16px;">
                      <span style="display:block;color:#8C877A;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                        CHECK-IN (INGRESO)
                      </span>
                      <strong style="display:block;font-size:14px;color:#22201E;margin-top:4px;">
                        ${formatShortDate(params.checkIn)}
                      </strong>
                      <span style="display:block;color:#6B665C;font-size:11px;margin-top:2px;">
                        A partir de las 14:00 hs
                      </span>
                      <span style="display:block;color:#8C877A;font-size:11px;margin-top:4px;font-style:italic;">
                        ${formatDateDisplay(params.checkIn)}
                      </span>
                    </div>
                  </td>
                  <td class="stack-column" width="50%" valign="top" style="padding-left:8px;padding-bottom:12px;">
                    <div style="background-color:#FAF8F5;border:1px solid #E6E2D8;border-radius:12px;padding:14px 16px;">
                      <span style="display:block;color:#8C877A;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                        CHECK-OUT (EGRESO)
                      </span>
                      <strong style="display:block;font-size:14px;color:#22201E;margin-top:4px;">
                        ${formatShortDate(params.checkOut)}
                      </strong>
                      <span style="display:block;color:#6B665C;font-size:11px;margin-top:2px;">
                        Hasta las 10:00 hs
                      </span>
                      <span style="display:block;color:#8C877A;font-size:11px;margin-top:4px;font-style:italic;">
                        ${formatDateDisplay(params.checkOut)}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Capacity & Occupancy summary -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #E6E2D8;border-bottom:1px solid #E6E2D8;padding:12px 0;margin-bottom:24px;font-size:13px;">
                <tr>
                  <td style="padding:6px 0;color:#6B665C;">Duración de la estadía:</td>
                  <td align="right" style="padding:6px 0;font-weight:700;color:#22201E;">
                    ${params.nightsCount} ${params.nightsCount === 1 ? 'noche' : 'noches'}
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6B665C;">Ocupación declarada:</td>
                  <td align="right" style="padding:6px 0;font-weight:700;color:#22201E;">
                    ${guestsDescription}
                  </td>
                </tr>
                ${
                  params.rooms && params.rooms > 1
                    ? `<tr>
                  <td style="padding:6px 0;color:#6B665C;">Unidades reservadas:</td>
                  <td align="right" style="padding:6px 0;font-weight:700;color:#22201E;">
                    ${params.rooms} unidades
                  </td>
                </tr>`
                    : ''
                }
              </table>

              <!-- Cost Settlement / Financial Table -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FAF8F5;border:1px solid #E6E2D8;border-radius:12px;margin-bottom:24px;overflow:hidden;">
                <tr>
                  <td colspan="2" style="background-color:#F4F0E8;padding:12px 18px;border-bottom:1px solid #E6E2D8;">
                    <span style="color:#6B665C;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      LIQUIDACIÓN DE LA ESTADÍA
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 18px 6px 18px;color:#6B665C;font-size:13px;">Valor total de la estadía:</td>
                  <td align="right" style="padding:12px 18px 6px 18px;font-size:15px;font-weight:800;color:#22201E;">
                    ${formatCurrency(params.finalPrice)} ARS
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 18px;color:#C95627;font-size:13px;font-weight:700;">
                    Seña requerida (${downPaymentPercent}%):
                  </td>
                  <td align="right" style="padding:6px 18px;font-size:16px;font-weight:800;color:#C95627;">
                    ${formatCurrency(downPayment)} ARS
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 18px 14px 18px;color:#6B665C;font-size:13px;border-top:1px dashed #DED8CB;">
                    Saldo restante a abonar en el check-in:
                  </td>
                  <td align="right" style="padding:6px 18px 14px 18px;font-size:14px;font-weight:700;color:#22201E;border-top:1px dashed #DED8CB;">
                    ${formatCurrency(remaining)} ARS
                  </td>
                </tr>
              </table>

              <!-- Bank Deposit Info -->
              ${
                params.bankCbu || params.bankAlias
                  ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#FFFFFF;border:1px solid #E6E2D8;border-radius:12px;margin-bottom:24px;overflow:hidden;">
                <tr>
                  <td style="background-color:#FAF8F5;padding:12px 18px;border-bottom:1px solid #E6E2D8;">
                    <span style="color:#6B665C;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
                      DATOS BANCARIOS PARA TRANSFERENCIA DE LA SEÑA
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;font-size:13px;line-height:1.6;">
                    ${params.bankAccountHolder ? `<div><span style="color:#8C877A;">Titular:</span> <strong>${escapeHtml(params.bankAccountHolder)}</strong></div>` : ''}
                    ${params.bankName ? `<div><span style="color:#8C877A;">Entidad Bancaria:</span> <strong>${escapeHtml(params.bankName)}</strong></div>` : ''}
                    ${params.bankCbu ? `<div style="margin-top:6px;"><span style="color:#8C877A;">CBU / CVU:</span> <code style="font-family:Courier, monospace;background-color:#FAF8F5;padding:2px 6px;border-radius:4px;border:1px solid #E6E2D8;font-size:12px;color:#1A1A1A;font-weight:700;">${escapeHtml(params.bankCbu)}</code></div>` : ''}
                    ${params.bankAlias ? `<div style="margin-top:4px;"><span style="color:#8C877A;">Alias:</span> <code style="font-family:Courier, monospace;background-color:#FAF8F5;padding:2px 6px;border-radius:4px;border:1px solid #E6E2D8;font-size:12px;color:#C95627;font-weight:700;">${escapeHtml(params.bankAlias)}</code></div>` : ''}
                    <p style="margin:10px 0 0 0;font-size:11px;color:#8C877A;font-style:italic;">
                      Una vez realizada la transferencia, enviá el comprobante al anfitrión por WhatsApp para registrar el pago.
                    </p>
                  </td>
                </tr>
              </table>`
                  : ''
              }

              <!-- Direct Contact Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #E6E2D8;border-radius:12px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 18px;">
                    <span style="display:block;color:#6B665C;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;">
                      ${isHost ? 'DATOS DE CONTACTO DEL HUÉSPED' : 'CONTACTO DIRECTO CON EL ANFITRIÓN'}
                    </span>
                    <strong style="display:block;font-size:15px;color:#22201E;">
                      ${isHost ? safeFullName : escapeHtml(params.hostName || safeAccTitle)}
                    </strong>
                    <span style="display:block;font-size:13px;color:#6B665C;margin-top:2px;">
                      📞 Teléfono / WhatsApp: <a href="tel:${isHost ? params.phone : safeHostPhone}" style="color:#22201E;font-weight:700;">${isHost ? escapeHtml(params.phone) : safeHostPhone}</a>
                    </span>
                    <span style="display:block;font-size:13px;color:#6B665C;margin-top:2px;">
                      ✉️ Correo electrónico: <a href="mailto:${isHost ? params.email : escapeHtml(params.hostEmail || '')}" style="color:#E06D39;">${isHost ? escapeHtml(params.email) : escapeHtml(params.hostEmail || 'contacto@alojamiento.com')}</a>
                    </span>
                    <div style="margin-top:12px;">
                      <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#1C8B68;color:#FFFFFF;font-size:13px;font-weight:700;padding:8px 16px;border-radius:8px;text-decoration:none;">
                        Abrir chat de WhatsApp &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Main CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${voucherUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#E06D39;color:#FFFFFF;font-size:15px;font-weight:800;letter-spacing:0.5px;padding:14px 28px;border-radius:10px;text-decoration:none;box-shadow:0 3px 10px rgba(224,109,57,0.25);">
                      Consultar y Descargar Voucher Oficial
                    </a>
                    <span style="display:block;color:#8C877A;font-size:11px;margin-top:8px;">
                      Podés ver el estado actualizado o imprimir tu comprobante cuando quieras.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Important Tourist Notice -->
              <div style="background-color:#FAF8F5;border-left:3px solid #749B3F;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:12px;font-size:12px;color:#6B665C;line-height:1.5;">
                <strong>Recomendación para tu llegada:</strong> Coordiná tu horario estimado de arribo con anticipación. En caso de consultas sanitarias, farmacias de turno o senderos habilitados, consultá en el portal oficial de turismo.
              </div>

            </td>
          </tr>

          <!-- Official Institutional Footer -->
          <tr>
            <td style="background-color:#0D2F22;padding:24px 28px;color:#D6E7C0;font-size:11px;line-height:1.6;border-top:1px solid #1C8B68;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <strong style="color:#FFFFFF;font-size:12px;display:block;margin-bottom:4px;">
                      Cámara de Turismo de Capilla del Monte
                    </strong>
                    <span>Córdoba, Argentina · Portal Oficial de Promoción y Reservas</span><br>
                    <span style="color:#A4C28D;font-size:10px;display:block;margin-top:6px;">
                      Desarrollado en articulación académica por la Universidad Provincial de Córdoba (Sede Capilla del Monte).
                    </span>
                    <span style="color:#749B3F;font-size:10px;display:block;margin-top:8px;">
                      Este es un mensaje institucional automático. Para consultas o asistencia, comunicate directamente con el prestador o la oficina de turismo local.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
