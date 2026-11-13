# Turismo Capilla — Ficha Técnica y Documento de Pase a Producción

Documento oficial de infraestructura, despliegue y manual de operaciones para la plataforma web turística y motor de reservas de **Capilla del Monte, Córdoba, Argentina**.

---

## 1. Topología y Arquitectura del Sistema

El ecosistema opera bajo una arquitectura distribuida desacoplada, asegurando alta disponibilidad para el tráfico de visitantes y aislamiento de procesos de negocio:

```mermaid
flowchart TD
    subgraph Edge ["Capa Frontend (Vercel Edge Network)"]
        Portal["Portal Turístico Público\n(portal-turismo-opal.vercel.app)"]
        Dashboard["Panel de Prestadores & Admin\n(turismo-dashboard-tan.vercel.app)"]
    end

    subgraph VPS ["VPS Host (Dokploy / Traefik / Docker Swarm)"]
        Traefik["Traefik Reverse Proxy\n(SSL Let's Encrypt)"]
        BackendApp["Backend REST API\nSpring Boot 4 / Java 17 Temurin\n(Port 8080)"]
    end

    subgraph DataPlane ["Capa de Datos & Servicios Externos"]
        Supabase[("Supabase PostgreSQL 17\n(Pooler sa-east-1)")]
        Cloudinary["Cloudinary CDN\n(Almacenamiento Multimedia)"]
    end

    Portal -->|HTTPS REST API / JSON| Traefik
    Dashboard -->|HTTPS REST API / JWT| Traefik
    Traefik -->|Proxy Interno| BackendApp
    BackendApp -->|JDBC SSL Pooler 5432| Supabase
    BackendApp -->|API Uploads| Cloudinary
```

---

## 2. Puntos de Entrada y URLs de Producción

| Servicio | Entorno / Proveedor | URL Oficial | Estado |
| :--- | :--- | :--- | :--- |
| **Portal Turístico Público** | Vercel Edge (`portal-turismo`) | [https://portal-turismo-opal.vercel.app](https://portal-turismo-opal.vercel.app) | 🟢 Activo |
| **Panel de Gestión (Dashboard)** | Vercel Edge (`turismo-dashboard`) | [https://turismo-dashboard-tan.vercel.app](https://turismo-dashboard-tan.vercel.app) | 🟢 Activo |
| **API REST Backend** | VPS Dokploy (`backend-turismo`) | [https://services.equarys.com/turismo-api/api/v1](https://services.equarys.com/turismo-api/api/v1) | 🟢 Activo |
| **Documentación Interactiva (Swagger)** | VPS Dokploy | [https://services.equarys.com/turismo-api/swagger-ui.html](https://services.equarys.com/turismo-api/swagger-ui.html) | 🟢 Activo |
| **Especificación OpenAPI (JSON)** | VPS Dokploy | [https://services.equarys.com/turismo-api/v3/api-docs](https://services.equarys.com/turismo-api/v3/api-docs) | 🟢 Activo |

---

## 3. Base de Datos (Supabase Managed PostgreSQL)

* **Organización:** `Gestion`
* **Proyecto:** `noymbaqsyviwfvoxgpmo`
* **Región:** `sa-east-1` (São Paulo, Brasil — latencia óptima para Argentina)
* **Motor:** PostgreSQL 17.11
* **Host del Pooler:** `aws-0-sa-east-1.pooler.supabase.com`
* **Puerto:** `5432` (Modo Sesión con soporte de transacciones complejas, DDL y prepared statements)
* **Usuario:** `postgres.noymbaqsyviwfvoxgpmo`
* **Directiva DDL Hibernate:** `spring.jpa.hibernate.ddl-auto=update`

> [!NOTE]
> La conexión utiliza el IPv4 Pooler en modo sesión (`5432`). Se descartó el modo transacción (`6543` PgBouncer) debido a que Spring Data JPA y Hibernate requieren retención de estado de sesión para el manejo de colecciones diferidas (*lazy loading*), bloqueos pesimistas y generación de esquema.

---

## 4. Servidor de Aplicación (Dokploy en VPS)

* **Panel Dokploy:** `https://cloud.equarys.com`
* **IP del Servidor:** `72.61.54.40`
* **Proyecto:** `Turismo-Capilla` (`C_FjUJ2GB5B-iNd-BPD8T`)
* **Aplicación:** `backend-turismo` (`ggy31vWXLZE0z4ZYiGzf8`)
* **Estrategia de Build:** Multi-stage `Dockerfile` (Maven 3.9 + Eclipse Temurin 17 Alpine JRE).
* **Repositorio Origen:** `https://github.com/Tiag4/backend-capilla-turismo.git` (`develop`).

### Variables de Entorno en Dokploy

```env
PORT=8080
DB_URL=jdbc:postgresql://aws-0-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
DB_USERNAME=postgres.noymbaqsyviwfvoxgpmo
DB_PASSWORD=[PROTECTED]
JWT_SECRET=9a6747f3b64c61d4a607645061ce7212513a94f55393b2cef440355125a4e921
JWT_EXPIRATION=86400000
STORAGE_PROVIDER=cloudinary
CLOUDINARY_URL=cloudinary://476644815221196:x099anE0a2euhAxBy5mxP8yF3Sc@wgmfpnwz
CLOUDINARY_CLOUD_NAME=wgmfpnwz
CLOUDINARY_API_KEY=476644815221196
CLOUDINARY_API_SECRET=x099anE0a2euhAxBy5mxP8yF3Sc
CORS_ALLOWED_ORIGINS=https://portal-turismo-opal.vercel.app,https://turismo-dashboard-tan.vercel.app,http://localhost:5173,http://localhost:5174,http://localhost:4173
JAVA_OPTS=-Xmx512m -Xms256m
```

---

## 5. Frontends en Vercel

### 5.1 Portal Turístico (`portal-turismo`)
* **Framework:** React 19 + Vite + Tailwind CSS v4 + GSAP
* **Variables de Entorno en Vercel:**
  * `VITE_API_URL`: `https://services.equarys.com/turismo-api/api/v1`
  * `VITE_DASHBOARD_URL`: `https://turismo-dashboard-tan.vercel.app`

### 5.2 Dashboard de Gestión (`turismo-dashboard`)
* **Framework:** React 19 + Vite + Tailwind CSS v4 + dnd-kit
* **Variables de Entorno en Vercel:**
  * `VITE_API_URL`: `https://services.equarys.com/turismo-api/api/v1`
  * `VITE_PORTAL_URL`: `https://portal-turismo-opal.vercel.app`

---

## 6. Credenciales de Prueba Iniciales (Sembradas en BD)

Todas las cuentas se encuentran inicializadas por `DataInitializer` en la base de datos de producción:

| Rol | Correo Electrónico | Contraseña | Establecimiento / Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@capilladelmonte.gov.ar` | `AdminCapilla2026!` | Auditoría, temporadas, revisión de comercios y farmacias |
| **Prestador 1 (Host)** | `host@capilladelmonte.gov.ar` | `HostCapilla2026!` | Cabañas Pircas del Uritorco |
| **Prestadora 2 (Host)** | `marcela.rossi@capillaturismo.com.ar` | `HostCapilla2026!` | Hostería Boutique Los Nogales (inventario multi-unidad) |
| **Prestador 3 (Host)** | `carlos.benitez@capillaturismo.com.ar` | `HostCapilla2026!` | Refugio Los Alazanes |

---

## 7. Manual Operativo de Mantenimiento

### Actualizaciones del Backend
1. Los desarrollos se prueban localmente (`.\mvnw.cmd test`) y se integran a la rama `develop`.
2. Al pushear a `origin/develop`, Dokploy compila automáticamente el nuevo JAR dentro del contenedor.
3. Para forzar un redespliegue manual:
   * Vía panel web: **Dokploy ➔ Turismo-Capilla ➔ backend-turismo ➔ Deploy**.
   * Vía MCP / CLI: Ejecutar `dokploy_redeploy(name: "backend-turismo")`.

### Actualizaciones del Frontend
1. Realizar cambios en `apps/portal-turismo` o `apps/dashboard`.
2. Desde el directorio de la app correspondiente, ejecutar:
   ```bash
   npx vercel --prod --yes
   ```
3. La CDN de Vercel invalida la caché y distribuye el nuevo bundle en menos de 30 segundos.
