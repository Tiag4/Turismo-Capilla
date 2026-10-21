# [DOCS] Manual de Usuario Integral del Ecosistema Turismo Capilla del Monte

## 1. Descripción y Objetivo
Desarrollar el **Manual de Usuario Oficial** para la plataforma web turística y motor de reservas de **Capilla del Monte**. El documento servirá como guía operativa y formativa tanto para los turistas que visitan la villa serrana, como para los prestadores de alojamiento habilitados y los miembros de la Comisión Municipal de Turismo.

El manual debe estructurarse con lenguaje claro, capturas de pantalla de la interfaz actualizada (sin vicios de vibecoded ni elementos desactualizados) y flujos paso a paso para cada uno de los roles del sistema.

---

## 2. Alcance y Estructura por Roles

### A. Módulo I: Guía del Turista (Portal Público)
1. **Exploración del Destino:**
   - Descubrimiento de atractivos naturales (Cerro Uritorco, Los Terrones, El Zapato, etc.).
   - Fichas técnicas de trekking con perfiles de elevación, dificultad y equipamiento recomendado.
   - Circuitos de astroturismo y turismo espiritual.
2. **Búsqueda y Selección de Alojamientos:**
   - Uso del buscador del Hero y filtros por tipo de establecimiento, capacidad y servicios.
   - Lectura de fichas de detalle, galería fotográfica y ubicación geográfica.
3. **Flujo de Reserva y Consulta:**
   - Asistente de reserva paso a paso (Wizard): selección de fechas, datos de contacto y huéspedes.
   - Generación del código único oficial de reserva (`CAP-YYYY-XXXX`).
   - Módulo de consulta de estado de reserva y generación de voucher digital imprimible.

---

### B. Módulo II: Guía del Prestador / Cabañero (Panel de Gestión)
1. **Ingreso y Activación de Cuenta:**
   - Registro seguro mediante Token de Invitación oficial provisto por la Comisión.
   - Inicio de sesión y recuperación de credenciales.
2. **Administración de Establecimientos:**
   - Creación y edición de fichas de cabañas/hoteles.
   - Carga y ordenamiento interactivo de fotografías (portada, galería, requisitos de resolución).
   - Definición de comodidades, capacidad y reglas de convivencia.
3. **Gestión Tarifaria y Temporadas:**
   - Configuración de precio base por noche.
   - Sincronización y aprovechamiento de multiplicadores según las Temporadas Oficiales (Alta, Media, Feriados).
4. **Ciclo de Vida de las Reservas:**
   - Recepción de solicitudes entrantes.
   - Confirmación y rechazo con justificación (impacto en calendario y liberación de fechas).
   - Coordinación directa con el turista vía WhatsApp y registro de Check-in / Check-out.
   - Visualización y manejo del calendario interactivo de disponibilidad.

---

### C. Módulo III: Guía del Administrador / Comisión Municipal de Turismo (Panel Institucional)
1. **Centro de Control Municipal:**
   - Monitoreo en tiempo real de métricas e indicadores de ocupación de la villa.
2. **Gestión de Prestadores y Tokens:**
   - Generación de tokens de invitación unívocos vinculados a prestadores formalmente habilitados.
   - Control de invitaciones emitidas, canjeadas o revocadas con motivo formal.
3. **Studio CMS / Personalizador del Portal:**
   - Reordenamiento visual de secciones del Home mediante drag-and-drop.
   - Configuración de bloques destacados (Hero, Call to Action final, Atractivos principales).
   - Reglas de visibilidad condicional en tiempo real.
4. **Agenda Cultural y Eventos Municipales:**
   - Creación y publicación de eventos con flyer oficial (validación JPG/PNG/WebP hasta 5MB).
   - Parámetros de fechas, horarios, ubicación y costo de entrada.
   - Comportamiento de auto-ocultamiento automático de la sección en caso de 0 eventos programados.
5. **Temporadas Oficiales:**
   - Parametrización del calendario municipal (Temporadas Altas, Medias, Bajas y Festividades).
   - Sugerencia de tarifas para evitar desfasajes en el mercado turístico local.
6. **Reportes Estadísticos y Auditoría:**
   - Visualización y filtrado de estadísticas de procedencia de visitantes y noches promedio.
   - Exportación de listados de reservas en formato CSV para organismos provinciales/ministeriales.
   - Registro inmutable de auditoría para trazabilidad de tokens y cambios críticos.

---

## 3. Criterios de Aceptación (DoD)
- [ ] Documento principal redactado en Markdown en `docs/manual-usuario.md` o exportable a PDF corporativo.
- [ ] Inclusión de capturas de pantalla reales y actualizadas del sistema.
- [ ] Glosario de términos turísticos y técnicos del dominio (Overbooking, Token de Invitación, Voucher Digital, Código CAP).
- [ ] Sección de preguntas frecuentes (FAQ) y resolución de incidencias comunes para anfitriones y turistas.
- [ ] Validación y aprobación del contenido por parte del equipo y la Comisión de Turismo.
