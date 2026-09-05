# Arquitectura de Software — Turismo Capilla del Monte

Este documento describe la arquitectura global, los patrones de diseño y la guía de desarrollo para el proyecto **Turismo-Capilla**.

---

## 1. Visión General del Sistema

El sistema provee una plataforma integral para la promoción turística y reserva directa de alojamientos en Capilla del Monte, Córdoba.

### Componentes Principales

1. **Backend (`apps/backend`):**
   * **Framework:** NestJS (Node.js + TypeScript).
   * **ORM:** Prisma.
   * **Base de Datos:** PostgreSQL.
   * **Almacenamiento de Imágenes:** Cloudinary.
   * **Autenticación:** JWT con Guards basados en roles (`TOURIST`, `HOST`, `ADMIN`).

2. **Frontend (`apps/frontend`):**
   * **Portal Público (Turistas):** Astro con componentes interactivos en React (Arquitectura de Islas). Optimizado para SEO, rendimiento y carga ultra rápida.
   * **Panel Administrativo (Cabañeros y Comisión):** Single Page Application (SPA) con React + Vite y Tailwind CSS.

---

## 2. Patrón de Arquitectura: Modular Hexagonal (Screaming Architecture)

El backend combina **Screaming Architecture** (organización por dominios de negocio) con **Arquitectura Hexagonal / Puertos y Adaptadores** (aislamiento de la lógica de dominio).

### Estructura de Módulos

```text
apps/backend/src/modules/
├── auth/                 # Autenticación, JWT, registro e inicio de sesión
├── invitations/          # Emisión y validación de tokens de invitación para prestadores
├── users/                # Entidades de usuarios y perfiles
├── accommodations/       # Cabañas, habitaciones, comodidades y fotos
├── bookings/             # Motor transaccional de reservas y calendarios
└── attractions/          # Paseos y circuitos turísticos
```

### Anatomía de un Módulo de Negocio (ejemplo: `bookings`)

```text
modules/bookings/
├── domain/                      # Núcleo puro (sin dependencias de NestJS ni Prisma)
│   ├── booking.entity.ts        # Entidad de dominio y reglas de estado
│   └── ports/                   # Interfaces (contratos de salida)
│       └── booking.repository.port.ts
├── application/                 # Casos de uso
│   ├── create-booking.usecase.ts
│   └── cancel-booking.usecase.ts
└── infrastructure/              # Adaptadores externos
    ├── controllers/             # Endpoints HTTP (NestJS Controller)
    ├── dtos/                    # Validación de entrada (class-validator)
    └── persistence/             # Implementación del puerto con Prisma
        └── prisma-booking.repository.ts
```

---

## 3. Modelo de Dominio y Reglas de Negocio Clave

### 3.1 Motor de Reservas y Prevención de Overbooking
* Una reserva tiene los estados: `PENDING` (solicitada), `CONFIRMED` (aprobada por el cabañero), `CANCELLED` (cancelada) y `COMPLETED` (estadía finalizada).
* **Invariante de Negocio Crítica:** Dos reservas no pueden solaparse en un mismo alojamiento para un mismo rango de fechas si ambas están en estado `PENDING` o `CONFIRMED`.
* **Mecanismo de consistencia:**
  * Al solicitar una reserva, se ejecuta una consulta transaccional que verifica:
    $$\text{existing.checkIn} < \text{new.checkOut} \quad \land \quad \text{existing.checkOut} > \text{new.checkIn}$$
  * Si existen reservas activas en ese rango, la solicitud es rechazada con un error HTTP 409 (Conflict).

### 3.2 Sistema de Invitaciones y Roles de la Comisión
* La Comisión de Turismo es la única autorizada a generar tokens de invitación (`invitation_tokens`).
* Un prestador de alojamiento solo puede registrarse proporcionando un token válido no expirado y no utilizado previamente.
* Esto garantiza que únicamente los alojamientos adheridos formalmente a la oficina de turismo formen parte de la plataforma.

---

## 4. Estándares de Código y Convenciones

1. **Lenguaje en Código:** Todo el código fuente (clases, funciones, variables, comentarios técnicos, DTOs y schemas de base de datos) debe escribirse en **inglés**.
2. **Documentación y UI:** La documentación del proyecto y la interfaz de usuario para el cliente final deben estar en **español neutro/argentino**.
3. **Manejo de Errores:** Utilizar excepciones de dominio tipadas que se mapeen a `HttpException` mediante filtros globales de NestJS.
4. **Validación:** Toda entrada externa debe validarse mediante `ValidationPipe` y DTOs con decoradores de `class-validator`.

---

## 5. Guía de Ejecución Local

### Prerrequisitos
* Node.js v20+ o v24+
* pnpm v9+ o v11+
* PostgreSQL 15+ corriendo localmente o mediante Docker

### Configuración Inicial
```bash
# 1. Instalar dependencias del monorepo
pnpm install

# 2. Configurar variables de entorno
cp apps/backend/.env.example apps/backend/.env

# 3. Ejecutar migraciones de Prisma
pnpm --filter backend prisma migrate dev

# 4. Iniciar en modo desarrollo
pnpm dev
```
