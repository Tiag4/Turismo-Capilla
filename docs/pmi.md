# Plan de Gestión de Proyecto

**Proyecto:** Turismo Capilla del Monte  
**Autores:**  
* Martino Costigliolo  
* Tiago Nicolitsis Amante  
* Juan Cruz Larcher  

**Institución:** UPC - Sede Regional "Dr. Bernardo Houssay"  
**Carrera:** Tecnicatura en Desarrollo de Software  
**Docente / Tutor:** Yamil Alvarado  
**Ubicación:** Capilla del Monte, Córdoba, Argentina  
**Fecha de Actualización:** 09/09/2026  
**Versión:** 0.2 (Actualización de Definiciones de Sprint 0)  

---

## 1. Introducción

El presente Plan para la Dirección del Proyecto tiene como objetivo establecer los lineamientos formales para la planificación, desarrollo, arquitectura y seguimiento del proyecto **Turismo Capilla del Monte** (denominación comercial y de marca: **Turismo Capilla**).

El proyecto consiste en el desarrollo de una solución digital integral orientada a la promoción turística, el motor de reservas directas y la fiscalización municipal en la localidad de Capilla del Monte, Córdoba, Argentina. La plataforma centraliza y facilita el acceso a información oficial sobre atractivos naturales, estado meteorológico, paseos serranos, alojamientos inspeccionados y prestadores adheridos.

Habiendo finalizado la etapa inicial de exploración y el **Sprint 0**, el proyecto cuenta con sus definiciones tecnológicas consolidadas (arquitectura de monorepo con pnpm, Astro 5 + React en frontend, y NestJS + Prisma + PostgreSQL en backend), así como su alcance funcional y módulos de gestión acordados con las partes interesadas.

---

## 2. Descripción General

**Turismo Capilla del Monte** es un proyecto de desarrollo de software orientado a la promoción y formalización turística de Capilla del Monte, Córdoba, Argentina.

La solución busca facilitar el acceso a información turística fidedigna y centralizar datos relacionados con alojamientos, prestadores, atractivos, circuitos de senderismo y variables climáticas críticas.

El proyecto contempla además la gestión y realización de reservas directas de alojamientos, asegurando la prevención estricta de solapamientos de fechas y diferenciando los permisos y funcionalidades según el perfil de usuario.

### 2.1. Necesidades del Cliente / Objetivo de su iniciativa

El cliente (representado por la Comisión de Turismo y la comunidad turística de Capilla del Monte) requiere una solución digital que permita centralizar la oferta turística y facilitar el acceso transparente a dicha información por parte de los visitantes.

La iniciativa busca:
* Erradicar el fraude y las estafas en alquileres temporarios no autorizados mediante la validación y certificación de habilitaciones comerciales.
* Mejorar la experiencia de los turistas al momento de conocer, comparar y reservar opciones disponibles en la localidad.
* Facilitar la gestión operativa de alojamientos a los cabañeros y hoteleros locales sin depender exclusivamente de plataformas extranjeras con altas comisiones.
* Proporcionar datos e informes analíticos fidedignos a la Secretaría de Turismo municipal para la toma de decisiones públicas.

### 2.2. Beneficios Cualitativos y Cuantitativos de la Iniciativa del Cliente

#### Beneficios Cualitativos
* **Acceso centralizado:** Concentra toda la información turística oficial en un único punto de contacto digital.
* **Seguridad y confianza en destino:** Certificación municipal visible que garantiza que cada propiedad fue inspeccionada y cumple normas de seguridad edilicia.
* **Seguridad en paseos y ascensos:** Información meteorológica en tiempo real y alertas tempranas para ascensos seguros al Cerro Uritorco y senderos de montaña.
* **Experiencia diferenciada:** Interfaces diseñadas y optimizadas para cada actor (turista, cabañero y administración municipal).
* **Organización estructurada:** Estandarización de fichas técnicas, fotografías moderadas y tarifas.

#### Beneficios Cuantitativos
* **Reducción del tiempo de búsqueda:** Localización inmediata de alojamientos disponibles y atractivos según filtros específicos.
* **Cero solapamiento de reservas:** Integridad transaccional a nivel de base de datos para erradicar la sobreventa (overbooking).
* **Trazabilidad de prestadores:** Control del 100% de prestadores adheridos mediante tokens de registro únicos.
* **Disponibilidad de métricas:** Generación y exportación de reportes analíticos de ocupación e impacto económico en formato CSV para gestión pública.

---

### 2.3. Entorno

El proyecto se desarrolla en el contexto turístico y geográfico de Capilla del Monte, Valle de Punilla, Córdoba, Argentina.

#### Público Objetivo
La plataforma está concebida para **todo tipo de público**, adaptando su contenido y accesibilidad a perfiles heterogéneos:
1. **Familias y Parejas:** Búsqueda de tranquilidad, descanso, cabañas con pileta y servicios gastronómicos.
2. **Senderistas, Ecoturistas y Deportistas:** Interesados en circuitos de montaña, trekking (Cerro Uritorco, Los Terrones, Huertas Malas, Las Gemelas) y turismo de aventura.
3. **Turismo Holístico y Cultural:** Visitantes atraídos por el misticismo, terapias alternativas, meditación y eventos masivos (como el Festival Alienígena).
4. **Cabañeros y Prestadores:** Propietarios y administradores locales que comercializan sus plazas hoteleras.
5. **Comisión de Turismo y Funcionarios Municipales:** Personal técnico abocado a la auditoría, control y estadística.

#### Actores del Sistema
La solución contempla tres actores principales con responsabilidades y permisos claramente diferenciados:
* **`ADMIN` (Comisión de Turismo / Administración Municipal):** Supervisión global de la plataforma, fiscalización técnica de alojamientos mediante checklist municipal, emisión y revocación de tokens de invitación, moderación de fotografías, configuración de temporadas y consulta de reportes estadísticos.
* **`HOST` (Cabañeros / Prestadores):** Registro de establecimientos y unidades, publicación de tarifas por noche, carga de fotografías y administración del ciclo de vida de reservas.
* **`TOURIST` (Turistas / Visitantes):** Consulta pública de atractivos, verificación de datos climáticos y realización de solicitudes de reserva directas con código identificador único.

La plataforma garantiza acceso responsive fluido desde dispositivos móviles, tablets y computadoras de escritorio.

---

### 2.4. Objetivos del Proyecto

#### Objetivo General
Desarrollar, implementar y validar una solución digital integral que centralice y facilite la promoción turística de Capilla del Monte, incorporando módulos de gestión de alojamientos habilitados, guía de atractivos, reportes municipales, información climática en tiempo real y un motor de reservas directas anti-overbooking.

#### Objetivos Específicos
1. **Implementación de Clima y Pronóstico Serrano:** Desarrollar e integrar un módulo meteorológico en tiempo real con pronóstico extendido a 7 días y alertas de vientos/lluvias para garantizar la seguridad de los visitantes en excursiones y ascensos al Cerro Uritorco.
2. **Garantía Transaccional Anti-Overbooking:** Implementar un motor de reservas atómico con chequeo estricto de colisión de fechas (`checkIn < existingCheckOut && checkOut > existingCheckIn`) y generación de códigos únicos de negocio (`CAP-YYYY-XXXX`).
3. **Fiscalización y Auditoría Municipal:** Diseñar un sistema de verificación técnica de 5 requisitos de habilitación (matafuegos, evacuación, seguro RC, habilitación comercial y botiquín) con badges oficiales de dictamen.
4. **Mecanismo Anti-Fraude:** Desarrollar un sistema de tokens institucionales (`CAP-INV-XXXX`) con despacho de links seguros y capacidad de revocación justificada para el registro exclusivo de prestadores autorizados.
5. **Trazabilidad y Control de Calidad:** Proveer auditoría cronológica de eventos administrativos y un panel de moderación previa de fotografías antes de su difusión pública.
6. **Métricas y Soporte Ministerial:** Habilitar un panel de reportes con segmentación por temporadas y exportación directa a formato CSV para la Secretaría de Turismo.

#### Alcance
El proyecto abarca el desarrollo del portal público para turistas, el panel de gestión para prestadores, el centro de control municipal para la Comisión de Turismo, las APIs REST transaccionales y la documentación técnica y de testing.

#### Tiempo
Completar el ciclo de desarrollo por fases incrementales (Sprints) conforme al cronograma académico y de entregas definido.

#### Costos
Infraestructura optimizada mediante el uso de tecnologías Open Source (PostgreSQL, NestJS, Astro, Node.js, pnpm) y despliegue en servicios cloud sin costos de licenciamiento privativo.

---

### 2.5. Descripción de Producto o Servicio

El producto es una plataforma digital modular orientada al turismo de Capilla del Monte, compuesta por módulos desacoplados y coordinados.

#### 2.5.1. Requisitos Funcionales por Módulo

##### Módulo de Autenticación y Roles
* Autenticación segura de usuarios mediante credenciales y tokens JWT.
* Control de acceso basado en roles (`ADMIN`, `HOST`, `TOURIST`).
* Conmutador rápido de vista institucional para pruebas operativas.
* Protección de rutas y endpoints según permisos otorgados.

##### Módulo de Gestión de Alojamientos y Prestadores
* Registro y edición de establecimientos (nombre, descripción, tipología: Cabaña, Hotel, Departamento, Camping).
* Tarifario por noche y especificación de capacidad máxima de huéspedes.
* Catálogo de servicios y comodidades (Wi-Fi, piscina climatizada, estacionamiento, etc.).
* Geolocalización geográfica (coordenadas de latitud y longitud).
* Galería de imágenes con designación de foto de portada.
* Búsqueda, ordenamiento y filtrado de hospedajes.
* Auditoría técnica municipal: checklist de inspección de 5 puntos reglamentarios y asignación de dictamen (*Habilitado Oficial*, *En Revisión Técnica*, *No Habilitado*).

##### Módulo Motor de Reservas
* Creación y gestión de reservas directas.
* Control estricto de disponibilidad en tiempo real.
* Prevención transaccional de solapamiento de fechas.
* Cálculo automatizado de cantidad de noches y liquidación de tarifas en pesos argentinos (ARS).
* Generación de código único de reserva auditado (`CAP-YYYY-XXXX`).
* Gestión de ciclo de vida de la reserva (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`).

##### Módulo Guía de Atractivos y Circuitos Turísticos
* Registro y consulta interactiva de paseos y atractivos naturales (Los Terrones, Uritorco, Balnearios, Dique El Cajón).
* Clasificación por categorías temáticas (naturaleza, senderismo, cultura, descanso).
* Nivel de dificultad física y técnica del sendero.
* Duración estimada del circuito y requerimiento de guía habilitado.

##### Módulo Meteorológico y de Clima (Funcionalidad Confirmada)
* Consulta en tiempo real de temperatura, humedad y vientos en Capilla del Monte.
* Pronóstico extendido a 7 días para planificación de estadías.
* Alertas preventivas para actividades de montaña (ascensos nocturnos y diurnos al Cerro Uritorco).

##### Módulo de la Comisión de Turismo (Admin y Fiscalización)
* Sidebar y shell de navegación institucional responsive.
* Gestión y emisión de tokens seguros de invitación para prestadores.
* Revocación formal de invitaciones antes de su vencimiento con motivo justificado.
* Copiado directo de enlaces seguros de registro (`.../registro-prestador?token=CAP-INV-XXXX`).
* Reportes analíticos de ocupación, procedencia de turistas y facturación estimada, con exportación a planillas CSV.
* Registro cronológico inmutable de auditoría de actividad (timeline de altas, revocaciones, habilitaciones y modificaciones).
* Mesa de moderación previa de fotografías y descripciones publicadas por cabañeros, con circuito de observaciones técnicas.
* Calendario oficial de temporadas turísticas (Alta, Media, Baja, Eventos Especiales) con multiplicador tarifario de referencia.

---

### 2.5.2. Descripción de la Solución y Tecnologías Confirmadas

La plataforma se estructura bajo un enfoque de **Monorepo** y arquitectura limpia modular:

* **Gestor de Repositorio:** `pnpm workspaces` para unificación de dependencias y builds eficientes.
* **Frontend:**
  * **Astro 5 + React 19:** Renderizado híbrido (SSR para contenido estático/SEO en portal público e islas interactivas de React para paneles y formularios).
  * **Tailwind CSS v4:** Sistema visual con tokens oficiales de diseño de Capilla del Monte (Terracota `#E06D39`, Verde Brote Uritorco `#749B3F`, Verde Esmeralda `#1C8B68`, Neutros Sand `#FAF8F5`).
  * **Estándares de Frontend:** Principios SOLID, arquitectura Container-Presentational (Dumb components < 150 líneas, Containers < 100 líneas, Custom Hooks < 250 líneas) y reglas estrictas anti-vibecoded (cero badges pasteles o transparencias deslavadas; insignias 100% sólidas de alto contraste).
* **Backend:**
  * **NestJS (TypeScript):** Arquitectura modular organizada por conceptos de negocio (`accommodations`, `bookings`, `attractions`, `invitations`, `users`).
  * **Prisma ORM:** Modelado declarativo y control transaccional atómico mediante `$transaction` para eliminar riesgos de concurrencia y sobreventa.
  * **PostgreSQL:** Base de datos relacional de alta disponibilidad.

---

### 2.6. Entregables de Proyecto

| ID | Nombre del Entregable | Responsable | Fecha Prevista | Estado / Criterio de Aceptación |
|:---:|---|---|:---:|---|
| **E01** | Arquitectura Monorepo y Configuración Base | Equipo de desarrollo | 07/09/2026 | **Completado:** Monorepo pnpm configurado con workspaces de frontend y backend. |
| **E02** | Shell Institucional y Sidebar Responsive | Juan Cruz Larcher | 08/09/2026 | **Completado:** Sidebar lateral con navegación por roles y layout adaptativo. |
| **E03** | Módulo de Fiscalización y Auditoría Municipal | Juan Cruz Larcher | 09/09/2026 | **Completado:** Checklist de 5 ítems, dictámenes municipales y badges sólidos. |
| **E04** | Sistema de Tokens y Revocación Segura | Juan Cruz Larcher | 09/09/2026 | **Completado:** Emisión, revocación con justificación y copiado de link directo. |
| **E05** | Reportes Estadísticos y Exportación CSV | Juan Cruz Larcher | 09/09/2026 | **Completado:** Tablero analítico con gráfico de barras y descarga de planillas. |
| **E06** | Auditoría de Actividad y Moderación de Fotos | Juan Cruz Larcher | 09/09/2026 | **Completado:** Timeline inmutable y panel de supervisión de fotos con observaciones. |
| **E07** | Calendario Oficial de Temporadas | Juan Cruz Larcher | 09/09/2026 | **Completado:** ABM de temporadas y multiplicadores tarifarios sugeridos. |
| **E08** | Módulo Meteorológico y de Clima | Equipo de desarrollo | Sprint 1 | **Planificado:** Widget de clima en tiempo real y alertas de montaña. |
| **E09** | Motor de Reservas y Portal Público | Equipo de desarrollo | Sprint 1 | **En curso:** Buscador, fichas de alojamientos y checkout atómico sin solapamiento. |
| **E10** | Documentación Técnica y Guías de Testing | Equipo de desarrollo | Continuo | **Completado y al día:** PMI, API reference y guías de testing manual. |

---

### 2.7. Suposiciones

* Los usuarios (turistas, prestadores y administradores) disponen de conexión a Internet para operar en la plataforma.
* La información de habilitaciones y normativas responde a las disposiciones formales de la Municipalidad de Capilla del Monte.
* Los prestadores son responsables de la exactitud de sus tarifas y cupos cargados.
* Las condiciones climáticas se obtienen a través de APIs meteorológicas de alta precisión para la zona geográfica de Punilla.

---

### 2.8. Restricciones

* El desarrollo debe respetar el cronograma académico estipulado por la UPC.
* Se prohíbe el uso de bibliotecas pesadas o componentes vibecoded que comprometan el rendimiento o la accesibilidad (WCAG 2.1 AA).
* Todas las transacciones de reserva deben ser atómicas e inmunes a condiciones de carrera.
* Cumplimiento estricto del estándar de codificación UTF-8 sin BOM para prevenir corrupción de caracteres.

---

### 2.9. Interesados en el Proyecto (Stakeholders)

| Stakeholder | Tipo | Rol / Interés en el proyecto |
|---|:---:|---|
| **Yamil Alvarado** (Docente / Tutor) | Interno | Supervisión pedagógica, validación de avance de hitos y criterios de calidad. |
| **Equipo de Desarrollo** (Martino, Tiago, Juan Cruz) | Interno | Análisis, diseño arquitectónico, implementación de código, pruebas y despliegue. |
| **Comisión de Turismo / Municipalidad** | Externo | Fiscalización de prestadores, erradicación de estafas, análisis estadístico y promoción institucional. |
| **Prestadores y Cabañeros** | Externo | Comercialización directa de sus plazas, reducción de intermediarios y gestión de tarifas. |
| **Turistas y Visitantes** | Externo | Consulta de paseos, verificación meteorológica y contratación segura de alojamientos verificados. |

---

### 2.10. Requisitos Detallados Técnicos y de Gestión

* **Gestión de Versiones:** Git con flujo de trabajo por ramas de feature y Pull Requests hacia ramas de sprint.
* **Calidad de Código:** Convención de commits (Conventional Commits), tipado estricto en TypeScript y verificación continua mediante linter y compilador (`tsc`).
* **Diseño y Estilo:** Cumplimiento de la identidad visual de Capilla del Monte (colores institucionales de casonas y cerros, tipografía Outfit y Plus Jakarta Sans).

---

## 3. Equipo de Proyecto

El equipo está integrado por:
* **Tiago Nicolitsis Amante** — Desarrollo de Software (Track Cabañero / Portal Público)
* **Juan Cruz Larcher** — Desarrollo de Software (Track Comisión de Turismo / Admin)
* **Martino Costigliolo** — Desarrollo de Software (Arquitectura y Backend)

### 3.1. Organigrama de Proyecto (OBS)

* **Dirección / Coordinación:** Equipo conjunto de desarrollo en coordinación con el docente tutor.
* **Frentes de Trabajo:**
  * Frente 1: Portal de reservas, experiencia del turista y módulo de clima.
  * Frente 2: Plataforma del cabañero, fichas de hospedajes y tarifas.
  * Frente 3: Consola municipal de fiscalización, seguridad y reportes.

### 3.2. Proveedores y Subcontratistas
No se contemplan subcontratistas externos; la totalidad del desarrollo es realizada por el equipo de proyecto.

### 3.3. Matriz de Asignación de Responsabilidades (RACI)

| Tarea / Módulo | Tiago Nicolitsis | Juan Cruz Larcher | Martino Costigliolo |
|---|:---:|:---:|:---:|
| Arquitectura Monorepo y Base de Datos | C | C | R / A |
| Sidebar y Shell Municipal (Admin) | I | R / A | I |
| Auditoría de Prestadores y Checklist | I | R / A | C |
| Tokens Seguros y Revocación | I | R / A | C |
| Reportes y Exportación CSV | I | R / A | C |
| Moderación de Fotos y Contenidos | I | R / A | C |
| Calendario de Temporadas | I | R / A | C |
| Módulo de Clima y Pronóstico Serrano | R / A | C | C |
| Motor de Reservas y Anti-Overbooking | R / A | C | R / A |
| Portal Público y Experiencia Turista | R / A | C | C |

*(R: Responsable, A: Aprobador, C: Consultado, I: Informado)*

---

## 4. Cronograma de Proyecto

### 4.1. Etapas
1. **Investigación, Relevamiento y PMI Inicial:** Análisis de necesidades y formalización del plan.
2. **Sprint 0 (Setup y Shell Administrativo):**
   * Configuración de monorepo pnpm, estándares SOLID y diseño oficial.
   * Implementación completa del track de la Comisión de Turismo (Admin): sidebar, auditoría municipal, tokens y revocación, reportes CSV, logs de actividad, moderación y temporadas. *(100% Completado)*
3. **Sprint 1 (Motor de Reservas, Clima y Portal Turista):**
   * Desarrollo del widget de clima en tiempo real y pronóstico extendido.
   * Motor de reservas transaccional con prevención atómica de solapamiento.
   * Publicación del buscador y fichas de cabañas en el portal público.
4. **Sprint 2 (Pruebas Integrales y Hardening):**
   * Pruebas end-to-end de reservas y pasarela.
   * Auditoría de rendimiento, SEO y Core Web Vitals.
5. **Entrega y Presentación:** Demostración final del sistema operativo.

### 4.2. Hitos Principales
* **H01:** Aprobación del Plan de Gestión de Proyecto (PMI) actualizado. *(Alcanzado)*
* **H02:** Cierre de Sprint 0 con módulo municipal operativo. *(Alcanzado)*
* **H03:** Implementación del Módulo Meteorológico y Motor de Reservas.
* **H04:** Integración completa de portales y pruebas de carga.
* **H05:** Presentación y entrega final de la plataforma.

---

## 5. Presupuesto del Proyecto

### 5.1. Línea de Base de Costos
El presupuesto del proyecto se optimiza aprovechando recursos de código abierto y plataformas con planes comunitarios/educativos:
* **Infraestructura de Base de Datos:** PostgreSQL en servidor gestionado cloud o entorno local de alta performance.
* **Hosting y Despliegue:** Servicios con soporte nativo de Node.js y renderizado estático de Astro.
* **APIs Externas:** Consumo de servicios meteorológicos y cartográficos con cuotas gratuitas suficientes para la escala local.

---

## 6. Registro de Riesgos

| Riesgo | Probabilidad | Impacto | Estrategia de Respuesta |
|---|:---:|:---:|---|
| **Falta de veracidad en fotos de cabañas** | Media | Alto | Implementación de mesa de moderación previa obligatoria en panel Admin. |
| **Sobreventa por reservas simultáneas** | Media | Alto | Bloqueo transaccional a nivel de base de datos con chequeo estricto de fechas. |
| **Incumplimiento de normas de seguridad edilicia** | Media | Alto | Checklist de 5 puntos reglamentarios antes de otorgar el badge de Habilitado Oficial. |
| **Condiciones climáticas adversas en montaña** | Alta | Alto | Módulo meteorológico visible con alertas preventivas para paseos y senderismo. |
| **Desactualización de tarifas y temporadas** | Media | Medio | Parametrización centralizada de multiplicadores sugeridos por la Comisión de Turismo. |
| **Tiempo acotado de desarrollo** | Media | Medio | Adopción rigurosa de metodología Scrum por Sprints con DoD claros y componentes modulares. |

---

## 7. Control de Cambios

### 7.1. Comité de Control de Cambios
* **Product Owner / Tutor:** Valida la pertinencia pedagógica y los requisitos de negocio.
* **Equipo de Desarrollo:** Evalúa la viabilidad técnica, el impacto en la arquitectura y el esfuerzo en puntos de historia.

### 7.2. Procedimiento de Control de Cambios
1. Identificación y registro formal de la solicitud de cambio en el backlog.
2. Análisis de impacto sobre la arquitectura, base de datos y tiempo de entrega.
3. Decisión colegiada de aprobación o rechazo.
4. Registro en el historial de versiones del PMI y actualización de historias de usuario.
5. Implementación en la rama correspondiente con su respectivo PR de trazabilidad.

---

## 8. Comunicaciones Interpersonales en el Proyecto

* **Equipo de Desarrollo:**
  * Canales: Repositorio en GitHub (Issues, PRs, Discussions), reuniones presenciales en sede y canal virtual diario.
  * Frecuencia: Continua y sincronización al cierre de cada tarea.
* **Tutor / Docente:**
  * Canales: Clases de seguimiento, minutas de avance y revisiones de hitos.
  * Frecuencia: Semanal o según el cronograma lectivo.

---

## 9. Plan de Pruebas y Aceptación

El sistema se somete a validaciones en múltiples capas:
1. **Pruebas de Tipado y Compilación:** Build continuo (`tsc && vite build`) con cero tolerancia a errores de tipado o variables sin usar.
2. **Pruebas de Reglas de Negocio:**
   * Garantía de que ninguna reserva se confirme si se solapa con una preexistente.
   * Validación de que tokens revocados o vencidos rechacen solicitudes de registro.
   * Certificación de que solo alojamientos con dictamen de *Habilitado Oficial* se publiquen en el catálogo activo.
3. **Pruebas de Usabilidad y Accesibilidad:** Verificación de contraste de color (WCAG 2.1 AA) y navegación fluida en dispositivos móviles.

---

## 10. Gestión de Subcontratistas

No se contemplan subcontrataciones; el equipo asume la totalidad del diseño, programación, testing y documentación.

---

## 11. Logística e Infraestructura

### 11.1. Lugares Físicos y Modalidad
* **Modalidad:** Mixta (trabajo presencial en la sede de la UPC y desarrollo remoto colaborativo).
* **Infraestructura:** Computadoras personales de desarrollo, entornos de ejecución basados en Node.js v24+, pnpm y repositorios Git centralizados.

### 11.2. Viajes y Traslados
No se contemplan viajes adicionales más allá de visitas de relevamiento en la localidad de Capilla del Monte.

---

## 12. Anexos

* **Anexo I - Contratos y Adhesiones:** Modelo de constancia de adhesión formal y token de seguridad municipal.
* **Anexo II - Minutas de Reunión:** Registro de acuerdos del equipo de desarrollo y revisiones con el tutor.
* **Anexo III - Control de Cambios:** Historial de versiones del Plan de Gestión de Proyecto (de Versión 0.1 inicial a Versión 0.2 de Sprint 0).
* **Anexo IV - Documentación Técnica Complementaria:** Documentos ubicados en la carpeta `/docs` del repositorio:
  * [`api-reference.md`](file:///c:/Users/Juan/Desktop/Turismo/Turismo-Capilla/docs/api-reference.md)
  * [`architecture.md`](file:///c:/Users/Juan/Desktop/Turismo/Turismo-Capilla/docs/architecture.md)
  * [`frontend-architecture.md`](file:///c:/Users/Juan/Desktop/Turismo/Turismo-Capilla/docs/frontend-architecture.md)
  * [`manual-testing-guide.md`](file:///c:/Users/Juan/Desktop/Turismo/Turismo-Capilla/docs/manual-testing-guide.md)
