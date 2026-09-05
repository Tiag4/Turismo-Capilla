# Guía de Pruebas Manuales — Turismo Capilla del Monte

Esta guía detalla el paso a paso para probar manualmente cada endpoint del backend mediante la interfaz interactiva de **Swagger** y verificar la persistencia e integridad de datos directamente en **PostgreSQL** (mediante SQL o Prisma Studio).

---

## 1. Preparación del Entorno

### Paso 1: Iniciar el Backend
Desde la raíz del repositorio:
```bash
pnpm dev
```
* **Swagger UI:** Abre en tu navegador [http://localhost:3001/api](http://localhost:3001/api).

### Paso 2: Abrir Herramienta de Inspección de Base de Datos
Tienes dos opciones para ver la base de datos en tiempo real:

* **Opción A (Visual - Recomendada): Prisma Studio**
  En una segunda terminal ejecuta:
  ```bash
  pnpm --filter backend run prisma:studio
  ```
  Abre [http://localhost:5555](http://localhost:5555) en tu navegador para ver todas las tablas en vivo.

* **Opción B (Terminal SQL): `psql`**
  ```bash
  psql -U postgres -d turismo_capilla
  ```

---

## 2. Flujo de Pruebas por Módulo

---

### Fase 1: Atractivos y Paseos Turísticos (`/api/v1/attractions`)

#### Prueba 1.1: Crear un Paseo Turístico
1. En Swagger, expande `POST /api/v1/attractions` y pulsa **"Try it out"**.
2. Ingresa el siguiente JSON en el cuerpo de la petición:
   ```json
   {
     "name": "Cerro Uritorco",
     "description": "El pico más alto de las Sierras Chicas con 1979 msnm. Famoso por sus senderos y mística.",
     "category": "HILL",
     "difficulty": "ALTA",
     "estimatedDuration": "6 a 8 horas",
     "howToGet": "Acceso por la base del cerro, a 3 km del centro de Capilla del Monte.",
     "requiresGuide": false,
     "admissionFee": 15000.00,
     "latitude": -30.8492,
     "longitude": -64.4789
   }
   ```
3. Pulsa **"Execute"**. Debe responder con código **HTTP 201 Created** y el objeto creado con su `id` generado.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT id, name, category, difficulty, "admissionFee" FROM attractions;
   ```

#### Prueba 1.2: Listar Paseos con Filtros
1. En Swagger, expande `GET /api/v1/attractions`.
2. Pulsa **"Try it out"**, selecciona `category: HILL` y pulsa **"Execute"**.
3. Debe retornar una lista que contenga el "Cerro Uritorco" (**HTTP 200 OK**).

---

### Fase 2: Autenticación, Invitaciones y Usuarios (`/api/v1/auth`, `/api/v1/invitations`)

#### Prueba 2.1: Generar Token de Invitación (Comisión de Turismo)
1. En Swagger, expande `POST /api/v1/invitations`.
2. Envía los datos del nuevo prestador adherido:
   ```json
   {
     "email": "cabanias.valle@gmail.com"
   }
   ```
3. Debe responder con **HTTP 201** y un token único (ej. `inv-8f4b1a2c...`). Copia este token.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT id, token, email, "expiresAt", "usedAt" FROM invitation_tokens;
   ```

#### Prueba 2.2: Registrar Prestador con Token Validado
1. En Swagger, expande `POST /api/v1/auth/register-host`.
2. Envía el formulario completando el token obtenido:
   ```json
   {
     "token": "PEGA_AQUI_EL_TOKEN_OBTENIDO",
     "name": "Carlos",
     "lastName": "Gómez",
     "email": "cabanias.valle@gmail.com",
     "password": "PasswordSegura123!",
     "phone": "+543548123456"
   }
   ```
3. Debe responder con **HTTP 201 Created**.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT id, name, "lastName", email, role FROM users;
   SELECT token, "usedAt" FROM invitation_tokens; -- usedAt no debe ser NULL
   ```

#### Prueba 2.3: Iniciar Sesión y Autorizarse en Swagger
1. En Swagger, expande `POST /api/v1/auth/login`.
2. Envía las credenciales registradas:
   ```json
   {
     "email": "cabanias.valle@gmail.com",
     "password": "PasswordSegura123!"
   }
   ```
3. Debe responder **HTTP 200 OK** con el token JWT:
   ```json
   {
     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
     "user": { ... }
   }
   ```
4. **Autorizar Swagger:** Copia el `accessToken`. En la esquina superior derecha de Swagger, pulsa el botón verde **"Authorize"**, pega el token en el campo `Value` y pulsa **Authorize**. Ahora todos los endpoints protegidos usarán este token automáticamente.

---

### Fase 3: Alojamientos (`/api/v1/accommodations`)

#### Prueba 3.1: Dar de Alta una Cabaña
1. En Swagger, expande `POST /api/v1/accommodations`.
2. Envía el payload:
   ```json
   {
     "name": "Cabañas del Sol",
     "description": "Hermosas cabañas con vista panorámica al Cerro Uritorco, piscina y asador individual.",
     "type": "CABIN",
     "address": "Av. Las Gemelas 450",
     "locality": "Capilla del Monte",
     "pricePerNight": 45000.00,
     "maxGuests": 5,
     "amenities": ["Wi-Fi", "Piscina", "Estacionamiento", "Parrilla", "Aire Acondicionado"],
     "latitude": -30.8541,
     "longitude": -64.5213
   }
   ```
3. Debe responder con **HTTP 201 Created** y el ID del alojamiento. Copia este `id`.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT id, name, type, "pricePerNight", "maxGuests", "hostId" FROM accommodations;
   ```

#### Prueba 3.2: Búsqueda Pública de Alojamientos con Filtros
1. En Swagger, expande `GET /api/v1/accommodations`.
2. Prueba filtrar con `guests: 4` y rango de fechas estimadas.
3. Debe retornar la cabaña creada si su capacidad es suficiente (**HTTP 200 OK**).

---

### Fase 4: Motor de Reservas y Prevención de Overbooking (`/api/v1/bookings`)

#### Prueba 4.1: Crear Solicitud de Reserva (Turista)
1. En Swagger, expande `POST /api/v1/bookings`.
2. Ingresa los datos de la estadía para el alojamiento creado:
   ```json
   {
     "accommodationId": "ID_DE_LA_CABAÑA_CREADA",
     "checkIn": "2026-10-10",
     "checkOut": "2026-10-15",
     "guestCount": 3,
     "guestName": "Lucía Fernández",
     "guestEmail": "lucia.turista@gmail.com",
     "guestPhone": "+541198765432",
     "guestOrigin": "Buenos Aires",
     "notes": "Llegamos en horario de la tarde."
   }
   ```
3. Debe responder con **HTTP 201 Created**, generando un código único (ej. `CAP-2026-8912`) y estado `PENDING`.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT id, "bookingCode", "checkIn", "checkOut", "totalNights", "totalAmount", status 
   FROM bookings;
   ```

#### Prueba 4.2: Prueba de Conflicto de Fechas (Anti-Overbooking)
1. Intenta enviar **exactamente la misma reserva** (o una que se solape, ej. `checkIn: 2026-10-12` a `checkOut: 2026-10-14`).
2. **Resultado Esperado:** El sistema debe rechazar la solicitud con código **HTTP 409 Conflict** y el mensaje:
   ```json
   {
     "statusCode": 409,
     "message": "El alojamiento no tiene disponibilidad para las fechas seleccionadas."
   }
   ```
3. **Verificación en PostgreSQL:**
   ```sql
   -- Verifica que NO se creó una segunda reserva solapada
   SELECT count(*) FROM bookings WHERE "accommodationId" = 'ID_DE_LA_CABAÑA_CREADA';
   ```

#### Prueba 4.3: Confirmación de Reserva por el Cabañero
1. En Swagger, expande `PATCH /api/v1/bookings/{id}/status`.
2. Ingresa el `id` de la reserva y el nuevo estado:
   ```json
   {
     "status": "CONFIRMED"
   }
   ```
3. Debe responder con **HTTP 200 OK**.
4. **Verificación en PostgreSQL:**
   ```sql
   SELECT "bookingCode", status, "updatedAt" FROM bookings;
   -- status debe figurar como CONFIRMED
   ```

---

## 3. Resumen de Consultas SQL de Diagnóstico Rápido

Para auditar el estado completo de tu base de datos en cualquier momento desde `psql`:

```sql
-- 1. Ver usuarios y sus roles
SELECT id, name, "lastName", email, role FROM users;

-- 2. Ver invitaciones emitidas y si fueron usadas
SELECT token, email, "expiresAt", "usedAt" FROM invitation_tokens;

-- 3. Ver alojamientos con sus prestadores
SELECT a.name AS cabaña, a."pricePerNight", a."maxGuests", u.name AS dueño
FROM accommodations a
JOIN users u ON a."hostId" = u.id;

-- 4. Ver reservas activas con detalle de fechas
SELECT b."bookingCode", a.name AS cabaña, b."guestName", b."checkIn", b."checkOut", b.status
FROM bookings b
JOIN accommodations a ON b."accommodationId" = a.id
ORDER BY b."checkIn" ASC;
```
