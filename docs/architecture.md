# Arquitectura de Software — Turismo Capilla del Monte

Este documento describe la arquitectura global, los patrones de diseño y la guía de desarrollo para el ecosistema de **Turismo Capilla del Monte**.

---

## 1. Visión General del Sistema

El sistema provee una plataforma integral para la promoción turística y reserva directa de alojamientos en Capilla del Monte, Córdoba, operando bajo un modelo **Multirepo** con contratos de interfaz desacoplados (API-First).

### Componentes Principales

1. **Frontend (`Turismo-Capilla` — `apps/portal-turismo`):**
   * **Framework:** React 19.3 + Vite 8 (Rolldown) + React Router v7.
   * **Estilos & UI:** Tailwind CSS v4 con tokens de diseño serranos (Terracota, Brote Uritorco, Sand).
   * **Arquitectura:** Single Page Application (SPA) pura conforme a los requerimientos pedagógicos de la cátedra de **Programación III** (sin meta-frameworks SSR como Astro/Next.js).
   * **Estrategia SEO:** Mitigación mediante marcado estructurado Schema.org (JSON-LD `TouristDestination`), metadatos canónicos OpenGraph y optimización extrema de Core Web Vitals.
   * **Mapas & Animaciones:** Leaflet para geolocalización interactiva y GSAP para micro-interacciones de la Landing Page.

2. **Backend (`Turismo-Capilla-Backend` — En Construcción):**
   * **Estado:** En proceso de transición y desarrollo hacia **Java**.
   * **Stack Objetivo:** Java 17 + Spring Boot 3 + Spring Data JPA (Hibernate) + PostgreSQL 16.
   * **Gestor de Dependencias y Build:** Maven / Gradle.
   * **Autenticación & Seguridad:** Spring Security con tokens JWT stateless y control de acceso basado en roles (`ROLE_TOURIST`, `ROLE_HOST`, `ROLE_ADMIN`).
   * **Persistencia:** Hibernate como proveedor de JPA, con pool de conexiones HikariCP y soporte para transacciones ACID estrictas.
   * **Almacenamiento de Imágenes:** Cloudinary CDN vía SDK oficial.

---

## 2. Patrón de Arquitectura: Hexagonal y en Capas (Spring Boot)

El backend en Java implementa una **Arquitectura en Capas / Hexagonal** para aislar el modelo de negocio de los detalles de infraestructura (framework web, base de datos):

### Estructura de Paquetes Prevista

```text
src/main/java/ar/gob/capilladelmonte/turismo/
├── core/                         # Dominio puro y casos de uso
│   ├── accommodations/           # Entidades y reglas de cabañas/hospedajes
│   ├── bookings/                 # Entidades y máquina de estados de reservas
│   ├── attractions/              # Entidades de paseos y circuitos turísticos
│   ├── invitations/              # Gestión de tokens de invitación para prestadores
│   └── users/                    # Entidades de usuarios y perfiles
├── application/                  # Servicios de aplicación y orquestación (Use Cases)
│   ├── dto/                      # Records inmutables para Request/Response
│   └── services/                 # Implementaciones de lógica de negocio (@Service)
└── infrastructure/               # Adaptadores externos
    ├── controllers/              # Controladores REST (@RestController, @RequestMapping)
    ├── persistence/              # Repositorios Spring Data JPA (@Repository)
    ├── security/                 # Filtros JWT, UserDetailsService, PasswordEncoder
    └── config/                   # Configuración de CORS, Swagger/OpenAPI y Cloudinary
```

---

## 3. Modelo de Dominio y Reglas de Negocio Clave

### 3.1 Motor de Reservas y Prevención de Overbooking
* Una reserva atraviesa los estados: `PENDING` (solicitada), `CONFIRMED` (aprobada por el cabañero), `CANCELLED` (cancelada) y `COMPLETED` (estadía finalizada).
* **Invariante de Negocio Crítica:** Dos reservas no pueden solaparse en un mismo alojamiento para un mismo rango de fechas si ambas están en estado `PENDING` o `CONFIRMED`.
* **Mecanismo de consistencia transaccional (JPA / Spring):**
  * Al solicitar una reserva, se ejecuta una consulta transaccional (`@Transactional(isolation = Isolation.REPEATABLE_READ)`) que verifica la condición de solapamiento:
    $$\text{existing.checkIn} < \text{new.checkOut} \quad \land \quad \text{existing.checkOut} > \text{new.checkIn}$$
  * Si existen reservas activas en ese rango, la transacción emite un rollback y rechaza la solicitud arrojando una excepción de negocio mapeada a HTTP 409 (Conflict).

### 3.2 Sistema de Invitaciones y Roles de la Comisión
* La Comisión de Turismo es la única autorizada a emitir tokens criptográficos de invitación (`invitation_tokens`).
* Un prestador de alojamiento solo puede registrarse (`ROLE_HOST`) proporcionando un token válido, no expirado y no utilizado previamente.
* Esto garantiza que únicamente los alojamientos formalmente adheridos y habilitados formen parte del catálogo público.

---

## 4. Estándares de Código y Convenciones

1. **Lenguaje en Código:** Todo el código fuente (clases, interfaces, records, métodos, comentarios técnicos, DTOs y tablas de base de datos) debe escribirse estrictamente en **inglés**.
2. **Documentación y UI:** La documentación del proyecto y la interfaz de usuario para el cliente final deben estar en **español neutro/argentino**.
3. **Manejo de Errores en Backend:** Utilizar excepciones de negocio (`DomainException`) capturadas centralizadamente por un `@ControllerAdvice` (`ProblemDetails` según RFC 7807).
4. **Validación:** Toda entrada externa se valida mediante anotaciones de Jakarta Bean Validation (`@Valid`, `@NotNull`, `@NotBlank`, `@FutureOrPresent`).

---

## 5. Guía de Ejecución Local

### Prerrequisitos
* Node.js `>= 22.0.0`
* pnpm `>= 10.0.0`
* Java JDK `>= 17` (para el backend en desarrollo)

### Ejecución del Frontend (Este Repositorio)
```bash
# Instalar dependencias
pnpm install

# Iniciar portal turístico en desarrollo (puerto 5173)
pnpm dev

# Compilar para producción
pnpm build
```

### Ejecución del Backend (`Turismo-Capilla-Backend`)
```bash
# En el repositorio del backend Java (una vez provisto)
./mvnw spring-boot:run
# O con Gradle:
./gradlew bootRun
```
