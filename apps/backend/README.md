# Backend API — Turismo Capilla del Monte

Servidor REST desarrollado con **NestJS**, **Prisma ORM**, **PostgreSQL** y **TypeScript** bajo principios **SOLID** y arquitectura modular hexagonal.

---

## 1. Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu máquina:
* **Node.js:** Versión 22.x o superior.
* **pnpm:** Versión 10.x o superior (`npm install -g pnpm`).
* **PostgreSQL:** Versión 16.x en ejecución (local o en Docker en el puerto `5432`).

---

## 2. Configuración del Entorno (`.env`)

Crea un archivo `.env` dentro del directorio `apps/backend/` (puedes tomar como base `.env.example`):

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/turismo_capilla?schema=public"
JWT_SECRET="super-secret-jwt-key-turismo-capilla-monte-2026"
JWT_EXPIRES_IN="7d"
PORT=3001
```

> **Nota sobre el puerto:** Se utiliza el puerto **3001** por defecto para evitar colisiones con procesos que suelan utilizar el puerto 3000.

---

## 3. Instalación y Base de Datos

Desde la raíz del monorepo o dentro de `apps/backend/`:

```bash
# 1. Instalar dependencias
pnpm install

# 2. Generar el cliente de Prisma
pnpm --filter backend run prisma:generate

# 3. Aplicar las migraciones a la base de datos PostgreSQL
pnpm --filter backend run prisma:migrate

# 4. Poblar la base de datos con datos semilla iniciales
pnpm --filter backend run prisma:seed
```

### Datos Semilla Iniciales (Seed)
Al ejecutar `prisma:seed` se crean automáticamente:
* **Administrador Oficial:**
  * **Email:** `admin@capilladelmonte.gov.ar`
  * **Contraseña:** `AdminCapilla2026!`
  * **Rol:** `ADMIN`
* **Atractivos Turísticos Iniciales:**
  * Cerro Uritorco (Ascenso, 1979 msnm)
  * Los Terrones (Parque autóctono y geológico)
  * El Zapato (Monumento natural de roca)
  * Balneario La Toma (Río Calabalumba)

---

## 4. Ejecución del Servidor

```bash
# Modo desarrollo con recarga en vivo (hot-reload)
pnpm --filter backend run dev

# Compilar el proyecto para producción
pnpm --filter backend run build

# Iniciar el build compilado
pnpm --filter backend run start:prod
```

Una vez iniciado el servidor:
* **API REST Base:** [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
* **Documentación Interactiva (Swagger):** [http://localhost:3001/api](http://localhost:3001/api)
* **Healthcheck:** [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health)

---

## 5. Inspección Visual de la Base de Datos (Prisma Studio)

Para ver, editar y consultar todas las tablas de la base de datos en una interfaz web amigable:

```bash
pnpm --filter backend run prisma:studio
```
Abre [http://localhost:5555](http://localhost:5555) en tu navegador.

---

## 6. Testing y Calidad de Código

El proyecto utiliza **Vitest** para pruebas unitarias de ultra alta velocidad y **Oxlint** para análisis estático:

```bash
# Ejecutar toda la suite de pruebas unitarias
pnpm --filter backend run test

# Modo interactivo / observador (watch mode)
pnpm --filter backend run test:watch

# Ejecutar el linter estricto (Oxlint)
pnpm --filter backend run lint

# Formatear el código con Prettier
pnpm --filter backend run format
```

---

## 7. Estructura de Directorios

```text
apps/backend/
├── prisma/
│   ├── schema.prisma              # Modelo de datos PostgreSQL (User, Booking, Accommodation, etc.)
│   ├── migrations/                # Historial de migraciones versionadas
│   └── seed.ts                    # Script de población inicial
├── src/
│   ├── common/                    # Infraestructura transversal compartida
│   │   ├── decorators/            # @Roles(), @CurrentUser()
│   │   ├── filters/               # HttpExceptionFilter (estandarización de errores)
│   │   └── guards/                # JwtAuthGuard, RolesGuard, OptionalJwtAuthGuard
│   ├── modules/                   # Módulos de dominio (Screaming Architecture)
│   │   ├── auth/                  # Login, registro de turistas y prestadores, JWT Strategy
│   │   ├── invitations/           # Tokens de invitación emitidos por la Comisión
│   │   ├── users/                 # Consulta y auditoría de usuarios para Admin
│   │   ├── attractions/           # Catálogo de paseos y circuitos de Capilla del Monte
│   │   ├── accommodations/        # Hospedajes, búsqueda por fechas y fotos
│   │   ├── bookings/              # Motor transaccional de reservas y anti-overbooking
│   │   └── health/                # Endpoint de disponibilidad y estado de PostgreSQL
│   ├── prisma/                    # Servicio global inyectable de Prisma
│   ├── app.module.ts              # Módulo raíz de la aplicación
│   └── main.ts                    # Punto de entrada (CORS, ValidationPipe, Swagger, Filters)
├── tsconfig.json                  # Configuración de TypeScript
└── vitest.config.ts               # Configuración de Vitest
```

---

## 8. Documentación Adicional

* 📖 [**Referencia Completa de la API REST**](../../docs/api-reference.md)
* 🧪 [**Guías de Pruebas Manuales por Módulo**](../../docs/manual-testing-guide.md)
* 🏛️ [**Especificación Arquitectónica y Principios SOLID**](../../docs/architecture.md)
