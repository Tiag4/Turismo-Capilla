# Guías de Pruebas Manuales — Turismo Capilla del Monte

Este índice centraliza los documentos individuales de pruebas manuales para cada módulo del sistema, diseñados para probar los endpoints interactivamente a través de **Swagger UI** ([http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)) y auditar la persistencia en **PostgreSQL**.

> [!TIP]
> Para consultar todas las cuentas de prueba, contraseñas y datos bancarios sembrados, revisá [docs/test-credentials.md](./test-credentials.md). Para una guía paso a paso de uso de la plataforma, consultá el [Manual de Usuario Oficial](./user-manual.md).

---

## 1. Preparación del Entorno

### Paso 1: Iniciar el Servidor Backend
Desde el repositorio independiente `backend-capilla-turismo`:
```powershell
# Opción A: Script que carga automáticamente las variables desde .env
.\dev.ps1

# Opción B: Maven Wrapper directo
.\mvnw.cmd spring-boot:run
```
* **Swagger UI interactivo:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
* **Especificación OpenAPI (JSON):** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Paso 2: Herramientas de Inspección de Base de Datos
* **Terminal SQL (`psql`):**
  ```powershell
  psql -U postgres -d portal_turismo
  ```
* **Clientes Gráficos (GUI):**
  * DBeaver, pgAdmin 4 o DataGrip conectados a `localhost:5432` / base de datos `portal_turismo`.

---

## 2. Documentos de Pruebas por Módulo

Haz clic en el enlace del módulo que desees probar para ver el detalle de cada endpoint, payloads de ejemplo y consultas SQL de verificación:

1. 🔐 [**01 - Autenticación, Invitaciones y Roles**](./manual-testing/01-auth-and-invitations.md)  
   * Login Admin, generación y validación de tokens de invitación, registro de prestadores (`HOST`), registro de turistas (`TOURIST`), perfil `/auth/me`.

2. 🏔️ [**02 - Atractivos y Paseos Turísticos**](./manual-testing/02-attractions.md)  
   * Catálogo público con filtros (`category`, `difficulty`, `requiresGuide`, `search`), creación/edición/baja institucional (`ADMIN`) y galería de imágenes.

3. 🏡 [**03 - Alojamientos y Hospedajes**](./manual-testing/03-accommodations.md)  
   * Catálogo público con filtros por fechas (algoritmo anti-overbooking), capacidad de huéspedes, tipo y amenidades; panel de cabañas del prestador (`my-accommodations`), alta, edición, control de permisos de dueño, subida de fotos a Cloudinary e inventario multi-unidad.

4. 📅 [**04 - Motor de Reservas y Anti-Overbooking**](./manual-testing/04-bookings.md)  
   * Solicitud de reserva, bloqueo transaccional de solapamiento de fechas (HTTP 409 Conflict), máquina de estados (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`), notificaciones y búsqueda pública por código `CAP-YYYY-XXXX`.

---

## 3. Consultas SQL de Diagnóstico Rápido

Para auditar el estado global de la base de datos `portal_turismo`:

```sql
-- 1. Ver usuarios y sus roles
SELECT id, name, last_name, email, role, is_active FROM users;

-- 2. Ver invitaciones emitidas y si fueron usadas
SELECT token, email, expires_at, used_at FROM invitation_tokens;

-- 3. Ver atractivos registrados y sus tarifas
SELECT id, name, category, difficulty, admission_fee, status FROM attractions;

-- 4. Ver alojamientos con sus prestadores dueños
SELECT a.name AS alojamiento, a.price_per_night, a.max_guests, a.is_active, u.email AS prestador
FROM accommodations a
JOIN users u ON a.host_id = u.id;

-- 5. Ver reservas registradas y sus estados
SELECT code, check_in, check_out, total_amount, status, guest_name, guest_email
FROM bookings
ORDER BY created_at DESC;
```
