# Turismo Capilla del Monte — Monorepo

<p align="center">
  <img src="https://img.shields.io/badge/Proyecto-Turismo%20Capilla%20del%20Monte-2ea44f?style=for-the-badge" alt="Proyecto">
  <img src="https://img.shields.io/badge/Monorepo-pnpm%20workspaces-f69220?style=for-the-badge&logo=pnpm" alt="pnpm">
  <img src="https://img.shields.io/badge/Backend-NestJS%2012%20%2B%20Prisma-e0234e?style=for-the-badge&logo=nestjs" alt="NestJS">
  <img src="https://img.shields.io/badge/Base%20de%20Datos-PostgreSQL-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Estado-Sprint%200%20Completado-brightgreen?style=for-the-badge" alt="Estado">
</p>

Plataforma web oficial para la promoción turística, catálogo de atractivos y motor de reservas directas de alojamientos en la localidad de **Capilla del Monte, Córdoba, Argentina**, desarrollada para la **Comisión de Turismo de Capilla del Monte**.

---

## 1. Estructura del Monorepo

El repositorio está organizado como un **monorepo administrado con `pnpm` workspaces**:

```text
Turismo-Capilla/
├── .agents/                       # Reglas de ingeniería y directrices para agentes y desarrolladores
│   ├── AGENTS.md                  # Convenciones generales y estándares de Clean Code
│   └── skills/solid-principles/   # Guía práctica de los 5 principios SOLID en TypeScript/NestJS
├── apps/
│   ├── backend/                   # API REST en NestJS + Prisma ORM + PostgreSQL + Swagger
│   └── frontend/                  # Portal público (Astro + React) y panel administrativo (React + Vite)
├── docs/                          # Documentación arquitectónica, técnica y de QA
│   ├── api-reference.md           # Referencia exhaustiva de todos los endpoints de la API
│   ├── architecture.md            # Blueprint arquitectónico (Modular Hexagonal y Screaming Architecture)
│   ├── endpoints.md               # Mapeo de rutas REST con las Historias de Usuario (HU-01 a HU-10)
│   ├── manual-testing-guide.md    # Índice maestro de pruebas manuales interactivas en Swagger
│   └── manual-testing/            # Guías de testing manual paso a paso por módulo
│       ├── 01-auth-and-invitations.md
│       ├── 02-attractions.md
│       ├── 03-accommodations.md
│       └── 04-bookings.md
├── package.json                   # Scripts globales del monorepo
├── pnpm-workspace.yaml            # Configuración de espacios de trabajo
└── README.md                      # Documento principal del repositorio
```

---

## 2. Pila Tecnológica (Stack)

| Capa / Componente | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Monorepo Manager** | `pnpm` (Workspaces) | Gestión eficiente de dependencias, scripts unificados y aislamiento entre apps. |
| **Backend Framework** | `NestJS 12` + `TypeScript` | Arquitectura modular escalable, inyección de dependencias y tipado estático estricto. |
| **ORM & Database** | `Prisma 6` + `PostgreSQL 16` | Modelado de datos declarativo, migraciones versionadas y consultas transaccionales. |
| **Documentación API** | `Swagger (OpenAPI 3.0)` | Interfaz web interactiva disponible en vivo en `http://localhost:3001/api`. |
| **Pruebas Unitarias** | `Vitest` | Suite de pruebas de ultra alta velocidad (33 tests pasando en verde). |
| **Linter & Formato** | `Oxlint` + `Prettier` | Análisis estático instantáneo y consistencia estilística en todo el código. |
| **Frontend (Planificado)** | `Astro` + `React` (Islas) | Portal público ultra rápido para turistas y panel de administración en React. |

---

## 3. Puesta en Marcha Rápida (Quick Start)

### 3.1 Prerrequisitos
* **Node.js:** `>= 22.0.0`
* **pnpm:** `>= 10.0.0` (`npm install -g pnpm`)
* **PostgreSQL:** En ejecución local o Docker en el puerto `5432`.

### 3.2 Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/Tiag4/Turismo-Capilla.git
cd Turismo-Capilla

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Configurar variables de entorno del backend
cp apps/backend/.env.example apps/backend/.env
# Ajusta tu contraseña de PostgreSQL en apps/backend/.env si es necesario

# 4. Generar Prisma y aplicar migraciones
pnpm --filter backend run prisma:migrate

# 5. Cargar datos iniciales (Admin y atractivos de Capilla del Monte)
pnpm --filter backend run prisma:seed

# 6. Iniciar el servidor backend en modo desarrollo
pnpm dev
```

* **Swagger UI:** [http://localhost:3001/api](http://localhost:3001/api)
* **Healthcheck:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)
* **Prisma Studio (GUI de Base de Datos):** `pnpm --filter backend run prisma:studio` ([http://localhost:5555](http://localhost:5555))

---

## 4. Scripts Globales Disponibles

Desde la raíz del repositorio puedes ejecutar:

```bash
pnpm dev                # Inicia el backend en modo desarrollo con hot-reload
pnpm build              # Compila todas las aplicaciones del monorepo
pnpm test               # Ejecuta toda la suite de pruebas unitarias con Vitest
pnpm lint               # Corre el linter rápido (Oxlint)
pnpm format             # Da formato a todo el código fuente con Prettier
```

---

## 5. Mapeo de Historias de Usuario (Backlog)

| Código | Historia de Usuario | Módulo Backend | Estado |
| :--- | :--- | :--- | :---: |
| `HU-01` | Landing Page & Atractivos Principales | `attractions` | ✅ Implementado |
| `HU-02` | Catálogo de Paseos y Circuitos Categorizados | `attractions` | ✅ Implementado |
| `HU-03` | Ficha Técnica y Detalle del Atractivo | `attractions` | ✅ Implementado |
| `HU-04` | Catálogo de Alojamientos con Filtros | `accommodations` | ✅ Implementado |
| `HU-05` | Detalle del Alojamiento y Servicios | `accommodations` | ✅ Implementado |
| `HU-06` | Solicitud de Reserva Directa (Anti-Overbooking) | `bookings` | ✅ Implementado |
| `HU-07` | Panel del Cabañero: Gestión de Establecimientos | `accommodations` | ✅ Implementado |
| `HU-08` | Búsqueda por Fechas y Disponibilidad | `accommodations`, `bookings` | ✅ Implementado |
| `HU-09` | Panel del Cabañero: Gestión de Reservas | `bookings` | ✅ Implementado |
| `HU-10` | Invitación Exclusiva para Prestadores Adheridos | `invitations`, `auth` | ✅ Implementado |

---

## 6. Equipo de Desarrollo

* **Tiago Nicolitsis**
* **Martino Costigliolo**
* **Juan Larcher**
* **Braian Aguilera**
* **Iris De Dominicci**

**Cátedra:** Programación III — 2026.  
**Cliente:** Comisión de Turismo de Capilla del Monte, Córdoba, Argentina.
