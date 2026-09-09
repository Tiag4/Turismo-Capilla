# Turismo Capilla — Documento de Gestión y Definición de Proyecto (PMI)

**Proyecto:** Turismo Capilla  
**Organización / Cliente:** Comisión de Turismo de Capilla del Monte, Córdoba, Argentina  
**Fecha de Actualización:** Septiembre 2026 (Cierre de Sprint 0)  
**Estado del Proyecto:** Sprint 0 completado / En preparación para Sprint 1  

---

## 1. Nombre Definitivo y Propósito

* **Nombre Oficial:** **Turismo Capilla**
* **Propósito:** Plataforma web oficial de promoción turística, motor de reservas directas (OTA) y sistema de fiscalización y habilitación de alojamientos para la localidad de Capilla del Monte, Córdoba.
* **Misión Institucional:** Erradicar el fraude en alquileres temporarios, brindar trazabilidad a los turistas que visitan el Valle de Punilla y fortalecer la economía regional mediante reservas seguras sin comisiones desmedidas.

---

## 2. Público Objetivo

El portal está diseñado para **todo tipo de público**, abarcando diversos perfiles de viajeros y visitantes:
* **Familias y Parejas:** Buscan tranquilidad, gastronomía serrana, cabañas con piscina climatizada y vistas al Cerro Uritorco.
* **Senderistas y Ecoturistas:** Interesados en circuitos de montaña (Los Terrones, Dique El Cajón, Huertas Malas, Las Gemelas) y ascensos diurnos/nocturnos.
* **Turismo Místico y de Bienestar:** Participantes de retiros espirituales, terapias holísticas y eventos temáticos (Festival Alienígena, avistamiento y meditación).
* **Cabañeros y Prestadores Locales:** Propietarios de complejos, hosterías y campings formalmente habilitados.
* **Operadores de la Comisión de Turismo y Municipio:** Inspectores y funcionarios responsables de la fiscalización, reportes y promoción del destino.

---

## 3. Alcance y Funcionalidades Principales

### 3.1 Portal Público de Destino (Turista)
* **Buscador de Alojamientos:** Filtro por fechas de estadía, cantidad de huéspedes, tipo de establecimiento y amenities.
* **Ficha de Alojamiento y Checkout Seguro:** Visualización de fotografías moderadas, tarifas transparentes y solicitud de reserva directa con código único de negocio auditado (`CAP-YYYY-XXXX`).
* **Widget de Clima y Pronóstico Serrano (Confirmado):**
  * Estado meteorológico en tiempo real para la base urbana y cumbres serranas.
  * Pronóstico extendido a 7 días con alertas de vientos y precipitaciones para el ascenso seguro al Cerro Uritorco.
* **Guía de Atractivos y Circuitos:** Detalle de paseos naturales, horarios y recomendaciones de seguridad.

### 3.2 Panel de Gestión para Prestadores (Host)
* **Gestión de Establecimientos:** Carga de fichas, fotos, comodidades y capacidad de huéspedes.
* **Tarifario Dinámico:** Configuración de precios por noche alineados a las temporadas oficiales.
* **Gestión de Reservas:** Visualización de solicitudes entrantes, confirmación y control de ocupación anti-overbooking.

### 3.3 Panel de Fiscalización y Control (Comisión de Turismo / Admin)
* **Sidebar y Shell Institucional:** Navegación por módulos de gestión municipal.
* **Auditoría y Checklist de Habilitación:** Inspección técnica con verificación de 5 puntos reglamentarios (matafuegos, plano de evacuación, seguro RC turistas, habilitación comercial y botiquín).
* **Gestión y Revocación de Tokens:** Emisión de tokens de adhesión única (`CAP-INV-XXXX`) con links directos de registro y facultad de revocación formal.
* **Reportes Analíticos y Exportación CSV:** Curvas de ocupación por segmento, procedencia de visitantes y descarga de planillas para la Secretaría de Turismo.
* **Moderación Visual:** Supervisión de fotos y descripciones publicadas antes de su visualización en el portal público.
* **Calendario Oficial de Temporadas:** Parametrización de Temporada Alta, Media, Baja y Fiestas Locales (Festival Alienígena, Semana Santa).

---

## 4. Arquitectura y Tecnologías Confirmadas

* **Estructura del Repositorio:** Monorepo gestionado con **pnpm workspaces**.
* **Frontend:**
  * **Astro 5 + React 19:** Portal público optimizado para SEO, Core Web Vitals y renderizado estático/islas interactivas.
  * **Tailwind CSS v4:** Sistema de diseño institucional basado en tokens oficiales (Terracota `#E06D39`, Verde Brote Uritorco `#749B3F`, Verde Esmeralda `#1C8B68`, Neutros Sand `#FAF8F5`).
* **Backend:**
  * **NestJS:** Arquitectura hexagonal modular organizada por dominios de negocio.
  * **Prisma ORM:** Modelado declarativo y control transaccional `$transaction` para garantía anti-overbooking.
  * **PostgreSQL:** Base de datos relacional de alta confiabilidad.
* **Buenas Prácticas de Ingeniería:** Principios SOLID rigurosos, Container-Presentational (<150 líneas en componentes visuales, <100 líneas en containers) y directrices anti-vibecoded (cero badges pasteles o efectos genéricos de IA).

---

## 5. Objetivos Específicos del Proyecto

1. Implementar el módulo meteorológico y de clima en tiempo real para optimizar la experiencia y seguridad en paseos serranos.
2. Garantizar 0% de sobreventa mediante transacciones atómicas de solapamiento de fechas.
3. Asegurar que el 100% de los prestadores en el portal cuenten con habilitación formal verificada.
4. Proveer estadísticas fidedignas para la toma de decisiones públicas en materia turística y promoción económica.

---

## 6. Estado Actual del Proyecto (Cierre de Sprint 0)

* **Monorepo configurado:** Workspaces de pnpm operativos para frontend (`apps/frontend`, `apps/dashboard`) y backend (`apps/backend`).
* **Track de Comisión de Turismo (Admin) — Sprint 0 Finalizado:**
  * `TDR-12`: Sidebar y shell de navegación lateral responsive implementado y mergeado.
  * `TDR-13`: Módulo de auditoría municipal con checklist técnico de 5 puntos y badges de dictamen completado.
  * `TDR-14`: Revocación de tokens y despacho de enlaces seguros finalizado.
  * `TDR-15`: Reportes analíticos de turismo con gráfico y exportación a CSV completado.
  * `TDR-16`: Registro de auditoría de actividad y trazabilidad de cambios operativo.
  * `TDR-17`: Moderación visual de fotografías y fichas de cabañas integrado.
  * `TDR-18`: Configuración oficial de temporadas turísticas de Capilla del Monte finalizado.
