# Arquitectura de Software — Turismo Capilla del Monte

Este documento describe la arquitectura global, los patrones de diseño y la guía de desarrollo para el ecosistema de **Turismo Capilla del Monte**.

---

## 1. Visión General del Sistema

El sistema provee una plataforma integral para la promoción turística y reserva directa de alojamientos en Capilla del Monte, Córdoba, operando bajo un modelo **Multirepo** con responsabilidades claramente delimitadas.

### Componentes Principales

1. **Frontend (`Turismo-Capilla` — `apps/portal-turismo`):**
   * **Framework:** React 19.3 + Vite 8 (Rolldown) + React Router v7.
   * **Estilos & UI:** Tailwind CSS v4 con tokens de diseño serranos (Terracota, Brote Uritorco, Sand).
   * **Arquitectura:** Single Page Application (SPA) pura conforme a los requerimientos pedagógicos de la cátedra de **Programación III** (sin meta-frameworks SSR como Astro/Next.js).
   * **Estrategia SEO:** Mitigación mediante marcado estructurado Schema.org (JSON-LD `TouristDestination`), metadatos canónicos OpenGraph y optimización extrema de Core Web Vitals.
   * **Mapas & Animaciones:** Leaflet para geolocalización interactiva y GSAP para micro-interacciones de la Landing Page.

2. **Backend (`Turismo-Capilla-Backend`):**
   * **Framework:** NestJS 12 (Node.js + TypeScript).
   * **ORM & Base de Datos:** Prisma ORM 6 + PostgreSQL 16.
   * **Almacenamiento de Imágenes:** Cloudinary CDN.
   * **Autenticación:** JWT con Guards basados en roles (`TOURIST`, `HOST`, `ADMIN`).
   * **Testing:** Suite con `@nestjs/testing` y Vitest.

---

## 2. Patrón de Arquitectura: Modular Hexagonal (Screaming Architecture)

El backend combina **Screaming Architecture** (organización por dominios de negocio) con **Arquitectura Hexagonal / Puertos y Adaptadores** (aislamiento de la lógica de dominio respecto al framework).

### Estructura de Módulos de Negocio

```text
src/modules/
├── auth/                 # Autenticación, JWT, registro e inicio de sesión
├── invitations/          # Emisión y validación de tokens de invitación para prestadores
├── users/                # Entidades de usuarios y perfiles
├── accommodations/       # Cabañas, habitaciones, comodidades y fotos
├── bookings/             # Motor transaccional de reservas y calendarios
└── attractions/          # Paseos y circuitos turísticos
```

---

## 3. Modelo de Dominio y Reglas de Negocio Clave

### 3.1 Motor de Reservas y Prevención de Overbooking
* Una reserva atraviesa los estados: `PENDING` (solicitada), `CONFIRMED` (aprobada por el cabañero), `CANCELLED` (cancelada) y `COMPLETED` (estadía finalizada).
* **Invariante de Negocio Crítica:** Dos reservas no pueden solaparse en un mismo alojamiento para un mismo rango de fechas si ambas están en estado `PENDING` o `CONFIRMED`.
* **Mecanismo de consistencia:**
  * Al solicitar una reserva, se ejecuta una transacción atómica de Prisma (`$transaction`) que verifica:
    $$\text{existing.checkIn} < \text{new.checkOut} \quad \land \quad \text{existing.checkOut} > \text{new.checkIn}$$
  * Si existen reservas activas en ese rango, la solicitud es rechazada con un error HTTP 409 (Conflict).

### 3.2 Sistema de Invitaciones y Roles de la Comisión
* La Comisión de Turismo es la única autorizada a generar tokens de invitación (`invitation_tokens`).
* Un prestador de alojamiento solo puede registrarse proporcionando un token válido no expirado y no utilizado previamente.
* Esto garantiza que únicamente los alojamientos formalmente adheridos y habilitados formen parte del catálogo público.

---

## 4. Estándares de Código y Convenciones

1. **Lenguaje en Código:** Todo el código fuente (clases, funciones, variables, comentarios técnicos, DTOs y schemas de base de datos) debe escribirse estrictamente en **inglés**.
2. **Documentación y UI:** La documentación del proyecto y la interfaz de usuario para el cliente final deben estar en **español neutro/argentino**.
3. **Manejo de Errores:** Utilizar excepciones de dominio tipadas que se mapeen a `HttpException` mediante filtros globales de NestJS.
4. **Validación:** Toda entrada externa debe validarse mediante `ValidationPipe` y DTOs con decoradores de `class-validator`.

---

## 5. Guía de Ejecución Local

### Prerrequisitos
* Node.js `>= 22.0.0`
* pnpm `>= 10.0.0`

### Ejecución del Frontend (Este Repositorio)
```bash
# Instalar dependencias
pnpm install

# Iniciar portal turístico en desarrollo (puerto 4321)
pnpm dev

# Compilar para producción
pnpm build
```

### Ejecución del Backend (`Turismo-Capilla-Backend`)
```bash
# En el directorio del backend independiente
pnpm install
pnpm dev # Inicia en puerto 3001 (Swagger en /api)
```
