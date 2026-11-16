# Planificación de Endpoints de la API REST — Turismo Capilla del Monte

Este documento define la especificación de endpoints para el backend en **Spring Boot 3 (Java 17)**, mapeados directamente a las Historias de Usuario (`HU-01` a `HU-10`) y las nuevas capacidades del ecosistema.

> [!TIP]
> Para la especificación de payloads y respuestas completas, consultá [docs/api-reference.md](./api-reference.md).

---

## 1. Módulo de Autenticación e Invitaciones (`/api/v1/auth`, `/api/v1/invitations`)

Permite la gestión de acceso restringido para prestadores formalmente adheridos por la Comisión de Turismo.

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/invitations` | `ADMIN` (JWT) | Genera un token único con vencimiento de 7 días para invitar a un prestador. | `HU-10` |
| `GET` | `/api/v1/invitations` | `ADMIN` (JWT) | Lista invitaciones emitidas, vencimiento y estado de uso. | `HU-10` |
| `GET` | `/api/v1/invitations/validate/{token}` | Público | Valida si un token existe, está activo y no expiró. | `HU-10` |
| `DELETE` | `/api/v1/invitations/{token}` | `ADMIN` (JWT) | Revoca un token de invitación. | `HU-10` |
| `POST` | `/api/v1/auth/register-host` | Público (con Token) | Registra un nuevo Cabañero/Prestador validando el token de invitación. | `HU-10`, `HU-07` |
| `POST` | `/api/v1/auth/register-tourist` | Público | Registra una cuenta de turista voluntaria. | `HU-06` |
| `POST` | `/api/v1/auth/login` | Público | Autentica un usuario (email + password) y retorna token JWT con su rol. | Transversal |
| `GET` | `/api/v1/auth/me` | Autenticado (JWT) | Obtiene los datos del perfil del usuario en sesión. | Transversal |

---

## 2. Módulo de Alojamientos y Habitaciones (`/api/v1/accommodations`)

Gestiona el catálogo público de hospedajes, panel de prestadores e inventario multi-unidad.

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/accommodations` | Público | Lista alojamientos con filtros (`checkIn`/`checkOut`, huéspedes, tipo). Excluye suspendidos. | `HU-04`, `HU-08` |
| `GET` | `/api/v1/accommodations/my-accommodations` | `HOST` / `ADMIN` | Alojamientos asociados al prestador en sesión. | `HU-07` |
| `GET` | `/api/v1/accommodations/{id}` | Público | Ficha completa de un alojamiento (fotos, servicios, seña, CBU/Alias). | `HU-05` |
| `POST` | `/api/v1/accommodations` | `HOST` / `ADMIN` | Alta de nuevo establecimiento vinculado al prestador. | `HU-07` |
| `PUT` | `/api/v1/accommodations/{id}` | `HOST` (dueño) / `ADMIN` | Modificación de datos, precio base por noche y capacidad. | `HU-07` |
| `DELETE` | `/api/v1/accommodations/{id}` | `HOST` (dueño) / `ADMIN` | Baja de alojamiento. | `HU-07` |
| `GET` | `/api/v1/accommodations/{id}/room-types` | Público | Consulta de inventario de habitaciones y planes de tarifa (hosterías/hoteles). | `HU-20` |

---

## 3. Módulo Multimedia y Almacenamiento Cloudinary (`/api/v1/media`)

Servicio agnóstico para carga optimizada y borrado de imágenes en Cloudinary.

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | `HOST` / `ADMIN` | Carga `multipart/form-data` (máx 5MB). Retorna `url` y `publicId`. | `HU-07` |
| `DELETE` | `/api/v1/media/{publicId}` | `HOST` / `ADMIN` | Eliminación de imagen de la nube Cloudinary. | `HU-07` |

---

## 4. Módulo de Reservas (`/api/v1/bookings`)

Motor transaccional para la solicitud, confirmación y control de sobreventa (*overbooking*).

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | Público / Turista | Solicita una reserva validando atómicamente la no superposición de fechas (`PENDING`). | `HU-06` |
| `GET` | `/api/v1/bookings/my-bookings` | `HOST` (JWT) | Lista todas las reservas recibidas para los alojamientos del prestador. | `HU-09` |
| `GET` | `/api/v1/bookings/public/lookup` | Público | Consulta el estado y detalle de una reserva mediante código `CAP-YYYY-XXXX` y email. | `HU-06` |
| `GET` | `/api/v1/bookings/{id}` | `HOST` / Turista / `ADMIN` | Detalle exhaustivo de una reserva por su ID. | `HU-06`, `HU-09` |
| `PATCH` | `/api/v1/bookings/{id}/status` | `HOST` (dueño) / `ADMIN` | Actualiza estado de reserva (`CONFIRMED`, `CANCELLED`, `COMPLETED`) y notifica. | `HU-09` |

---

## 5. Módulo de Atractivos y Paseos (`/api/v1/attractions`)

Provee la información institucional y turística de Capilla del Monte (cerros, balnearios, circuitos).

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/attractions` | Público | Lista de paseos categorizados (`HILL`, `RIVER_BEACH`, `CULTURAL`, etc.). | `HU-02`, `HU-08` |
| `GET` | `/api/v1/attractions/{id}` | Público | Ficha técnica completa de un atractivo (dificultad, duración, fotos, guía). | `HU-03` |
| `POST` | `/api/v1/attractions` | `ADMIN` (JWT) | Alta de un nuevo paseo turístico gestionado por la Comisión. | `HU-02` |
| `PUT` | `/api/v1/attractions/{id}` | `ADMIN` (JWT) | Edición de información técnica, recomendaciones o estado operativo. | `HU-03` |
| `DELETE` | `/api/v1/attractions/{id}` | `ADMIN` (JWT) | Baja de un atractivo turístico. | `HU-02` |

---

## 6. Módulo de Alertas y Eventos (`/api/v1/alerts`, `/api/v1/events`)

Gestión de seguridad para excursionistas y agenda cultural municipal.

| Método | Ruta | Rol / Guardia | Descripción | Historia de Usuario |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/alerts/active` | Público | Avisos activos de Defensa Civil / Bomberos con nivel de severidad. | Transversal |
| `POST` | `/api/v1/alerts` | `ADMIN` (JWT) | Creación de alerta meteorológica o de seguridad. | Transversal |
| `GET` | `/api/v1/events` | Público | Cronograma de actividades culturales, ferias y festivales. | Transversal |
| `POST` | `/api/v1/events` | `ADMIN` (JWT) | Publicación de un evento en la agenda municipal. | Transversal |
